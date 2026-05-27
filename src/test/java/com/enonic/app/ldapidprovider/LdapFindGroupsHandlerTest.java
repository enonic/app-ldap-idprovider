package com.enonic.app.ldapidprovider;

import java.util.List;

import org.junit.Assert;
import org.junit.Test;

public class LdapFindGroupsHandlerTest
{
    @Test
    public void testHandlerCreation()
    {
        // Simple smoke test to ensure the handler can be instantiated
        LdapFindGroupsHandler handler = new LdapFindGroupsHandler();
        Assert.assertNotNull( handler );
    }

    @Test
    public void testSetUserDn()
    {
        LdapFindGroupsHandler handler = new LdapFindGroupsHandler();
        handler.setUserDn( "cn=Test User,ou=Users,dc=example,dc=com" );
        // No exception thrown, test passes
    }

    @Test
    public void testExecuteWithoutConnection()
    {
        // Test that execute returns empty list when not connected to LDAP
        LdapFindGroupsHandler handler = new LdapFindGroupsHandler();
        handler.setLdapDialect( "generic" );
        handler.setServerUrl( "ldap://invalid-server:389" );
        handler.setAuthDn( "cn=Admin" );
        handler.setAuthPassword( "password" );
        handler.setConnectTimeout( 1000 );
        handler.setReadTimeout( 1000 );
        handler.setUserDn( "cn=Test User,ou=Users,dc=example,dc=com" );

        List<String> groups = handler.execute();

        // Should return empty list when unable to connect
        Assert.assertNotNull( groups );
        Assert.assertEquals( 0, groups.size() );
    }
}
