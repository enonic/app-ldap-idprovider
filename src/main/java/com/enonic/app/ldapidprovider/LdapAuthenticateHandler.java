package com.enonic.app.ldapidprovider;

import javax.naming.directory.DirContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LdapAuthenticateHandler
    extends AbstractLdapHandler
{
    private final static Logger LOG = LoggerFactory.getLogger( LdapAuthenticateHandler.class );

    public boolean execute()
    {
        final DirContext dirContext = bind();
        return dirContext != null;
    }
}
