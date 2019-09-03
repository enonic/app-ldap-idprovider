var idProviderConfigJson = {
    title: "User Login Test",
    forgotPassword: {
        email: "noreply@example.com",
        site: "WebsiteTest"
    }
};
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

__.registerMock('/lib/xp/auth.js', mock);
