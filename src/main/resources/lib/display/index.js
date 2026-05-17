var mustacheLib = require('/lib/mustache');
var portalLib = require('/lib/xp/portal');

exports.render = function (req, params) {
    params.submit = params.submit || "LOG IN";

    if (params.error) {
        params.messageClass = "form-message-error";
        params.message = params.error;
    } else if (params.info) {
        params.messageClass = "form-message-info";
        params.message = params.info;
    } else {
        params.messageClass = "hidden";
        params.message = "";
    }

    params.assetUrl = portalLib.idProviderUrl() + '/_static';
    params.backgroundStyleUrl = generateBackgroundStyleUrl(params.theme);
    params.colorStyleUrl = generateColorStyleUrl(params.theme);

    var view = resolve('page.html');
    return mustacheLib.render(view, params);
};

function generateBackgroundStyleUrl(theme) {
    var stylePath = "themes/" + theme.split('-', 1)[0] + "-theme.css";
    return portalLib.idProviderUrl() + '/_static/' + stylePath;
}

function generateColorStyleUrl(theme) {
    var stylePath = "themes/" + theme.split('-', 2)[1] + "-theme.css";
    return portalLib.idProviderUrl() + '/_static/' + stylePath;
}
