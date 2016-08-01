package com.enonic.app.ldapidprovider;

import com.google.common.base.Preconditions;

import com.enonic.xp.script.serializer.MapGenerator;
import com.enonic.xp.script.serializer.MapSerializable;

/**
 * Created by gri on 29/07/16.
 */
public class LdapUserMapper
    implements MapSerializable
{
    private String dn;

    private String login;

    private String displayName;

    private String email;

    private LdapUserMapper( final Builder builder )
    {
        dn = builder.dn;
        login = builder.login;
        displayName = builder.displayName;
        email = builder.email;
    }

    public static Builder create()
    {
        return new Builder();
    }

    @Override
    public void serialize( final MapGenerator gen )
    {
        gen.value( "dn", dn );
        gen.value( "login", login );
        gen.value( "displayName", displayName );
        gen.value( "email", email );
    }

    public static final class Builder
    {
        private String dn;

        private String login;

        private String displayName;

        private String email;

        private Builder()
        {
        }

        public Builder dn( final String dn )
        {
            this.dn = dn;
            return this;
        }

        public Builder login( final String login )
        {
            this.login = login;
            return this;
        }

        public Builder displayName( final String displayName )
        {
            this.displayName = displayName;
            return this;
        }

        public Builder email( final String email )
        {
            this.email = email;
            return this;
        }

        private void validate()
        {
            Preconditions.checkNotNull( this.dn, "DN cannot be null" );
            Preconditions.checkNotNull( this.displayName, "DN cannot be null" );
        }

        public LdapUserMapper build()
        {
            validate();
            return new LdapUserMapper( this );
        }
    }
}
