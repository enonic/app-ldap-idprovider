var staticLib = require('/lib/enonic/static');

exports.get = function (req) {
    return staticLib.requestHandler(req, {
        index: false,
        root: '/assets'
    });
};
