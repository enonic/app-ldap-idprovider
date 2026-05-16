var authLib = require('/lib/xp/auth');
var portalLib = require('/lib/xp/portal');
var appConfigLib = require('/lib/appConfig');

// Configuration is sourced (in priority order) from:
//
//  1. IdProviderConfig.config — the structured config passed to
//     auth.createIdProvider({ idProviderConfig: { applicationKey, config: {...} } }).
//     Used for per-id-provider settings; available at runtime via authLib.getIdProviderConfig().
//
//  2. app.config — the application's .cfg file (com.enonic.app.ldapidprovider.cfg),
//     keyed by id provider name:
//
//       idprovider.<idProviderName>.<field>=<value>
//
//     Example for an id provider named "myldap":
//
//       idprovider.myldap.ldapDialect=ad
//       idprovider.myldap.serverUrl=ldap://127.0.0.1:389
//       idprovider.myldap.authDn=cn=Manager,dc=my-domain,dc=com
//       idprovider.myldap.authPassword=secret
//       idprovider.myldap.userBaseDn=dc=my-domain,dc=com
//       idprovider.myldap.connectTimeout=60000
//       idprovider.myldap.readTimeout=60000
//       idprovider.myldap.createFromDn=false
//       idprovider.myldap.defaultGroups=group:myldap:admins group:myldap:users
//       idprovider.myldap.groupMappings.0.source=ldapGroup
//       idprovider.myldap.groupMappings.0.sourceValue=Domain Admins
//       idprovider.myldap.groupMappings.0.target=role:system.admin
//       idprovider.myldap.title=LDAP Login
//       idprovider.myldap.theme=light-blue

var CONFIG_NAMESPACE = 'idprovider';

exports.getIdProviderConfig = function () {
    var idProviderName = portalLib.getIdProviderKey();
    var idProviderKeyBase = CONFIG_NAMESPACE + '.' + idProviderName;
    var appConfig = appConfigLib.getConfig() || {};
    var providerConfig = authLib.getIdProviderConfig() || {};

    return {
        ldapDialect: stringValue(providerConfig.ldapDialect, appConfig[idProviderKeyBase + '.ldapDialect'], 'generic'),
        serverUrl: stringValue(providerConfig.serverUrl, appConfig[idProviderKeyBase + '.serverUrl'], 'ldap://127.0.0.1:389'),
        authDn: stringValue(providerConfig.authDn, appConfig[idProviderKeyBase + '.authDn'], ''),
        authPassword: stringValue(providerConfig.authPassword, appConfig[idProviderKeyBase + '.authPassword'], ''),
        connectTimeout: longValue(providerConfig.connectTimeout, appConfig[idProviderKeyBase + '.connectTimeout'], 60000),
        readTimeout: longValue(providerConfig.readTimeout, appConfig[idProviderKeyBase + '.readTimeout'], 60000),
        userBaseDn: stringValue(providerConfig.userBaseDn, appConfig[idProviderKeyBase + '.userBaseDn'], ''),
        createFromDn: booleanValue(providerConfig.createFromDn, appConfig[idProviderKeyBase + '.createFromDn'], false),
        defaultGroups: stringArrayValue(providerConfig.defaultGroups, appConfig[idProviderKeyBase + '.defaultGroups']),
        groupMappings: groupMappingsValue(providerConfig.groupMappings, appConfig, idProviderKeyBase + '.groupMappings'),
        title: stringValue(providerConfig.title, appConfig[idProviderKeyBase + '.title'], 'LDAP Login'),
        theme: stringValue(providerConfig.theme, appConfig[idProviderKeyBase + '.theme'], 'light-blue')
    };
};

function stringValue(providerValue, fileValue, defaultValue) {
    if (providerValue !== undefined && providerValue !== null && providerValue !== '') {
        return String(providerValue);
    }
    if (fileValue !== undefined && fileValue !== null && fileValue !== '') {
        return String(fileValue);
    }
    return defaultValue;
}

function longValue(providerValue, fileValue, defaultValue) {
    var parsed = parseInt(providerValue, 10);
    if (!isNaN(parsed)) {
        return parsed;
    }
    parsed = parseInt(fileValue, 10);
    if (!isNaN(parsed)) {
        return parsed;
    }
    return defaultValue;
}

function booleanValue(providerValue, fileValue, defaultValue) {
    if (providerValue === true || providerValue === false) {
        return providerValue;
    }
    if (typeof providerValue === 'string' && providerValue !== '') {
        return providerValue === 'true';
    }
    if (fileValue !== undefined && fileValue !== null && fileValue !== '') {
        return fileValue === 'true';
    }
    return defaultValue;
}

function stringArrayValue(providerValue, fileValue) {
    if (providerValue) {
        if (providerValue.constructor === Array) {
            return providerValue;
        }
        return [providerValue];
    }
    if (fileValue) {
        return fileValue.split(' ').filter(function (v) { return !!v; });
    }
    return [];
}

function groupMappingsValue(providerValue, appConfig, fileKeyBase) {
    if (providerValue) {
        var arr = (providerValue.constructor === Array) ? providerValue : [providerValue];
        return arr.map(function (m) {
            return {
                source: m.source,
                sourceValue: m.sourceValue,
                target: m.target
            };
        });
    }

    var mappings = [];
    var prefix = fileKeyBase + '.';
    var index = 0;

    while (true) {
        var sourceKey = prefix + index + '.source';
        var sourceValueKey = prefix + index + '.sourceValue';
        var targetKey = prefix + index + '.target';

        if (!appConfig[sourceKey]) {
            break;
        }

        mappings.push({
            source: appConfig[sourceKey],
            sourceValue: appConfig[sourceValueKey],
            target: appConfig[targetKey]
        });

        index++;
    }

    return mappings;
}
