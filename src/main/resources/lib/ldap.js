exports.login = function (params) {
    var bean = __.newBean('com.enonic.xp.lib.auth.LdapLoginHandler');

    bean.user = required(params, 'user');
    bean.password = required(params, 'password');
    bean.ldapAddress = required(params, 'ldapAddress');
    bean.ldapPort = required(params, 'ldapPort');
    bean.ldapDialect = required(params, 'ldapDialect');
    bean.userBaseDn = required(params, 'userBaseDn');
    bean.userStore = required(params, 'userStore');

    return __.toNativeObject(bean.login());
};

function required(params, name) {
    var value = params[name];
    if (value === undefined) {
        throw "Parameter '" + name + "' is required";
    }
    return value;
}