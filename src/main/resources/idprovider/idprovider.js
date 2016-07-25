var mustacheLib = require('/lib/xp/mustache');
var portalLib = require('/lib/xp/portal');
var authLib = require('/lib/xp/auth');

exports.handle401 = function (req) {
    var body = generateLoginPage();

    return {
        status: 401,
        contentType: 'text/html',
        body: body
    };
};

exports.get = function (req) {
    var redirectUrl = generateRedirectUrl();
    var body = generateLoginPage(redirectUrl);

    return {
        status: 200,
        contentType: 'text/html',
        body: body
    };
};

exports.login = function (req) {
    var redirectUrl = (req.validTicket && req.params.redirect) || generateRedirectUrl();
    var body = generateLoginPage(redirectUrl);

    return {
        status: 200,
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

function generateLoginPage(redirectUrl) {
    var jQueryUrl = portalLib.assetUrl({path: "js/jquery-2.2.0.min.js"});
    var appLoginJsUrl = portalLib.assetUrl({path: "js/login.js"});
    var appLoginCssUrl = portalLib.assetUrl({path: "css/login.css"});
    var appLoginBackgroundUrl = portalLib.assetUrl({path: "common/images/background-1920.jpg"});
    var appLoginServiceUrl = portalLib.serviceUrl({service: "login"});
    var authConfig = authLib.getIdProviderConfig();

    var configView = resolve('idprovider-config.txt');
    var config = mustacheLib.render(configView, {
        appLoginServiceUrl: appLoginServiceUrl,
        ldapAddress: authConfig.ldapAddress,
        ldapPort: authConfig.ldapPort,
        ldapDialect: authConfig.ldapDialect,
        userBaseDn: authConfig.userBaseDn,
        redirectUrl: redirectUrl,
        authConfig: authConfig
    });

    var view = resolve('idprovider.html');
    var params = {
        jQueryUrl: jQueryUrl,
        appLoginJsUrl: appLoginJsUrl,
        appLoginCssUrl: appLoginCssUrl,
        appLoginBackgroundUrl: appLoginBackgroundUrl,
        config: config
    };
    return mustacheLib.render(view, params);
}