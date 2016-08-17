exports.generateUniqueUserName = function (userStoreKey, userName) {
    var bean = __.newBean('com.enonic.app.ldapidprovider.UniqueUserNameGenerator');

    bean.userStoreKey = userStoreKey;
    bean.userName = userName;

    return bean.execute();
};