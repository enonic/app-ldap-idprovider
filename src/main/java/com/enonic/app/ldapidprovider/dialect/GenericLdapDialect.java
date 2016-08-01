/*
 * Copyright 2000-2013 Enonic AS
 * http://www.enonic.com/license
 */

package com.enonic.app.ldapidprovider.dialect;

public final class GenericLdapDialect
    extends LdapDialect
{
    public GenericLdapDialect()
    {
        super( "generic" );
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
        return "groupOfNames";
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
        return "member";
    }
}
