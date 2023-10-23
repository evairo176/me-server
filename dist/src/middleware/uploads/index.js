"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postImgResize = exports.profilePhotoResize = exports.photoUpload = void 0;
var multer = require("multer");
var sharp = require("sharp");
var path = require("path");
// storage
var multerStorage = multer.memoryStorage();
//file type checking..
var multerFilter = function (req, file, callback) {
    // check file type
    if (file.mimetype.startsWith("image")) {
        callback(null, true);
    }
    else {
        // rejected files
        callback({
            message: "Unsupported file format",
        }, false);
    }
};
exports.photoUpload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 1000000000 },
});
//image resizing
var profilePhotoResize = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                //check if there no file to resize
                if (!req.file)
                    return [2 /*return*/, next()];
                req.file.filename = "user-".concat(Date.now(), "-").concat(req.file.originalname);
                return [4 /*yield*/, sharp(req.file.buffer)
                        .resize(950, 750)
                        .toFormat("jpeg")
                        .jpeg({
                        quality: 90,
                    })
                        .toFile(path.join("public/images/profile/".concat(req.file.filename)))];
            case 1:
                _a.sent();
                next();
                return [2 /*return*/];
        }
    });
}); };
exports.profilePhotoResize = profilePhotoResize;
//Post image resizing
var postImgResize = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                //check if there no file to resize
                if (!req.file)
                    return [2 /*return*/, next()];
                req.file.filename = "".concat(Date.now(), "-").concat(req.file.originalname);
                return [4 /*yield*/, sharp(req.file.buffer)
                        // .resize(500, 500)
                        .toFormat("jpeg")
                        .jpeg({
                        quality: 90,
                    })
                        .toFile(path.join("public/images/blogs/".concat(req.file.filename)))];
            case 1:
                _a.sent();
                next();
                return [2 /*return*/];
        }
    });
}); };
exports.postImgResize = postImgResize;
module.exports = {
    photoUpload: exports.photoUpload,
    profilePhotoResize: exports.profilePhotoResize,
    postImgResize: exports.postImgResize,
};
//# sourceMappingURL=index.js.map