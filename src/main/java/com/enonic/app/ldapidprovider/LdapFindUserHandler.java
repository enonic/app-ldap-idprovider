package com.enonic.app.ldapidprovider;

import javax.naming.directory.DirContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LdapFindUserHandler
    extends AbstractLdapHandler
{
    private String userBaseDn;

    private String username;

    public void setUserBaseDn( final String userBaseDn )
    {
        this.userBaseDn = userBaseDn;
    }

    public void setUsername( final String username )
    {
        this.username = username;
    }

    private final static Logger LOG = LoggerFactory.getLogger( LdapFindUserHandler.class );

    public String execute() //TODO return user and not just userDn
    {
        final DirContext dirContext = bind();
        return "TODO"; //TODO Return correct value
    }
}
