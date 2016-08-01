package com.enonic.app.ldapidprovider;

import javax.naming.NamingEnumeration;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LdapFindUserHandler
    extends AbstractLdapHandler
{
    private static final Logger LOG = LoggerFactory.getLogger( LdapFindUserHandler.class );

    private static final String DISPLAY_NAME_ATTRIBUTE_KEY = "cn";

    private static final String EMAIL_ATTRIBUTE_KEY = "mail";

    private String userBaseDn;

    private String username;

    public void setUserBaseDn( final String userBaseDn )
    {
        this.userBaseDn = userBaseDn;
    }

    public void setUsername( final String username )
    {
        this.username = username;
    }

    public LdapUserMapper execute()
    {
        final DirContext dirContext = bind();
        if ( dirContext == null )
        {
            return null;
        }

        SearchControls searchControls = new SearchControls();
        String[] attributeFilter = {DISPLAY_NAME_ATTRIBUTE_KEY, EMAIL_ATTRIBUTE_KEY};
        searchControls.setReturningAttributes( attributeFilter );
        searchControls.setSearchScope( SearchControls.SUBTREE_SCOPE );

        final String sanitizedUsername = sanitizeLdapSearchString( username );
        final String filter =
            "(&(objectClass=" + ldapDialect.getUserObjectClass() + ")(" + ldapDialect.getUserIdAttribute() + "=" + sanitizedUsername + "))";

        try
        {
            final NamingEnumeration<SearchResult> namingEnumeration = dirContext.search( userBaseDn, filter, searchControls );
            if ( namingEnumeration.hasMore() )
            {
                final SearchResult searchResult = namingEnumeration.next();
                final String userDn = searchResult.getNameInNamespace();
                final Attributes searchResultAttributes = searchResult.getAttributes();
                final Attribute displayNameAttribute = searchResultAttributes.get( DISPLAY_NAME_ATTRIBUTE_KEY );
                final Attribute emailAttribute = searchResultAttributes.get( EMAIL_ATTRIBUTE_KEY );

                return LdapUserMapper.create().
                    dn( userDn ).
                    login( username ).
                    displayName( displayNameAttribute.size() > 0 ? (String) displayNameAttribute.get( 0 ) : null ).
                    email( emailAttribute.size() > 0 ? (String) emailAttribute.get( 0 ) : null ).
                    build();
            }

        }
        catch ( Exception e )
        {
            LOG.error( "Error occured while searching for user:", e );
        }

        return null;
    }

    private String sanitizeLdapSearchString( String value )
    {
        final StringBuilder sb = new StringBuilder();
        for ( int i = 0; i < value.length(); i++ )
        {
            char c = value.charAt( i );
            switch ( c )
            {
                case '\\':
                    sb.append( "\\5c" );
                    break;
                case '*':
                    sb.append( "\\2a" );
                    break;
                case '(':
                    sb.append( "\\28" );
                    break;
                case ')':
                    sb.append( "\\29" );
                    break;
                case '\u0000':
                    sb.append( "\\00" );
                    break;
                default:
                    sb.append( c );
            }
        }
        return sb.toString();
    }
}
