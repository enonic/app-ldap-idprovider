var authLib = require('/lib/xp/auth');
var portalLib = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');

exports.generateLoginPage = function (redirectUrl) {

    //Retrieves title and theme
    var idProviderConfig = authLib.getIdProviderConfig();
    var title = idProviderConfig.title || "LDAP Login";
    var theme = idProviderConfig.theme || "light-blue";
    var backgroundStyleUrl = generateBackgroundStyleUrl(theme);
    var colorStyleUrl = generateColorStyleUrl(theme);

    //Generates asset urls
    var jQueryUrl = portalLib.assetUrl({path: "js/jquery-2.2.0.min.js"});
    var styleUrl = portalLib.assetUrl({path: "css/style.css"});
    var userImgUrl = portalLib.assetUrl({path: "img/user.svg"});
    var scriptUrl = portalLib.assetUrl({path: "js/login.js"});

    //Renders the config
    var loginConfigView = resolve('login-config.txt');
    var config = mustacheLib.render(loginConfigView, {
        redirectUrl: redirectUrl,
        loginUrl: portalLib.idProviderUrl()
    });

    //Renders the login page
    var view = resolve("page.html");
    return mustacheLib.render(view, {
        title: title,
        styleUrl: styleUrl,
        backgroundStyleUrl: backgroundStyleUrl,
        colorStyleUrl: colorStyleUrl,
        jQueryUrl: jQueryUrl,
        userImgUrl: userImgUrl,
        scriptUrl: scriptUrl,
        config: config
    });
}

function generateBackgroundStyleUrl(theme) {
    var stylePath = "themes/" + theme.split('-', 1)[0] + "-theme.css";
    return portalLib.assetUrl({path: stylePath});
}

function generateColorStyleUrl(theme) {
    var stylePath = "themes/" + theme.split('-', 2)[1] + "-theme.css";
    return portalLib.assetUrl({path: stylePath});
}