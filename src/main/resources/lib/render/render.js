var authLib = require('/lib/xp/auth');
var portalLib = require('/lib/xp/portal');
var mustacheLib = require('/lib/xp/mustache');
var displayLib = require('/lib/display');

exports.generateLoginPage = function (redirectUrl) {

    //Retrieves title and theme
    var idProviderConfig = authLib.getIdProviderConfig();
    var title = idProviderConfig.title || "LDAP Login";
    var theme = idProviderConfig.theme || "light-blue";

    //Renders the config
    var configView = resolve('config.txt');
    var config = mustacheLib.render(configView, {
        redirectUrl: redirectUrl,
        loginUrl: portalLib.idProviderUrl()
    });

    //Generates script URL
    var scriptUrl = portalLib.assetUrl({path: "js/login.js"});

    //Renders the login page
    return displayLib.render({
        title: title,
        theme: theme,
        config: config,
        scriptUrl: scriptUrl,
        body: {
            username: "Username or email",
            password: "Password"
        }
    });
};