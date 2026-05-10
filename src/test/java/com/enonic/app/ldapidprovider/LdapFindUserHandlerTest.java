package com.enonic.app.ldapidprovider;

import org.junit.Assert;
import org.junit.Test;

public class LdapFindUserHandlerTest
{
    @Test
    public void testBinaryAttributeValue()
    {
        Assert.assertEquals( "AQID", LdapFindUserHandler.toSerializableAttributeValue( new byte[]{1, 2, 3} ) );
    }

    @Test
    public void testStringAttributeValue()
    {
        Assert.assertEquals( "value", LdapFindUserHandler.toSerializableAttributeValue( "value" ) );
    }
}
