var authLib = require('/lib/xp/auth');
var portalLib = require('/lib/xp/portal');
var appConfigLib = require('/lib/appConfig');

// Config file format (in com.enonic.app.ldapidprovider.cfg):
//
//   idprovider.<idProviderName>.<field>=<value>
//
// Example for an id provider named "myldap":
//
//   idprovider.myldap.ldapDialect=ad
//   idprovider.myldap.serverUrl=ldap://127.0.0.1:389
//   idprovider.myldap.authDn=cn=Manager,dc=my-domain,dc=com
//   idprovider.myldap.authPassword=secret
//   idprovider.myldap.userBaseDn=dc=my-domain,dc=com
//   idprovider.myldap.connectTimeout=60000
//   idprovider.myldap.readTimeout=60000
//   idprovider.myldap.createFromDn=false
//   idprovider.myldap.defaultGroups=group:myldap:admins group:myldap:users
//   idprovider.myldap.title=LDAP Login
//   idprovider.myldap.theme=light-blue

var CONFIG_NAMESPACE = 'idprovider';

exports.getIdProviderConfig = function () {
    var idProviderName = portalLib.getIdProviderKey();
    var idProviderKeyBase = CONFIG_NAMESPACE + '.' + idProviderName;

    var appConfig = appConfigLib.getConfig();

    var hasFileConfig = Object.keys(appConfig).some(function (key) {
        return key.indexOf(idProviderKeyBase + '.') === 0;
    });

    if (hasFileConfig) {
        return getConfigFromFile(appConfig, idProviderKeyBase);
    }

    return authLib.getIdProviderConfig();
};

function getConfigFromFile(appConfig, idProviderKeyBase) {
    return {
        ldapDialect: appConfig[idProviderKeyBase + '.ldapDialect'] || 'generic',
        serverUrl: appConfig[idProviderKeyBase + '.serverUrl'] || 'ldap://127.0.0.1:389',
        authDn: appConfig[idProviderKeyBase + '.authDn'] || '',
        authPassword: appConfig[idProviderKeyBase + '.authPassword'] || '',
        connectTimeout: parseLong(appConfig[idProviderKeyBase + '.connectTimeout'], 60000),
        readTimeout: parseLong(appConfig[idProviderKeyBase + '.readTimeout'], 60000),
        userBaseDn: appConfig[idProviderKeyBase + '.userBaseDn'] || '',
        createFromDn: appConfig[idProviderKeyBase + '.createFromDn'] === 'true',
        defaultGroups: parseStringArray(appConfig[idProviderKeyBase + '.defaultGroups']),
        title: appConfig[idProviderKeyBase + '.title'] || 'LDAP Login',
        theme: appConfig[idProviderKeyBase + '.theme'] || 'light-blue'
    };
}

function parseLong(value, defaultValue) {
    if (value === undefined || value === null) {
        return defaultValue;
    }
    var parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
}

function parseStringArray(value) {
    if (!value) {
        return [];
    }
    return value.split(' ').filter(function (v) { return !!v; });
}
