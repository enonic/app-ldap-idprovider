/*
 * Copyright 2000-2013 Enonic AS
 * http://www.enonic.com/license
 */

package com.enonic.app.ldapidprovider.dialect;

public final class OracleLdapDialect
    extends LdapDialect
{
    public OracleLdapDialect()
    {
        super( "oracle" );
    }

    public String getUserIdAttribute()
    {
        return "uid";
    }

    public String getUserObjectClass()
    {
        return "inetOrgPerson";
    }

    public String getPasswordAttribute()
    {
        return "userPassword";
    }
}
