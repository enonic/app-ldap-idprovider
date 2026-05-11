var appConfigMock = require('/lib/mock/appConfig');
var authMock = require('/lib/xp/mock/auth');
var portalMock = require('/lib/xp/mock/portal');
var assert = require('/lib/xp/testing');

var configLib = require('/lib/config');

exports.testGetIdProviderConfigFromFile = function () {
    appConfigMock.setConfig({
        'idprovider.system.ldapDialect': 'ad',
        'idprovider.system.serverUrl': 'ldap://myserver:389',
        'idprovider.system.authDn': 'cn=Admin,dc=example,dc=com',
        'idprovider.system.authPassword': 'mypassword',
        'idprovider.system.connectTimeout': '30000',
        'idprovider.system.readTimeout': '30000',
        'idprovider.system.userBaseDn': 'dc=example,dc=com',
        'idprovider.system.createFromDn': 'true',
        'idprovider.system.defaultGroups': 'group:system:admins group:system:users',
        'idprovider.system.title': 'File Config Login',
        'idprovider.system.theme': 'dark-blue'
    });

    var config = configLib.getIdProviderConfig();

    assert.assertEquals('ad', config.ldapDialect);
    assert.assertEquals('ldap://myserver:389', config.serverUrl);
    assert.assertEquals('cn=Admin,dc=example,dc=com', config.authDn);
    assert.assertEquals('mypassword', config.authPassword);
    assert.assertEquals(30000, config.connectTimeout);
    assert.assertEquals(30000, config.readTimeout);
    assert.assertEquals('dc=example,dc=com', config.userBaseDn);
    assert.assertTrue(config.createFromDn === true);
    assert.assertEquals(2, config.defaultGroups.length);
    assert.assertEquals('group:system:admins', config.defaultGroups[0]);
    assert.assertEquals('group:system:users', config.defaultGroups[1]);
    assert.assertEquals('File Config Login', config.title);
    assert.assertEquals('dark-blue', config.theme);

    appConfigMock.setConfig({});
};

exports.testGetIdProviderConfigFromFileDefaults = function () {
    appConfigMock.setConfig({
        'idprovider.system.serverUrl': 'ldap://myserver:389'
    });

    var config = configLib.getIdProviderConfig();

    assert.assertEquals('generic', config.ldapDialect);
    assert.assertEquals('ldap://myserver:389', config.serverUrl);
    assert.assertEquals('', config.authDn);
    assert.assertEquals('', config.authPassword);
    assert.assertEquals(60000, config.connectTimeout);
    assert.assertEquals(60000, config.readTimeout);
    assert.assertEquals('', config.userBaseDn);
    assert.assertTrue(config.createFromDn === false);
    assert.assertEquals(0, config.defaultGroups.length);
    assert.assertEquals('LDAP Login', config.title);
    assert.assertEquals('light-blue', config.theme);

    appConfigMock.setConfig({});
};

exports.testGetIdProviderConfigFallbackToNodeStorage = function () {
    appConfigMock.setConfig({});

    var config = configLib.getIdProviderConfig();

    assert.assertEquals('User Login Test', config.title);
};
