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
    * (Optional) Groups: Groups to associate to new users    
    * Display
        * Title: Title used by the login page
        * Theme: Display theme of the login page
            
### Step 3: Create and configure the user store
1. Edit the configuration file "com.enonic.xp.web.vhost.cfg", and set the new user store to your virtual host.
(See [Virtual Host Configuration](http://xp.readthedocs.io/en/stable/operations/configuration.html#configuration-vhost) for more information).

    ```ini
    enabled=true
      
    mapping.admin.host = localhost
    mapping.admin.source = /admin
    mapping.admin.target = /admin
    mapping.admin.userStore = system
    
    mapping.mysite.host = localhost
    mapping.mysite.source = /
    mapping.mysite.target = /portal/master/mysite
    mapping.mysite.userStore = myuserstore
    ```

## Releases and Compatibility

| App version | Required XP version | Download |
| ----------- | ------------------- | -------- |
| 1.0.0 | 6.7.0 | [Download](http://repo.enonic.com/public/com/enonic/app/ldapidprovider/1.0.0/ldapidprovider-1.0.0.jar) |
| 1.0.1 | 6.7.0 | [Download](http://repo.enonic.com/public/com/enonic/app/ldapidprovider/1.0.1/ldapidprovider-1.0.1.jar) |
| 1.0.2 | 6.7.0 | [Download](http://repo.enonic.com/public/com/enonic/app/ldapidprovider/1.0.2/ldapidprovider-1.0.2.jar) |


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