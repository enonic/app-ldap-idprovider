package com.enonic.app.ldapidprovider;

import java.util.Hashtable;

import javax.naming.AuthenticationException;
import javax.naming.Context;
import javax.naming.directory.DirContext;
import javax.naming.directory.InitialDirContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.enonic.app.ldapidprovider.dialect.LdapDialect;
import com.enonic.app.ldapidprovider.dialect.LdapDialectResolver;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;

public abstract class AbstractLdapHandler
    implements ScriptBean
{
    private final static Logger LOG = LoggerFactory.getLogger( LdapAuthenticateHandler.class );

    protected LdapDialect ldapDialect;

    protected String serverUrl;

    protected String authDn;

    protected String authPassword;

    protected long connectTimeout;

    protected long readTimeout;

    public void setLdapDialect( String ldapDialect )
    {
        this.ldapDialect = LdapDialectResolver.resolve( ldapDialect );
    }

    public void setServerUrl( final String serverUrl )
    {
        this.serverUrl = serverUrl;
    }

    public void setAuthDn( final String authDn )
    {
        this.authDn = authDn;
    }

    public void setAuthPassword( final String authPassword )
    {
        this.authPassword = authPassword;
    }

    public void setConnectTimeout( final long connectTimeout )
    {
        this.connectTimeout = connectTimeout;
    }

    public void setReadTimeout( final long readTimeout )
    {
        this.readTimeout = readTimeout;
    }

    protected DirContext bind()
    {
        try
        {
            return new InitialDirContext( buildLdapProperties() );
        }
        catch ( AuthenticationException ae )
        {
            LOG.info( "Credentials supplied by the user program are invalid or failed" +
                          " to authenticate the user to the naming/directory service" );
        }
        catch ( Exception e )
        {
            LOG.error( "Error occured while authenticating: ", e );
        }
        return null;
    }

    protected Hashtable<String, String> buildLdapProperties()
    {
        final Hashtable<String, String> env = new Hashtable<>();
        env.put( Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory" );
        env.put( Context.PROVIDER_URL, serverUrl );
        env.put( Context.SECURITY_AUTHENTICATION, "simple" );
        env.put( Context.SECURITY_PRINCIPAL, authDn );
        env.put( Context.SECURITY_CREDENTIALS, authPassword );

        env.put( "com.sun.jndi.ldap.connect.timeout", "" + connectTimeout );
        env.put( "com.sun.jndi.ldap.read.timeout", "" + readTimeout );
        if ( serverUrl != null && serverUrl.toLowerCase().startsWith( "ldaps:" ) )
        {
            env.put( Context.SECURITY_PROTOCOL, "ssl" );
        }

        return env;
    }

    @Override
    public void initialize( final BeanContext context )
    {
    }
}
