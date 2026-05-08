var appConfigJson = {};

var mock = {
    getConfig: function () {
        return appConfigJson;
    }
};

exports.setConfig = function (json) {
    appConfigJson = json || {};
};

__.registerMock('/lib/appConfig.js', mock);
