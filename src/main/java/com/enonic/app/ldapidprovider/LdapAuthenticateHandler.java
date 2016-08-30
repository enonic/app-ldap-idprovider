package com.enonic.app.ldapidprovider;

import javax.naming.directory.DirContext;

public class LdapAuthenticateHandler
    extends AbstractLdapHandler
{
    public boolean execute()
    {
        final DirContext dirContext = bind();
        return dirContext != null;
    }
}
