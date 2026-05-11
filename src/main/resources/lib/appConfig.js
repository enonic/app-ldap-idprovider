// Internally used getter function, for mocking
exports.getConfig = function () {
    return (app && app.config) ? app.config : {};
};
