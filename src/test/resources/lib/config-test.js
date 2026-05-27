var authMock = require('/lib/xp/mock/auth');
var assert = require('/lib/xp/testing');

var configLib = require('/lib/config');

exports.testGetIdProviderConfigDefaults = function () {
    authMock.setIdProviderConfig(null);

    var config = configLib.getIdProviderConfig();

    assert.assertEquals('generic', config.ldapDialect);
    assert.assertEquals('ldap://127.0.0.1:389', config.serverUrl);
    assert.assertEquals('', config.authDn);
    assert.assertEquals('', config.authPassword);
    assert.assertEquals(60000, config.connectTimeout);
    assert.assertEquals(60000, config.readTimeout);
    assert.assertEquals('', config.userBaseDn);
    assert.assertTrue(config.createFromDn === false);
    assert.assertEquals(0, config.defaultGroups.length);
    assert.assertEquals(0, config.groupMappings.length);
    assert.assertEquals('LDAP Login', config.title);
    assert.assertEquals('light-blue', config.theme);
};

exports.testGetIdProviderConfigFromIdProviderConfig = function () {
    authMock.setIdProviderConfig({
        ldapDialect: 'ad',
        serverUrl: 'ldap://from-provider:389',
        authDn: 'cn=Provider,dc=example,dc=com',
        authPassword: 'providerpass',
        connectTimeout: 12345,
        readTimeout: 23456,
        userBaseDn: 'dc=provider,dc=com',
        createFromDn: true,
        defaultGroups: ['group:system:foo', 'group:system:bar'],
        groupMappings: [
            {source: 'ldapGroup', sourceValue: 'Domain Admins', target: 'role:system.admin'},
            {source: 'ldapGroupDn', sourceValue: 'cn=Devs,ou=g,dc=x,dc=y', target: 'group:system:devs'}
        ],
        title: 'Provider Title',
        theme: 'dark-green'
    });

    var config = configLib.getIdProviderConfig();

    assert.assertEquals('ad', config.ldapDialect);
    assert.assertEquals('ldap://from-provider:389', config.serverUrl);
    assert.assertEquals('cn=Provider,dc=example,dc=com', config.authDn);
    assert.assertEquals('providerpass', config.authPassword);
    assert.assertEquals(12345, config.connectTimeout);
    assert.assertEquals(23456, config.readTimeout);
    assert.assertEquals('dc=provider,dc=com', config.userBaseDn);
    assert.assertTrue(config.createFromDn === true);
    assert.assertEquals(2, config.defaultGroups.length);
    assert.assertEquals('group:system:foo', config.defaultGroups[0]);
    assert.assertEquals(2, config.groupMappings.length);
    assert.assertEquals('ldapGroup', config.groupMappings[0].source);
    assert.assertEquals('Domain Admins', config.groupMappings[0].sourceValue);
    assert.assertEquals('role:system.admin', config.groupMappings[0].target);
    assert.assertEquals('Provider Title', config.title);
    assert.assertEquals('dark-green', config.theme);

    authMock.setIdProviderConfig(null);
};

exports.testSingleGroupMappingObject = function () {
    authMock.setIdProviderConfig({
        groupMappings: {source: 'ldapGroup', sourceValue: 'Admins', target: 'role:system.admin'}
    });

    var config = configLib.getIdProviderConfig();

    assert.assertEquals(1, config.groupMappings.length);
    assert.assertEquals('ldapGroup', config.groupMappings[0].source);
    assert.assertEquals('Admins', config.groupMappings[0].sourceValue);
    assert.assertEquals('role:system.admin', config.groupMappings[0].target);

    authMock.setIdProviderConfig(null);
};

exports.testSingleDefaultGroupAsString = function () {
    authMock.setIdProviderConfig({
        defaultGroups: 'group:system:only'
    });

    var config = configLib.getIdProviderConfig();

    assert.assertEquals(1, config.defaultGroups.length);
    assert.assertEquals('group:system:only', config.defaultGroups[0]);

    authMock.setIdProviderConfig(null);
};
