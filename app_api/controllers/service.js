var codes = require('./codes');

module.exports.jsonResp = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.errorResp = function (res, message) {
    this.jsonResp(res, codes.CODE_404, { "message" : message });
};