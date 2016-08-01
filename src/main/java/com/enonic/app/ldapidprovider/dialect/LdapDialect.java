/*
 * Copyright 2000-2013 Enonic AS
 * http://www.enonic.com/license
 */

package com.enonic.app.ldapidprovider.dialect;

public abstract class LdapDialect
{
    private final String name;

    public LdapDialect( String name )
    {
        this.name = name;
    }

    public final String getName()
    {
        return this.name;
    }

    public abstract String getUserIdAttribute();

    public abstract String getUserObjectClass();

    public abstract String getGroupObjectClass();

    public String getUserSyncAttribute()
    {
        return getUserIdAttribute();
    }

    public abstract String getPasswordAttribute();

    public String getGroupSyncAttribute()
    {
        return getGroupIdAttribute();
    }

    public abstract String getGroupIdAttribute();

    public abstract String getGroupMemberAttribute();

    public boolean supportsPaging()
    {
        return false;
    }

    public Object encodePassword(String password )
    {
        return password;
    }

    public boolean changePasswordRequiresSecure()
    {
        return false;
    }

    public String getNameKey()
    {
        return "uid";
    }
}
