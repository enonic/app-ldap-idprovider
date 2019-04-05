package com.enonic.app.ldapidprovider;

import com.enonic.xp.testing.ScriptRunnerSupport;

public class LdapIdProviderTest
    extends ScriptRunnerSupport
{
    @Override
    public String getScriptTestFile()
    {
        return "/idprovider/idprovider-test.js";
    }
}
