var authLib = require('/lib/xp/auth');
var contextLib = require('/lib/xp/context');
var portalLib = require('/lib/xp/portal');
var renderLib = require('/lib/render/render');
var ldapLib = require('/lib/ldap');

exports.handle401 = function (req) {
    var body = renderLib.generateLoginPage();

    return {
        status: 401,
        contentType: 'text/html',
        body: body
    };
};

exports.get = function (req) {
    var redirectUrl = generateRedirectUrl();
    var body = renderLib.generateLoginPage(redirectUrl);

    return {
        contentType: 'text/html',
        body: body
    };
};

exports.post = function (req) {
    var body = JSON.parse(req.body);

    //Authenticates against the LDAP server
    var idProviderConfig = authLib.getIdProviderConfig();

    //Finds the LDAP user
    var ldapUser = ldapLib.findUser({
        ldapDialect: idProviderConfig.ldapDialect,
        ldapAddress: idProviderConfig.ldapAddress,
        ldapPort: idProviderConfig.ldapPort,
        authDn: idProviderConfig.authDn,
        authPassword: idProviderConfig.authPassword,
        userBaseDn: idProviderConfig.userBaseDn,
        username: body.user
    });

    //If the lDAP user is found
    var authenticated;
    if (ldapUser) {
        //Authenticates the user
        authenticated = ldapLib.authenticate({
            ldapDialect: idProviderConfig.ldapDialect,
            ldapAddress: idProviderConfig.ldapAddress,
            ldapPort: idProviderConfig.ldapPort,
            authDn: ldapUser.dn,
            authPassword: body.password
        });
    }

    //If the user is authenticated
    if (authenticated) {

        //Searches for the user in the user store
        var userStoreKey = portalLib.getUserStoreKey();
        var user = runAsAdmin(function () {
            return authLib.getPrincipal("user:" + userStoreKey + ":" + ldapUser.login);
        });

        //If the user already exist in the user store
        if (user) {

            //Updates the display name and email address 
            runAsAdmin(function () {
                user = authLib.modifyUser({
                    key: user.key,
                    editor: function (u) {
                        u.displayName = ldapUser.displayName || ldapUser.login;
                        u.email = ldapUser.email;
                        return u;
                    }
                });
            });

        } else {

            //Else, creates the user
            runAsAdmin(function () {
                user = authLib.createUser({
                    userStore: userStoreKey,
                    name: ldapUser.login,
                    displayName: ldapUser.displayName || ldapUser.login,
                    email: ldapUser.email
                });

                var defaultGroups = idProviderConfig.defaultGroups;
                toArray(defaultGroups).forEach(function (defaultGroup) {
                    authLib.addMembers(defaultGroup, [user.key])
                });
            });
        }

        //Updates the user attributes
        runAsAdmin(function () {
            if (!ldapUser.attributes.dn) {
                ldapUser.attributes.dn = ldapUser.dn;
            }

            authLib.modifyProfile({
                key: user.key,
                scope: 'ldap',
                editor: function () {
                    return ldapUser.attributes;
                }
            });
        });

        //Logs the user in
        var loginResult = authLib.login({
            user: user.login,
            userStore: userStoreKey,
            skipAuth: true
        });

        return {
            body: loginResult,
            contentType: 'application/json'
        };
    }

    return {
        body: {
            authenticated: false,
            message: "Invalid credentials"
        },
        contentType: 'application/json'
    };
};

exports.login = function (req) {
    var redirectUrl = (req.validTicket && req.params.redirect) || generateRedirectUrl();
    var body = renderLib.generateLoginPage(redirectUrl);

    return {
        contentType: 'text/html',
        body: body
    };
};

exports.logout = function (req) {
    authLib.logout();
    var redirectUrl = (req.validTicket && req.params.redirect) || generateRedirectUrl();

    return {
        redirect: redirectUrl
    };
};

function generateRedirectUrl() {
    var site = portalLib.getSite();
    if (site) {
        return portalLib.pageUrl({id: site._id});
    }
    return '/';
}

function runAsAdmin(callback) {
    return contextLib.run({
        user: {
            login: 'su',
            userStore: 'system'
        },
        principals: ["role:system.admin"]
    }, callback);
};

function toArray(object) {
    if (!object) {
        return [];
    }
    if (object.constructor === Array) {
        return object;
    }
    return [object];
};