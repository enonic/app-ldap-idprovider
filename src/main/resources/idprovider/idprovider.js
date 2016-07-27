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
    var userStoreKey = portalLib.getUserStoreKey();
    var idProviderConfig = authLib.getIdProviderConfig();
    var loginResult = ldapLib.login({
        user: body.user,
        password: body.password,
        ldapAddress: idProviderConfig.ldapAddress,
        ldapPort: idProviderConfig.ldapPort,
        ldapDialect: idProviderConfig.ldapDialect,
        userBaseDn: idProviderConfig.userBaseDn,
        userStore: userStoreKey
    });
    return {
        body: loginResult,
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