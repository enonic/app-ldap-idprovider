exports.authenticate = function (params) {
    var bean = __.newBean('com.enonic.app.ldapidprovider.LdapAuthenticateHandler');

    bean.ldapDialect = required(params, 'ldapDialect');
    bean.ldapAddress = required(params, 'ldapAddress');
    bean.ldapPort = required(params, 'ldapPort');
    bean.userBaseDn = required(params, 'userBaseDn');
    bean.user = required(params, 'user');
    bean.password = required(params, 'password');

    return bean.authenticate();
};

function required(params, name) {
    var value = params[name];
    if (value === undefined) {
        throw "Parameter '" + name + "' is required";
    }
    return value;
}