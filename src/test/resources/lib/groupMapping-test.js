var assert = require('/lib/xp/testing');

// Mock auth library (registered before requiring /lib/groupMapping so the lib picks up the mock)
var addMembersResults = [];
var authMock = {
    addMembers: function(groupKey, userKeys) {
        addMembersResults.push({groupKey: groupKey, userKeys: userKeys});
    }
};
__.registerMock('/lib/xp/auth.js', authMock);

var groupMappingLib = require('/lib/groupMapping');

exports.testMatchesLdapGroupByName = function() {
    addMembersResults = [];

    var ldapUser = {
        login: 'testuser',
        dn: 'cn=Test User,ou=Users,dc=example,dc=com'
    };

    var ldapGroups = [
        'cn=Domain Admins,cn=Users,dc=example,dc=com',
        'cn=Developers,ou=Groups,dc=example,dc=com',
        'cn=IT Staff,ou=Groups,dc=example,dc=com'
    ];

    var idProviderConfig = {
        groupMappings: [
            {
                source: 'ldapGroup',
                sourceValue: 'Domain Admins',
                target: 'role:system.admin'
            },
            {
                source: 'ldapGroup',
                sourceValue: 'Developers',
                target: 'group:system:developers'
            }
        ]
    };

    var user = {
        key: 'user:system:testuser'
    };

    groupMappingLib.processMappings(ldapUser, ldapGroups, idProviderConfig, user, 'system');

    // Should have added user to both groups
    assert.assertEquals(2, addMembersResults.length);
    assert.assertEquals('role:system.admin', addMembersResults[0].groupKey);
    assert.assertEquals('group:system:developers', addMembersResults[1].groupKey);
};

exports.testMatchesLdapGroupByDn = function() {
    addMembersResults = [];

    var ldapUser = {
        login: 'testuser',
        dn: 'cn=Test User,ou=Users,dc=example,dc=com'
    };

    var ldapGroups = [
        'cn=ProjectA-Team,ou=Projects,dc=company,dc=com',
        'cn=ProjectB-Team,ou=Projects,dc=company,dc=com'
    ];

    var idProviderConfig = {
        groupMappings: [
            {
                source: 'ldapGroupDn',
                sourceValue: 'cn=ProjectA-Team,ou=Projects,dc=company,dc=com',
                target: 'group:system:project-a'
            },
            {
                source: 'ldapGroupDn',
                sourceValue: 'cn=ProjectC-Team,ou=Projects,dc=company,dc=com',
                target: 'group:system:project-c'
            }
        ]
    };

    var user = {
        key: 'user:system:testuser'
    };

    groupMappingLib.processMappings(ldapUser, ldapGroups, idProviderConfig, user, 'system');

    // Should have added user to only project-a (not project-c, as user is not in that group)
    assert.assertEquals(1, addMembersResults.length);
    assert.assertEquals('group:system:project-a', addMembersResults[0].groupKey);
};

exports.testCaseInsensitiveMatching = function() {
    addMembersResults = [];

    var ldapUser = {
        login: 'testuser',
        dn: 'cn=Test User,ou=Users,dc=example,dc=com'
    };

    var ldapGroups = [
        'CN=Domain Admins,CN=Users,DC=EXAMPLE,DC=COM'
    ];

    var idProviderConfig = {
        groupMappings: [
            {
                source: 'ldapGroup',
                sourceValue: 'domain admins',
                target: 'role:system.admin'
            },
            {
                source: 'ldapGroupDn',
                sourceValue: 'cn=domain admins,cn=users,dc=example,dc=com',
                target: 'role:system.admin.extra'
            }
        ]
    };

    var user = {
        key: 'user:system:testuser'
    };

    groupMappingLib.processMappings(ldapUser, ldapGroups, idProviderConfig, user, 'system');

    // Both should match (case-insensitive)
    assert.assertEquals(2, addMembersResults.length);
};

exports.testNoMappingsConfigured = function() {
    addMembersResults = [];

    var ldapUser = {
        login: 'testuser',
        dn: 'cn=Test User,ou=Users,dc=example,dc=com'
    };

    var ldapGroups = ['cn=Some Group,dc=example,dc=com'];

    var idProviderConfig = {
        groupMappings: []
    };

    var user = {
        key: 'user:system:testuser'
    };

    groupMappingLib.processMappings(ldapUser, ldapGroups, idProviderConfig, user, 'system');

    // Should not add to any groups
    assert.assertEquals(0, addMembersResults.length);
};

exports.testNoMatchingGroups = function() {
    addMembersResults = [];

    var ldapUser = {
        login: 'testuser',
        dn: 'cn=Test User,ou=Users,dc=example,dc=com'
    };

    var ldapGroups = [
        'cn=Regular Users,ou=Groups,dc=example,dc=com'
    ];

    var idProviderConfig = {
        groupMappings: [
            {
                source: 'ldapGroup',
                sourceValue: 'Administrators',
                target: 'role:system.admin'
            }
        ]
    };

    var user = {
        key: 'user:system:testuser'
    };

    groupMappingLib.processMappings(ldapUser, ldapGroups, idProviderConfig, user, 'system');

    // Should not add to any groups
    assert.assertEquals(0, addMembersResults.length);
};
