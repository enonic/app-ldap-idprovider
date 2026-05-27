var idProviderConfigJson = null;
var userJson = null;

var mock = {
    getUser: function () {
        return userJson;
    },
    getIdProviderConfig: function () {
        return idProviderConfigJson;
    },
    logout: function () {
        userJson = null;
    }
};

exports.mockUser = function (json) {
    userJson = json;
};

exports.setIdProviderConfig = function (json) {
    idProviderConfigJson = json;
};

__.registerMock('/lib/xp/auth.js', mock);
