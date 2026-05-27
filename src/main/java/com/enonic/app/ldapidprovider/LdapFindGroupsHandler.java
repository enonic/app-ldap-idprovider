package com.enonic.app.ldapidprovider;

import java.util.ArrayList;
import java.util.List;

import javax.naming.NamingEnumeration;
import javax.naming.PartialResultException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.SearchControls;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LdapFindGroupsHandler
    extends AbstractLdapHandler
{
    private static final Logger LOG = LoggerFactory.getLogger( LdapFindGroupsHandler.class );

    private static final String MEMBER_OF_ATTRIBUTE = "memberOf";

    private String userDn;

    public void setUserDn( final String userDn )
    {
        this.userDn = userDn;
    }

    public List<String> execute()
    {
        final List<String> groups = new ArrayList<>();
        final DirContext dirContext = bind();
        if ( dirContext == null )
        {
            return groups;
        }

        try
        {
            SearchControls searchControls = new SearchControls();
            searchControls.setSearchScope( SearchControls.OBJECT_SCOPE );
            searchControls.setReturningAttributes( new String[]{MEMBER_OF_ATTRIBUTE} );

            final NamingEnumeration<?> searchResultEnumeration = dirContext.search( userDn, "(objectClass=*)", searchControls );
            if ( searchResultEnumeration.hasMore() )
            {
                final javax.naming.directory.SearchResult searchResult =
                    (javax.naming.directory.SearchResult) searchResultEnumeration.next();
                final Attributes attributes = searchResult.getAttributes();
                final Attribute memberOfAttribute = attributes.get( MEMBER_OF_ATTRIBUTE );

                if ( memberOfAttribute != null )
                {
                    final NamingEnumeration<?> memberOfValues = memberOfAttribute.getAll();
                    while ( memberOfValues.hasMore() )
                    {
                        final String groupDn = (String) memberOfValues.next();
                        groups.add( groupDn );
                    }
                }
            }
            LOG.debug( "Found " + groups.size() + " groups for user DN [" + userDn + "]" );
        }
        catch ( PartialResultException e )
        {
            //Ignores PartialResultException
            LOG.debug( "Partial result error occurred while searching for groups for user DN [" + userDn + "]: ", e );
        }
        catch ( Exception e )
        {
            LOG.error( "Error occurred while searching for groups for user DN [" + userDn + "]: ", e );
        }

        return groups;
    }
}
