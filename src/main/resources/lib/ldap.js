exports.authenticate = function (params) {
    var bean = __.newBean('com.enonic.app.ldapidprovider.LdapAuthenticateHandler');

    bean.setLdapDialect(required(params, 'ldapDialect'));
    bean.setServerUrl(required(params, 'serverUrl'));
    bean.setAuthDn(required(params, 'authDn'));
    bean.setAuthPassword(required(params, 'authPassword'));
    bean.setConnectTimeout(params.connectTimeout);
    bean.setReadTimeout(params.readTimeout);

    return bean.execute();
};

exports.findUser = function (params) {
    var bean = __.newBean('com.enonic.app.ldapidprovider.LdapFindUserHandler');

    bean.setLdapDialect(required(params, 'ldapDialect'));
    bean.setServerUrl(required(params, 'serverUrl'));
    bean.setAuthDn(required(params, 'authDn'));
    bean.setAuthPassword(required(params, 'authPassword'));
    bean.setConnectTimeout(params.connectTimeout);
    bean.setReadTimeout(params.readTimeout);

    bean.setUserBaseDn(required(params, 'userBaseDn'));
    bean.setUsername(__.nullOrValue(params.username));

    return __.toNativeObject(bean.execute());
};

exports.findGroups = function (params) {
    var bean = __.newBean('com.enonic.app.ldapidprovider.LdapFindGroupsHandler');

    bean.setLdapDialect(required(params, 'ldapDialect'));
    bean.setServerUrl(required(params, 'serverUrl'));
    bean.setAuthDn(required(params, 'authDn'));
    bean.setAuthPassword(required(params, 'authPassword'));
    bean.setConnectTimeout(params.connectTimeout);
    bean.setReadTimeout(params.readTimeout);

    bean.setUserDn(required(params, 'userDn'));

    return __.toNativeObject(bean.execute());
};

function required(params, name) {
    var value = params[name];
    if (value === undefined) {
        throw "Parameter '" + name + "' is required";
    }
    return value;
}