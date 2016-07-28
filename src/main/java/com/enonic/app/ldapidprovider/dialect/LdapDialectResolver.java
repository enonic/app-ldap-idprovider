/*
 * Copyright 2000-2013 Enonic AS
 * http://www.enonic.com/license
 */

package com.enonic.app.ldapidprovider.dialect;

public final class LdapDialectResolver
{
    private static final LdapDialect[] DIALECTS = {new GenericLdapDialect(), new AdLdapDialect(), new OracleLdapDialect()};

    public static LdapDialect resolve( String name )
    {
        if ( name == null )
        {
            throw new IllegalArgumentException( "Ldap dialect must be set" );
        }

        name = name.trim();
        for ( LdapDialect dialect : DIALECTS )
        {
            if ( dialect.getName().equalsIgnoreCase( name ) )
            {
                return dialect;
            }
        }

        throw new IllegalArgumentException( "Ldap dialect [" + name + "] not found" );
    }
}
