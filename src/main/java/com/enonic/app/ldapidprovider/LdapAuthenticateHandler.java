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

public class LdapAuthenticateHandler
    implements ScriptBean
{
    private final static Logger LOG = LoggerFactory.getLogger( LdapAuthenticateHandler.class );

    private LdapDialect ldapDialect;

    private String ldapAddress;

    private String ldapPort;

    private String authDn;

    private String authPassword;

    private String userBaseDn;

    private String user;

    private String password;

    public void setLdapDialect( String ldapDialect )
    {
        this.ldapDialect = LdapDialectResolver.resolve( ldapDialect );
    }

    public void setLdapAddress( final String ldapAddress )
    {
        this.ldapAddress = ldapAddress;
    }

    public void setLdapPort( final String ldapPort )
    {
        this.ldapPort = ldapPort;
    }

    public void setAuthDn( final String authDn )
    {
        this.authDn = authDn;
    }

    public void setAuthPassword( final String authPassword )
    {
        this.authPassword = authPassword;
    }

    public void setUserBaseDn( final String userBaseDn )
    {
        this.userBaseDn = userBaseDn;
    }

    public void setUser( final String user )
    {
        this.user = user;
    }

    public void setPassword( final String password )
    {
        this.password = password;
    }

    public boolean authenticate()
    {
        try
        {
            DirContext ctx = new InitialDirContext( buildLdapProperties() );

            boolean result = ctx != null;

            if ( ctx != null )
            {
                ctx.close();
            }

            return result;

        }
        catch ( AuthenticationException ae )
        {
            LOG.info( "Credentials supplied by the user program are invalid or failed" +
                          " to authenticate the user to the naming/directory service" );
            return false;
        }
        catch ( Exception e )
        {
            LOG.error( "Problem occured while authenticating: ", e );
            return false;
        }
    }

    private Hashtable<String, String> buildLdapProperties()
    {
        final Hashtable<String, String> env = new Hashtable<>();
        env.put( Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory" );
        env.put( Context.PROVIDER_URL, "ldap://" + ldapAddress + ":" + ldapPort );
        env.put( Context.SECURITY_AUTHENTICATION, "simple" );
        env.put( Context.SECURITY_PRINCIPAL, ldapDialect.getUserIdAttribute() + "=" + user + "," + userBaseDn );
        env.put( Context.SECURITY_CREDENTIALS, password );

        return env;
    }

    @Override
    public void initialize( final BeanContext context )
    {
    }
}
