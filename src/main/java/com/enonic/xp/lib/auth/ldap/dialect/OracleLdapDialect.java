/*
 * Copyright 2000-2013 Enonic AS
 * http://www.enonic.com/license
 */

package com.enonic.xp.lib.auth.ldap.dialect;

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

    public String getGroupObjectClass()
    {
        return "groupOfUniqueNames";
    }

    public String getPasswordAttribute()
    {
        return "userPassword";
    }

    public String getGroupIdAttribute()
    {
        return "cn";
    }

    public String getGroupMemberAttribute()
    {
        return "uniquemember";
    }

    public boolean supportsPaging()
    {
        return false;
    }

    public boolean changePasswordRequiresSSL()
    {
        return false;
    }
}
