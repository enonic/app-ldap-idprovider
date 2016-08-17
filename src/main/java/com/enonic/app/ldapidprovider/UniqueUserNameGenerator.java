package com.enonic.app.ldapidprovider;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.function.Supplier;

import com.enonic.xp.name.NamePrettyfier;
import com.enonic.xp.script.bean.BeanContext;
import com.enonic.xp.script.bean.ScriptBean;
import com.enonic.xp.security.PrincipalKey;
import com.enonic.xp.security.SecurityService;
import com.enonic.xp.security.UserStoreKey;

public class UniqueUserNameGenerator
    implements ScriptBean
{
    private final static SecureRandom SECURE_RANDOM = new SecureRandom();

    private Supplier<String> idGenerator = () -> new BigInteger( 64, SECURE_RANDOM ).toString( 10 );

    private UserStoreKey userStoreKey;

    private String userName;

    private Supplier<SecurityService> securityService;

    public void setUserStoreKey( final String userStoreKey )
    {
        this.userStoreKey = userStoreKey == null ? null : UserStoreKey.from( userStoreKey );
    }

    public void setUserName( final String userName )
    {
        this.userName = userName;
    }

    @Override
    public void initialize( final BeanContext context )
    {
        this.securityService = context.getService( SecurityService.class );
    }

    public String execute()
    {
        final String baseName = NamePrettyfier.create( userName );

        String result = baseName;
        while ( userNameExist( result ) )
        {
            final String randomId = this.idGenerator.get();
            result = baseName + "-" + randomId;
        }

        return result;
    }

    private boolean userNameExist( final String userName )
    {
        final PrincipalKey principalKey = PrincipalKey.ofUser( this.userStoreKey, userName );
        return this.securityService.get().getUser( principalKey ).isPresent();
    }
}
