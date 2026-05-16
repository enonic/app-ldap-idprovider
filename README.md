# LDAP ID Provider App for Enonic XP

This ID Provider contains a simple login page to authenticate your local users.
The user authentication is done against an LDAP server and the user information cached locally.

## Usage

### Step 1: Install the application
1. In the admin tool "Applications" of your Enonic XP installation, click on "Install". 
2. Select the tab "Enonic Market", find "LDAP ID Provider", and click on the link "Install".

### Step 2: Create and configure the user store
1. In the admin tool "Users", click on "New".
2. Fill in the fields and, for the field "ID Provider", select the application "LDAP ID Provider".
3. Configure the ID Provider:
    * LDAP Server: Server information
        * LDAP Dialect: Type of the LDAP server
        * LDAP server URL: URL of the LDAP server
        * Auth DN: DN of an admin user. (Used to search for users)
        * Auth password: Password of the admin user. (Used to search for users)
        * LDAP user base DN: DN of the element containing the users.
        * Connect timeout: Connect timeout (milliseconds)
        * Read timeout: Connect timeout (milliseconds)
    * Groups
        * Create groups from DN: Create groups based on the Organizational Units from the Distinguished Name
        * Groups: Groups to associate to new users
        * Group Mappings: Map LDAP groups to XP groups or roles
            * Source Type: Choose how to identify LDAP groups (by name or full DN)
            * Source Value: LDAP group name (e.g., 'Domain Admins') or full DN
            * Target Group/Role: XP group or role to assign users to
    * Display
        * Title: Title used by the login page
        * Theme: Display theme of the login page
            
### Step 3: Create and configure the user store
1. Edit the configuration file "com.enonic.xp.web.vhost.cfg", and set the new user store to your virtual host.
(See [Virtual Host Configuration](https://developer.enonic.com/docs/xp/stable/deployment/config#vhost) for more information).

    ```ini
    enabled=true
      
    mapping.admin.host = localhost
    mapping.admin.source = /admin
    mapping.admin.target = /admin
    mapping.admin.idProvider.system = default
    
    mapping.mysite.host = localhost
    mapping.mysite.source = /
    mapping.mysite.target = /portal/master/mysite
    mapping.mysite.idProvider.myidprovider = default
    ```

## Group Mappings

The LDAP ID Provider supports mapping LDAP group memberships to XP groups or roles. This allows you to automatically assign users to XP groups based on their LDAP/Active Directory group memberships.

### Configuration via Admin UI

In the ID Provider configuration form, you can add multiple group mappings:

1. **Source Type**: Choose how to identify LDAP groups:
   - `LDAP Group Name (memberOf)`: Match by group name (CN) extracted from the group DN
   - `LDAP Group DN (full distinguished name)`: Match by the full DN of the LDAP group

2. **Source Value**: The LDAP group to match:
   - For group name: `Domain Admins`, `Developers`, `IT Staff`
   - For full DN: `cn=Developers,ou=Groups,dc=example,dc=com`

3. **Target Group/Role**: The XP group or role to assign users to:
   - Groups: `group:myldap:developers`, `group:system:users`
   - Roles: `role:system.admin`, `role:cms.admin`

### Configuration via File

You can also configure group mappings via the `com.enonic.app.ldapidprovider.cfg` file:

```ini
# Map "Domain Admins" LDAP group to system admin role
idprovider.myldap.groupMappings.0.source=ldapGroup
idprovider.myldap.groupMappings.0.sourceValue=Domain Admins
idprovider.myldap.groupMappings.0.target=role:system.admin

# Map Developers group (by DN) to developers group
idprovider.myldap.groupMappings.1.source=ldapGroupDn
idprovider.myldap.groupMappings.1.sourceValue=cn=Developers,ou=Groups,dc=example,dc=com
idprovider.myldap.groupMappings.1.target=group:myldap:developers

# Map IT Staff group to content managers
idprovider.myldap.groupMappings.2.source=ldapGroup
idprovider.myldap.groupMappings.2.sourceValue=IT Staff
idprovider.myldap.groupMappings.2.target=role:cms.cm.app
```

### How Group Mappings Work

1. When a user logs in, the ID Provider queries LDAP for the user's group memberships (via the `memberOf` attribute)
2. Each configured mapping rule is evaluated to check if the user belongs to the specified LDAP group
3. If a match is found, the user is automatically added to the target XP group or role
4. This process happens on every login, ensuring group memberships stay synchronized

### Group Mapping Features

- **Multiple Mappings**: Configure as many mappings as needed
- **Flexible Matching**: Match by group name or full DN
- **Role Support**: Map to both groups and roles
- **Automatic Synchronization**: Group memberships are updated on every login
- **Backwards Compatible**: Works alongside existing features (default groups, DN-based groups)

### Example Scenarios

**Scenario 1: Map AD security groups to XP roles**
```
Source: ldapGroup → "Domain Admins"
Target: role:system.admin

Source: ldapGroup → "Content Editors"
Target: role:cms.cm.app
```

**Scenario 2: Map specific LDAP groups to custom XP groups**
```
Source: ldapGroupDn → "cn=ProjectA-Team,ou=Projects,dc=company,dc=com"
Target: group:myldap:project-a

Source: ldapGroupDn → "cn=ProjectB-Team,ou=Projects,dc=company,dc=com"
Target: group:myldap:project-b
```

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
