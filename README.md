# LDAP ID Provider App for Enonic XP

This ID Provider contains a simple login page to authenticate your local users.
The user authentication is done against an LDAP server and the user information cached locally.

## Configuration

The LDAP ID Provider is configured entirely outside of the admin UI — there is no
form to fill in. There are two complementary input sources:

1. **`IdProviderConfig.config`** — the structured `config` object passed in when
   the id provider is created via `auth.createIdProvider(...)`. Best for
   per-id-provider settings (multiple LDAP providers on the same XP, each
   pointing at a different directory).
2. **`<app>.cfg`** — the application's config file
   (`home/config/com.enonic.app.ldapidprovider.cfg`), keyed by id provider name.
   Best for shared defaults or for configuring providers from outside JS.

When both are set, values from `IdProviderConfig.config` win on a per-key basis,
falling back to the cfg file and then to library defaults.

### Supported keys

| Key             | Type              | Default               | Description                                                                |
|-----------------|-------------------|-----------------------|----------------------------------------------------------------------------|
| `ldapDialect`   | `ad` / `generic` / `oracle` | `generic`   | LDAP server flavor                                                         |
| `serverUrl`     | string            | `ldap://127.0.0.1:389` | LDAP server URL                                                           |
| `authDn`        | string            | `""`                  | DN of an admin user used to search for users                               |
| `authPassword`  | string            | `""`                  | Password of the admin user                                                 |
| `userBaseDn`    | string            | `""`                  | DN of the element containing the users                                     |
| `connectTimeout`| long (ms)         | `60000`               | Connect timeout                                                            |
| `readTimeout`   | long (ms)         | `60000`               | Read timeout                                                               |
| `createFromDn`  | boolean           | `false`               | Create groups based on Organizational Units from the user's DN             |
| `defaultGroups` | array of principal keys | `[]`            | Groups to add new users to on first login                                  |
| `groupMappings` | array of mapping objects | `[]`           | Map LDAP group memberships to XP groups or roles — see below               |
| `title`         | string            | `LDAP Login`          | Title of the login page                                                    |
| `theme`         | string            | `light-blue`          | Theme of the login page                                                    |

### Configure via `auth.createIdProvider` (recommended)

```javascript
var authLib = require('/lib/xp/auth');

authLib.createIdProvider({
    name: 'myldap',
    displayName: 'My LDAP',
    idProviderConfig: {
        applicationKey: 'com.enonic.app.ldapidprovider',
        config: {
            ldapDialect: 'ad',
            serverUrl: 'ldap://127.0.0.1:389',
            authDn: 'cn=Manager,dc=my-domain,dc=com',
            authPassword: 'secret',
            userBaseDn: 'dc=my-domain,dc=com',
            connectTimeout: 60000,
            readTimeout: 60000,
            createFromDn: false,
            defaultGroups: ['group:myldap:users'],
            groupMappings: [
                {source: 'ldapGroup', sourceValue: 'Domain Admins', target: 'role:system.admin'},
                {source: 'ldapGroupDn', sourceValue: 'cn=Developers,ou=Groups,dc=example,dc=com', target: 'group:myldap:developers'}
            ],
            title: 'LDAP Login',
            theme: 'light-blue'
        }
    }
});
```

### Configure via `com.enonic.app.ldapidprovider.cfg`

Place keys under `idprovider.<idProviderName>.<field>` so the same cfg file can
hold settings for several id providers:

```ini
idprovider.myldap.ldapDialect=ad
idprovider.myldap.serverUrl=ldap://127.0.0.1:389
idprovider.myldap.authDn=cn=Manager,dc=my-domain,dc=com
idprovider.myldap.authPassword=secret
idprovider.myldap.userBaseDn=dc=my-domain,dc=com
idprovider.myldap.connectTimeout=60000
idprovider.myldap.readTimeout=60000
idprovider.myldap.createFromDn=false
idprovider.myldap.defaultGroups=group:myldap:admins group:myldap:users
idprovider.myldap.groupMappings.0.source=ldapGroup
idprovider.myldap.groupMappings.0.sourceValue=Domain Admins
idprovider.myldap.groupMappings.0.target=role:system.admin
idprovider.myldap.groupMappings.1.source=ldapGroupDn
idprovider.myldap.groupMappings.1.sourceValue=cn=Developers,ou=Groups,dc=example,dc=com
idprovider.myldap.groupMappings.1.target=group:myldap:developers
idprovider.myldap.title=LDAP Login
idprovider.myldap.theme=light-blue
```

`defaultGroups` is a space-separated list of principal keys. Group mappings use
the indexed-key shape (`groupMappings.<N>.source` etc.).

### Virtual host mapping

Map the id provider into a virtual host as usual
(see [Virtual Host Configuration](https://developer.enonic.com/docs/xp/stable/deployment/config#vhost)):

```ini
enabled=true

mapping.admin.host = localhost
mapping.admin.source = /admin
mapping.admin.target = /admin
mapping.admin.idProvider.system = default

mapping.mysite.host = localhost
mapping.mysite.source = /
mapping.mysite.target = /portal/master/mysite
mapping.mysite.idProvider.myldap = default
```

## Group Mappings

The LDAP ID Provider supports mapping LDAP group memberships to XP groups or
roles. On every login, the provider queries the user's LDAP group memberships
(via the `memberOf` attribute) and adds them to the matching XP groups or roles.

### Mapping shape

Each mapping is an object with three fields:

- `source` — `"ldapGroup"` to match by group name (CN extracted from the group
  DN), or `"ldapGroupDn"` to match by full DN.
- `sourceValue` — the LDAP group name (e.g. `Domain Admins`) or full DN
  (e.g. `cn=Developers,ou=Groups,dc=example,dc=com`). Matching is
  case-insensitive.
- `target` — XP principal key, either a group (`group:<idprovider>:<name>`) or
  role (`role:<name>`).

### Examples

**Map AD security groups to XP roles**

```javascript
groupMappings: [
    {source: 'ldapGroup', sourceValue: 'Domain Admins', target: 'role:system.admin'},
    {source: 'ldapGroup', sourceValue: 'Content Editors', target: 'role:cms.cm.app'}
]
```

**Map specific LDAP groups (by DN) to custom XP groups**

```javascript
groupMappings: [
    {source: 'ldapGroupDn', sourceValue: 'cn=ProjectA-Team,ou=Projects,dc=company,dc=com', target: 'group:myldap:project-a'},
    {source: 'ldapGroupDn', sourceValue: 'cn=ProjectB-Team,ou=Projects,dc=company,dc=com', target: 'group:myldap:project-b'}
]
```

### Behavior

- Multiple mappings are evaluated for every login; all matches are applied.
- Users are never automatically removed from groups; mappings only add.
- Mappings work alongside `defaultGroups` and `createFromDn`.

## Releases and Compatibility

| App version | Required XP version | Download                                                                                               |
|-------------|---------------------|--------------------------------------------------------------------------------------------------------|
| 2.1.1       | 7.7.4               | [Download](http://repo.enonic.com/public/com/enonic/app/ldapidprovider/2.1.1/ldapidprovider-2.1.1.jar) |
| 2.1.0       | 7.0.0               | [Download](http://repo.enonic.com/public/com/enonic/app/ldapidprovider/2.1.0/ldapidprovider-2.1.0.jar) |
| 2.0.0       | 7.0.0               | [Download](http://repo.enonic.com/public/com/enonic/app/ldapidprovider/2.0.0/ldapidprovider-2.0.0.jar) |
| 1.0.2       | 6.7.0               | [Download](http://repo.enonic.com/public/com/enonic/app/ldapidprovider/1.0.2/ldapidprovider-1.0.2.jar) |
| 1.0.1       | 6.7.0               | [Download](http://repo.enonic.com/public/com/enonic/app/ldapidprovider/1.0.1/ldapidprovider-1.0.1.jar) |
| 1.0.0       | 6.7.0               | [Download](http://repo.enonic.com/public/com/enonic/app/ldapidprovider/1.0.0/ldapidprovider-1.0.0.jar) |


## Building and deploying

Build this application from the command line. Go to the root of the project and enter:

    ./gradlew clean build

To deploy the app, set `$XP_HOME` environment variable and enter:

    ./gradlew deploy


## Releasing new version

To release a new version of this app, please follow the steps below:

1. Update `version` (and possibly `xpVersion`) in  `gradle.properties`.

2. Compile and deploy to our Maven repository:

    ./gradlew clean build uploadArchives

3. Update `README.md` file with new version information and compatibility.

4. Tag the source code using `git tag` command (where `X.Y.Z` is the released version):

    git tag vX.Y.Z

5. Push the updated code to GitHub.

    git push origin vX.Y.Z
