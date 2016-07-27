var authLib = require('/lib/xp/auth');
var portalLib = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');

exports.generateLoginPage = function (redirectUrl) {
    var scriptUrl = portalLib.assetUrl({path: "js/login.js"});

    var loginConfigView = resolve('login-config.txt');
    var config = mustacheLib.render(loginConfigView, {
        redirectUrl: redirectUrl,
        loginUrl: portalLib.idProviderUrl()
    });

    return generatePage({
        scriptUrl: scriptUrl,
        config: config,
        login: true
    });
};

function generatePage(params) {
    var idProviderConfig = authLib.getIdProviderConfig();
    var title = idProviderConfig.title || "LDAP Login";

    var theme = idProviderConfig.theme || "light-blue";
    var backgroundStyleUrl = generateBackgroundStyleUrl(theme);
    var colorStyleUrl = generateColorStyleUrl(theme);

    var jQueryUrl = portalLib.assetUrl({path: "js/jquery-2.2.0.min.js"});
    var styleUrl = portalLib.assetUrl({path: "css/style.css"});
    var userImgUrl = portalLib.assetUrl({path: "img/user.svg"});

    var redirectUrl = portalLib.idProviderUrl({
        params: {
            loggedOut: ""
        }
    });

    var view = resolve("page.html");
    params.title = title;
    params.styleUrl = styleUrl;
    params.backgroundStyleUrl = backgroundStyleUrl;
    params.colorStyleUrl = colorStyleUrl;
    params.jQueryUrl = jQueryUrl;
    params.userImgUrl = userImgUrl;

    return mustacheLib.render(view, params);
}

function generateBackgroundStyleUrl(theme) {
    var stylePath = "themes/" + theme.split('-', 1)[0] + "-theme.css";
    return portalLib.assetUrl({path: stylePath});
}

function generateColorStyleUrl(theme) {
    var stylePath = "themes/" + theme.split('-', 2)[1] + "-theme.css";
    return portalLib.assetUrl({path: stylePath});
}