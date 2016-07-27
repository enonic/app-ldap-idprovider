var portalLib = require('/lib/xp/portal');
var authLib = require('/lib/xp/auth');
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
    var idProviderConfig = authLib.getIdProviderConfig();
    var authenticated = ldapLib.authenticate({
        ldapDialect: idProviderConfig.ldapDialect,
        ldapAddress: idProviderConfig.ldapAddress,
        ldapPort: idProviderConfig.ldapPort,
        userBaseDn: idProviderConfig.userBaseDn,
        user: body.user,
        password: body.password
    });

    if (authenticated) {
        //TODO Create if missing

        var userStoreKey = portalLib.getUserStoreKey();
        var loginResult = authLib.login({
            user: body.user,
            userStore: userStoreKey,
            skipAuth: true
        });
        return {
            body: loginResult,
            contentType: 'application/json'
        };
    }

    return {
        body: {authenticated: false},
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