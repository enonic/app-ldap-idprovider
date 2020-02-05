var authLib = require('/lib/xp/auth');
var commonLib = require('/lib/xp/common');
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
        serverUrl: idProviderConfig.serverUrl,
        authDn: idProviderConfig.authDn,
        authPassword: idProviderConfig.authPassword,
        connectTimeout: idProviderConfig.connectTimeout,
        readTimeout: idProviderConfig.readTimeout,
        userBaseDn: idProviderConfig.userBaseDn,
        username: body.user
    });

    //If the lDAP user is found
    var authenticated;
    if (ldapUser) {
        //Authenticates the user
        authenticated = ldapLib.authenticate({
            ldapDialect: idProviderConfig.ldapDialect,
            serverUrl: idProviderConfig.serverUrl,
            authDn: ldapUser.dn,
            authPassword: body.password,
            connectTimeout: idProviderConfig.connectTimeout,
            readTimeout: idProviderConfig.readTimeout
        });
    }

    //If the user is authenticated
    if (authenticated) {

        //Searches for the user in the user store
        var idProviderKey = portalLib.getIdProviderKey();
        var user = runAsAdmin(() => {
            return authLib.getPrincipal("user:" + idProviderKey + ":" + ldapUser.login);
        });

        //If the user already exist in the user store
        if (user) {

            //Updates the display name and email address 
            runAsAdmin(() => {
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
            runAsAdmin(() => {
                user = authLib.createUser({
                    idProvider: idProviderKey,
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
        runAsAdmin(() => {
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

        //Creates of update groups based on DN
        if (idProviderConfig.createFromDn) {
            const dn = ldapUser.dn;
            runAsAdmin(() => {
                const group = getClosestGroupFromDn(dn, idProviderKey);
                if (group) {
                    authLib.addMembers(group.key, [user.key]);
                }
            });
        }

        //Logs the user in
        var loginResult = authLib.login({
            user: user.login,
            idProvider: idProviderKey,
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

function getClosestGroupFromDn(dn, idProviderKey) {
    const currentRdnArray = [];
    const reverseOuValueArray = [];
    let lastGroup = null;
    dn.split(',').reverse().forEach((rdn) => {
        log.info('rdn:' + rdn);
        currentRdnArray.unshift(rdn);
        const rdnValues = rdn.split('=', 2);
        if ('ou' === rdnValues[0].toLowerCase()) {
            reverseOuValueArray.push(rdnValues[1]);
            const currentDn = currentRdnArray.join(',');
            const groupName = commonLib.sanitize(currentDn);
            const groupKey = 'group:' + idProviderKey + ':' + groupName;
            let group = authLib.getPrincipal(groupKey);
            if (group) {
                // Unnecessary for now

                // authLib.modifyGroup({
                //     key: group.key,
                //     editor: (g) => {
                //         g.displayName = reverseOuValueArray.join('/');
                //         g.description = 'currentDn';
                //         return g;
                //     }
                // });
            } else {
                group = authLib.createGroup({
                    idProvider: idProviderKey,
                    name: groupName,
                    displayName: reverseOuValueArray.join('/'),
                    description: currentDn
                });
            }

            if (lastGroup) {
                authLib.addMembers(lastGroup.key, [group.key]);
            }
            lastGroup = group;
        }
    });
    return lastGroup;
}

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
            idProvider: 'system'
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