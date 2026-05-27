exports.authenticate = function (params) {
    var bean = __.newBean('com.enonic.app.ldapidprovider.LdapAuthenticateHandler');

    bean.ldapDialect = required(params, 'ldapDialect');
    bean.serverUrl = required(params, 'serverUrl');
    bean.authDn = required(params, 'authDn');
    bean.authPassword = required(params, 'authPassword');
    bean.connectTimeout = params.connectTimeout;
    bean.readTimeout = params.readTimeout;

    return bean.execute();
};

exports.findUser = function (params) {
    var bean = __.newBean('com.enonic.app.ldapidprovider.LdapFindUserHandler');

    bean.ldapDialect = required(params, 'ldapDialect');
    bean.serverUrl = required(params, 'serverUrl');
    bean.authDn = required(params, 'authDn');
    bean.authPassword = required(params, 'authPassword');
    bean.connectTimeout = params.connectTimeout;
    bean.readTimeout = params.readTimeout;

    bean.userBaseDn = required(params, 'userBaseDn');
    bean.username = params.username;

    return __.toNativeObject(bean.execute());
};

exports.findGroups = function (params) {
    var bean = __.newBean('com.enonic.app.ldapidprovider.LdapFindGroupsHandler');

    bean.ldapDialect = required(params, 'ldapDialect');
    bean.serverUrl = required(params, 'serverUrl');
    bean.authDn = required(params, 'authDn');
    bean.authPassword = required(params, 'authPassword');
    bean.connectTimeout = params.connectTimeout;
    bean.readTimeout = params.readTimeout;

    bean.userDn = required(params, 'userDn');

    return __.toNativeObject(bean.execute());
};

function required(params, name) {
    var value = params[name];
    if (value === undefined) {
        throw "Parameter '" + name + "' is required";
    }
    return value;
}