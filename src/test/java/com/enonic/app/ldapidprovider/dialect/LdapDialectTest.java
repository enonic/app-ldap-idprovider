package com.enonic.app.ldapidprovider.dialect;

import org.junit.Assert;
import org.junit.Test;

public class LdapDialectTest
{
    @Test
    public void testActiveDirectory()
    {
        final LdapDialect ldapDialect = LdapDialectResolver.resolve( "ad" );
        Assert.assertEquals( "sAMAccountName", ldapDialect.getUserIdAttribute() );
        Assert.assertEquals( "unicodePwd", ldapDialect.getPasswordAttribute() );
        Assert.assertEquals( "organizationalPerson", ldapDialect.getUserObjectClass() );
    }

    @Test
    public void testGeneric()
    {
        final LdapDialect ldapDialect = LdapDialectResolver.resolve( "generic" );
        Assert.assertEquals( "uid", ldapDialect.getUserIdAttribute() );
        Assert.assertEquals( "userPassword", ldapDialect.getPasswordAttribute() );
        Assert.assertEquals( "inetOrgPerson", ldapDialect.getUserObjectClass() );
    }

    @Test
    public void testOracle()
    {
        final LdapDialect ldapDialect = LdapDialectResolver.resolve( "oracle" );
        Assert.assertEquals( "uid", ldapDialect.getUserIdAttribute() );
        Assert.assertEquals( "userPassword", ldapDialect.getPasswordAttribute() );
        Assert.assertEquals( "inetOrgPerson", ldapDialect.getUserObjectClass() );
    }

    @Test(expected = IllegalArgumentException.class)
    public void testNull()
    {
        LdapDialectResolver.resolve( null );
    }

    @Test(expected = IllegalArgumentException.class)
    public void testErrors()
    {
        LdapDialectResolver.resolve( "unknown" );
    }


}
