var portalLib = require('/lib/xp/portal');

function handlePost(req) {
    var body = JSON.parse(req.body);
    var userStoreKey = portalLib.getUserStoreKey();
    var loginResult = ldapLogin({
        user: body.user,
        password: body.password,
        ldapAddress: body.ldapAddress,
        ldapPort: body.ldapPort,
        ldapBaseDn: body.ldapBaseDn,
        userStore: userStoreKey.toLowerCase()
    });
    return {
        body: loginResult,
        contentType: 'application/json'
    };
}

function required(params, name) {
    var value = params[name];
    if (value === undefined) {
        throw "Parameter '" + name + "' is required";
    }

    return value;
}

/**
 * Login a user in LDAP
 *
 * @param {object} params JSON parameters.
 * @param {string} params.user Name of user to log in.
 * @param {string} [params.userStore] Name of user-store where the user is stored.
 * @param {string} [params.password] Password for the user.
 * @returns {object} Information for logged-in user.
 */
function ldapLogin(params) {
    var bean = __.newBean('com.enonic.xp.lib.auth.LdapLoginHandler');

    bean.user = required(params, 'user');

    bean.password = required(params, 'password');

    bean.ldapAddress = required(params, 'ldapAddress');
    
    bean.ldapPort = required(params, 'ldapPort');
    
    bean.ldapBaseDn = required(params, 'ldapBaseDn');

    bean.userStore = required(params, 'userStore');

    return __.toNativeObject(bean.login());
};

exports.post = handlePost;
