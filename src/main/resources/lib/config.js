var authLib = require('/lib/xp/auth');

exports.getIdProviderConfig = function () {
    var c = authLib.getIdProviderConfig() || {};

    return {
        ldapDialect: stringValue(c.ldapDialect, 'generic'),
        serverUrl: stringValue(c.serverUrl, 'ldap://127.0.0.1:389'),
        authDn: stringValue(c.authDn, ''),
        authPassword: stringValue(c.authPassword, ''),
        connectTimeout: longValue(c.connectTimeout, 60000),
        readTimeout: longValue(c.readTimeout, 60000),
        userBaseDn: stringValue(c.userBaseDn, ''),
        createFromDn: booleanValue(c.createFromDn, false),
        defaultGroups: stringArrayValue(c.defaultGroups),
        groupMappings: groupMappingsValue(c.groupMappings),
        title: stringValue(c.title, 'LDAP Login'),
        theme: stringValue(c.theme, 'light-blue')
    };
};

function stringValue(value, defaultValue) {
    if (value !== undefined && value !== null && value !== '') {
        return String(value);
    }
    return defaultValue;
}

function longValue(value, defaultValue) {
    var parsed = parseInt(value, 10);
    if (!isNaN(parsed)) {
        return parsed;
    }
    return defaultValue;
}

function booleanValue(value, defaultValue) {
    if (value === true || value === false) {
        return value;
    }
    if (typeof value === 'string' && value !== '') {
        return value === 'true';
    }
    return defaultValue;
}

function stringArrayValue(value) {
    if (!value) {
        return [];
    }
    if (value.constructor === Array) {
        return value;
    }
    return [value];
}

function groupMappingsValue(value) {
    if (!value) {
        return [];
    }
    var arr = (value.constructor === Array) ? value : [value];
    return arr.map(function (m) {
        return {
            source: m.source,
            sourceValue: m.sourceValue,
            target: m.target
        };
    });
}
