"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteController = exports.updateController = exports.editController = exports.createController = void 0;
var express_async_handler_1 = __importDefault(require("express-async-handler"));
var slug_1 = __importDefault(require("slug"));
var prisma_client_1 = require("../../lib/prisma-client");
var helper_1 = require("../../helper/helper");
var fs = require("fs");
//----------------------------------------------
// create blog
//----------------------------------------------
exports.createController = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, slugTitle, checkIfExist, localPath, blog, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = req.user.id;
                slugTitle = (0, slug_1.default)(req.body.title);
                return [4 /*yield*/, prisma_client_1.prisma.blog.findFirst({
                        where: {
                            slug: slugTitle,
                        },
                    })];
            case 1:
                checkIfExist = _b.sent();
                if (checkIfExist) {
                    throw new Error("Creating failed because ".concat(slugTitle, " content already exist"));
                }
                localPath = "";
                if (!(req === null || req === void 0 ? void 0 : req.file)) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, helper_1.sharpUpload)(req.file, (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.title)];
            case 2:
                // // 1. get the path to img
                localPath = _b.sent();
                _b.label = 3;
            case 3:
                _b.trys.push([3, 5, , 6]);
                return [4 /*yield*/, prisma_client_1.prisma.blog.create({
                        data: __assign(__assign({}, req.body), { authorId: id, slug: slugTitle, image: localPath, content: req.body.content }),
                    })];
            case 4:
                blog = _b.sent();
                res.json({
                    message: "Blog was created successfully",
                    blog: blog,
                });
                return [3 /*break*/, 6];
            case 5:
                error_1 = _b.sent();
                res.json(error_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
//----------------------------------------------
// fetch single blog to update
//----------------------------------------------
exports.editController = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, checkIfExist, blog, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, prisma_client_1.prisma.blog.findFirst({
                        where: {
                            id: id,
                        },
                    })];
            case 1:
                checkIfExist = _a.sent();
                if (!checkIfExist)
                    throw new Error("Blog not found");
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, prisma_client_1.prisma.blog.findFirst({
                        where: {
                            id: id,
                        },
                        include: {
                            Author: true,
                        },
                    })];
            case 3:
                blog = _a.sent();
                res.json({
                    message: "Showed data detail blog successfully",
                    blog: blog,
                });
                return [3 /*break*/, 5];
            case 4:
                error_2 = _a.sent();
                res.json(error_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
//----------------------------------------------
// update blog
//----------------------------------------------
exports.updateController = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, authorId, slugTitle, blog, checkSlug, bannerOld, localPath, imageUrl, blogUpdate, error_3;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                id = req.params.id;
                authorId = req.user.authorId;
                slugTitle = (0, slug_1.default)((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.title);
                return [4 /*yield*/, prisma_client_1.prisma.blog.findFirst({
                        where: {
                            id: id,
                        },
                    })];
            case 1:
                blog = _d.sent();
                if (!blog) {
                    throw new Error("Blog not found");
                }
                return [4 /*yield*/, prisma_client_1.prisma.blog.findFirst({
                        where: {
                            slug: slugTitle,
                        },
                    })];
            case 2:
                checkSlug = _d.sent();
                if (checkSlug) {
                    throw new Error("Creating failed because ".concat(slugTitle, " content already exist"));
                }
                bannerOld = (blog === null || blog === void 0 ? void 0 : blog.image) || "";
                localPath = "";
                if (!(req === null || req === void 0 ? void 0 : req.file)) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, helper_1.sharpUpload)(req.file, ((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.title) ? (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.title : blog === null || blog === void 0 ? void 0 : blog.title)];
            case 3:
                // // 1. get the path to img
                localPath = _d.sent();
                if (localPath != "") {
                    (0, helper_1.deleteImage)(bannerOld);
                }
                _d.label = 4;
            case 4:
                imageUrl = localPath !== "" ? localPath : bannerOld;
                _d.label = 5;
            case 5:
                _d.trys.push([5, 7, , 8]);
                return [4 /*yield*/, prisma_client_1.prisma.blog.update({
                        data: __assign(__assign({}, req.body), { authorId: authorId, slug: slugTitle, image: imageUrl, content: req.body.content }),
                        where: {
                            id: id,
                        },
                    })];
            case 6:
                blogUpdate = _d.sent();
                res.json({
                    message: "Updated blog successfully",
                    blog: blogUpdate,
                });
                return [3 /*break*/, 8];
            case 7:
                error_3 = _d.sent();
                res.json(error_3);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
//----------------------------------------------
// delete blog
//----------------------------------------------
exports.deleteController = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, checkIfExist, deleteBlog, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, prisma_client_1.prisma.blog.findFirst({
                        where: {
                            id: id,
                        },
                    })];
            case 1:
                checkIfExist = _a.sent();
                if (!checkIfExist)
                    throw new Error("Blog not found");
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, prisma_client_1.prisma.blog.delete({
                        where: {
                            id: id,
                        },
                    })];
            case 3:
                deleteBlog = _a.sent();
                if ((deleteBlog === null || deleteBlog === void 0 ? void 0 : deleteBlog.image) != "") {
                    (0, helper_1.deleteImage)((deleteBlog === null || deleteBlog === void 0 ? void 0 : deleteBlog.image) || "");
                }
                res.json({
                    message: "Deleted blog successfully",
                    blog: deleteBlog,
                });
                return [3 /*break*/, 5];
            case 4:
                error_4 = _a.sent();
                res.json(error_4);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=index.js.map