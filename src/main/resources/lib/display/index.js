var mustacheLib = require('/lib/mustache');

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

    params.assetUrl = req.contextPath + '/_static';
    params.backgroundStyleUrl = generateBackgroundStyleUrl(req, params.theme);
    params.colorStyleUrl = generateColorStyleUrl(req, params.theme);

    var view = resolve('page.html');
    return mustacheLib.render(view, params);
};

function generateBackgroundStyleUrl(req, theme) {
    var stylePath = "themes/" + theme.split('-', 1)[0] + "-theme.css";
    return req.contextPath + '/_static/' + stylePath;
}

function generateColorStyleUrl(req, theme) {
    var stylePath = "themes/" + theme.split('-', 2)[1] + "-theme.css";
    return req.contextPath + '/_static/' + stylePath;
}
