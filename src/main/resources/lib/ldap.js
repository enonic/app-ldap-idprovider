exports.authenticate = function (params) {
    var bean = __.newBean('com.enonic.app.ldapidprovider.LdapAuthenticateHandler');

    bean.ldapDialect = required(params, 'ldapDialect');
    bean.ldapAddress = required(params, 'ldapAddress');
    bean.ldapPort = required(params, 'ldapPort');
    bean.authDn = required(params, 'authDn');
    bean.authPassword = required(params, 'authPassword');

    return bean.execute();
};

exports.findUser = function (params) {
    var bean = __.newBean('com.enonic.app.ldapidprovider.LdapFindUserHandler');

    bean.ldapDialect = required(params, 'ldapDialect');
    bean.ldapAddress = required(params, 'ldapAddress');
    bean.ldapPort = required(params, 'ldapPort');
    bean.authDn = required(params, 'authDn');
    bean.authPassword = required(params, 'authPassword');

    bean.userBaseDn = required(params, 'userBaseDn');
    bean.username = required(params, 'username');

    return bean.execute();
};

function required(params, name) {
    var value = params[name];
    if (value === undefined) {
        throw "Parameter '" + name + "' is required";
    }
    return value;
}