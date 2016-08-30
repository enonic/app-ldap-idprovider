/*
 * Copyright 2000-2013 Enonic AS
 * http://www.enonic.com/license
 */

package com.enonic.app.ldapidprovider.dialect;

public final class AdLdapDialect
    extends LdapDialect
{
    public AdLdapDialect()
    {
        super( "ad" );
    }

    public String getUserIdAttribute()
    {
        return "sAMAccountName";
    }

    public String getUserObjectClass()
    {
        return "organizationalPerson";
    }

    public String getPasswordAttribute()
    {
        return "unicodePwd";
    }
}
