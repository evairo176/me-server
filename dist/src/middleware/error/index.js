"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.errorHandler = exports.notFound = void 0;
// not found
var notFound = function (req, res, next) {
    var error = new Error("Not Found: ".concat(req.originalUrl));
    res.status(404);
    next(error);
};
exports.notFound = notFound;
// error handling
var errorHandler = function (err, req, res, next) {
    var statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err === null || err === void 0 ? void 0 : err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};
exports.errorHandler = errorHandler;
var validate = function (schema) { return function (req, res, next) {
    try {
        schema.parse(req.body);
        next();
    }
    catch (err) {
        return res.status(400).send({
            message: "Invalid request",
            error: err.errors,
        });
    }
}; };
exports.validate = validate;
//# sourceMappingURL=index.js.map