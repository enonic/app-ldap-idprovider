package com.enonic.app.ldapidprovider;

import com.enonic.xp.testing.ScriptRunnerSupport;

public class LdapGroupMappingTest
    extends ScriptRunnerSupport
{
    @Override
    public String getScriptTestFile()
    {
        return "/lib/groupMapping-test.js";
    }
}
