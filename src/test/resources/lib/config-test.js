var appConfigMock = require('/lib/mock/appConfig');
var authMock = require('/lib/xp/mock/auth');
var portalMock = require('/lib/xp/mock/portal');
var assert = require('/lib/xp/testing');

var configLib = require('/lib/config');

exports.testGetIdProviderConfigFromFile = function () {
    authMock.setIdProviderConfig(null);
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

exports.testGetIdProviderConfigDefaults = function () {
    authMock.setIdProviderConfig(null);
    appConfigMock.setConfig({});

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
    appConfigMock.setConfig({});
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

exports.testIdProviderConfigOverridesFile = function () {
    appConfigMock.setConfig({
        'idprovider.system.serverUrl': 'ldap://from-file:389',
        'idprovider.system.title': 'File Title',
        'idprovider.system.authDn': 'cn=File,dc=x,dc=y'
    });
    authMock.setIdProviderConfig({
        serverUrl: 'ldap://from-provider:389',
        title: 'Provider Title'
    });

    var config = configLib.getIdProviderConfig();

    assert.assertEquals('ldap://from-provider:389', config.serverUrl);
    assert.assertEquals('Provider Title', config.title);
    assert.assertEquals('cn=File,dc=x,dc=y', config.authDn);

    appConfigMock.setConfig({});
    authMock.setIdProviderConfig(null);
};

exports.testGetIdProviderConfigWithGroupMappingsFromFile = function () {
    authMock.setIdProviderConfig(null);
    appConfigMock.setConfig({
        'idprovider.system.ldapDialect': 'ad',
        'idprovider.system.serverUrl': 'ldap://myserver:389',
        'idprovider.system.authDn': 'cn=Admin,dc=example,dc=com',
        'idprovider.system.authPassword': 'mypassword',
        'idprovider.system.connectTimeout': '30000',
        'idprovider.system.readTimeout': '30000',
        'idprovider.system.userBaseDn': 'dc=example,dc=com',
        'idprovider.system.groupMappings.0.source': 'ldapGroup',
        'idprovider.system.groupMappings.0.sourceValue': 'Domain Admins',
        'idprovider.system.groupMappings.0.target': 'role:system.admin',
        'idprovider.system.groupMappings.1.source': 'ldapGroupDn',
        'idprovider.system.groupMappings.1.sourceValue': 'cn=Developers,ou=Groups,dc=example,dc=com',
        'idprovider.system.groupMappings.1.target': 'group:system:developers',
        'idprovider.system.title': 'Test Login'
    });

    var config = configLib.getIdProviderConfig();

    assert.assertEquals('ad', config.ldapDialect);
    assert.assertEquals('ldap://myserver:389', config.serverUrl);

    assert.assertNotNull(config.groupMappings);
    assert.assertEquals(2, config.groupMappings.length);

    assert.assertEquals('ldapGroup', config.groupMappings[0].source);
    assert.assertEquals('Domain Admins', config.groupMappings[0].sourceValue);
    assert.assertEquals('role:system.admin', config.groupMappings[0].target);

    assert.assertEquals('ldapGroupDn', config.groupMappings[1].source);
    assert.assertEquals('cn=Developers,ou=Groups,dc=example,dc=com', config.groupMappings[1].sourceValue);
    assert.assertEquals('group:system:developers', config.groupMappings[1].target);

    appConfigMock.setConfig({});
};

exports.testGetIdProviderConfigWithNoGroupMappings = function () {
    authMock.setIdProviderConfig(null);
    appConfigMock.setConfig({
        'idprovider.system.serverUrl': 'ldap://myserver:389'
    });

    var config = configLib.getIdProviderConfig();

    assert.assertNotNull(config.groupMappings);
    assert.assertEquals(0, config.groupMappings.length);

    appConfigMock.setConfig({});
};

exports.testSingleGroupMappingObject = function () {
    appConfigMock.setConfig({});
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
    appConfigMock.setConfig({});
    authMock.setIdProviderConfig({
        defaultGroups: 'group:system:only'
    });

    var config = configLib.getIdProviderConfig();

    assert.assertEquals(1, config.defaultGroups.length);
    assert.assertEquals('group:system:only', config.defaultGroups[0]);

    authMock.setIdProviderConfig(null);
};
