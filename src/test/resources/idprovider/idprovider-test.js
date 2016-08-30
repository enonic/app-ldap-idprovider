var authMock = require('/lib/xp/mock/auth');
var contextMock = require('/lib/xp/mock/context');
var portalMock = require('/lib/xp/mock/portal');
var idProvider = require('/idprovider/idprovider');
var assert = require('/lib/xp/assert');

exports.testHandle401 = function () {
    var result = idProvider.handle401({});

    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(401 == result.status);
    assertLoginPage(result.body);
};

exports.testGet = function () {
    var result = idProvider.get({
        params: {}
    });
    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
    assert.assertNotNull(result.body);
    assertLoginPage(result.body);
};

exports.testLogin = function () {
    var result = idProvider.login({});

    assert.assertEquals('text/html', result.contentType);
    assert.assertTrue(!result.status || 200 == result.status);
    assertLoginPage(result.body);
};

exports.testLogout = function () {
    var result = idProvider.logout({});

    assert.assertTrue(result.redirect);
};

function assertLoginPage(body) {
    assert.assertTrue(body.indexOf("User Login Test") != -1);
    assert.assertTrue(body.indexOf("LOG IN") != -1);
}

function assertLogoutPage(body) {
    assert.assertTrue(body.indexOf("LOG IN") == -1);
    assert.assertTrue(body.indexOf("LOG OUT") != -1);
}