/*
 * Copyright 2000-2013 Enonic AS
 * http://www.enonic.com/license
 */

package com.enonic.app.ldapidprovider.dialect;

public final class AdLdapDialect
    extends LdapDialect
{
    private final static int UF_PASSWORD_NOT_REQUIRED = 0x0020;

    private final static int UF_NORMAL_ACCOUNT = 0x0200;

    private final static String ENABLED_ACCOUNT = Integer.toString( UF_NORMAL_ACCOUNT | UF_PASSWORD_NOT_REQUIRED );

    public AdLdapDialect()
    {
        super( "ad" );
    }

    public String getUserIdAttribute()
    {
        return "sAMAccountName";
    }

    @Override
    public String getUserSyncAttribute()
    {
        return "objectSid";
    }

    public String getUserObjectClass()
    {
        return "organizationalPerson";
    }

    public String getGroupObjectClass()
    {
        return "group";
    }

    public String getPasswordAttribute()
    {
        return "unicodePwd";
    }

    public String getGroupIdAttribute()
    {
        return "cn";
    }

    public String getGroupMemberAttribute()
    {
        return "member";
    }

    public boolean supportsPaging()
    {
        return true;
    }

    public Object encodePassword(String password )
    {
        String quotedPassword = "\"" + password + "\"";

        char unicodePwd[] = quotedPassword.toCharArray();
        byte pwdArray[] = new byte[unicodePwd.length * 2];
        for ( int i = 0; i < unicodePwd.length; i++ )
        {
            pwdArray[i * 2 + 1] = (byte) ( unicodePwd[i] >>> 8 );
            pwdArray[i * 2] = (byte) ( unicodePwd[i] & 0xff );
        }

        return pwdArray;
    }

    public String getNameKey()
    {
        return "cn";
    }

    public boolean changePasswordRequiresSecure()
    {
        return true;
    }
}
