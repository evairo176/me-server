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
exports.detailUserController = exports.userLoginController = exports.userRegisterController = void 0;
var express_async_handler_1 = __importDefault(require("express-async-handler"));
var prisma_client_1 = require("../../lib/prisma-client");
var unique_username_generator_1 = require("unique-username-generator");
var helper_1 = require("../../helper/helper");
var bcrypt = require("bcrypt");
var crypto = require("crypto");
//----------------------------------------------
// Register
//----------------------------------------------
exports.userRegisterController = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var profile_imgs_name_list, profile_imgs_collections_list, userExists, username, salt, password, user, error_1;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                profile_imgs_name_list = [
                    "Garfield",
                    "Tinkerbell",
                    "Annie",
                    "Loki",
                    "Cleo",
                    "Angel",
                    "Bob",
                    "Mia",
                    "Coco",
                    "Gracie",
                    "Bear",
                    "Bella",
                    "Abby",
                    "Harley",
                    "Cali",
                    "Leo",
                    "Luna",
                    "Jack",
                    "Felix",
                    "Kiki",
                ];
                profile_imgs_collections_list = [
                    "notionists-neutral",
                    "adventurer-neutral",
                    "fun-emoji",
                ];
                return [4 /*yield*/, prisma_client_1.prisma.user.findFirst({
                        where: { email: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.email },
                    })];
            case 1:
                userExists = _d.sent();
                if (userExists)
                    throw new Error("user already registered");
                username = (0, unique_username_generator_1.generateFromEmail)((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.email, 5);
                return [4 /*yield*/, bcrypt.genSaltSync(10)];
            case 2:
                salt = _d.sent();
                return [4 /*yield*/, bcrypt.hashSync((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.password, salt)];
            case 3:
                password = _d.sent();
                _d.label = 4;
            case 4:
                _d.trys.push([4, 6, , 7]);
                return [4 /*yield*/, prisma_client_1.prisma.user.create({
                        data: __assign(__assign({}, req.body), { username: username, password: password, profile_img: "https://api.dicebear.com/6.x/".concat(profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)], "/svg?seed=").concat(profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]) }),
                    })];
            case 5:
                user = _d.sent();
                res.json({
                    message: "Register Successfully",
                    user: user,
                });
                return [3 /*break*/, 7];
            case 6:
                error_1 = _d.sent();
                res.json(error_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
//----------------------------------------------
// Login
//----------------------------------------------
exports.userLoginController = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, userFound, isPasswordMatched;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                return [4 /*yield*/, prisma_client_1.prisma.user.findFirst({
                        where: {
                            email: email,
                        },
                    })];
            case 1:
                userFound = _b.sent();
                if (!userFound)
                    throw new Error("User not exist");
                return [4 /*yield*/, bcrypt.compare(password, userFound === null || userFound === void 0 ? void 0 : userFound.password)];
            case 2:
                isPasswordMatched = _b.sent();
                if (!isPasswordMatched)
                    throw new Error("Password not matched");
                if (userFound && isPasswordMatched) {
                    res.json({
                        message: "Login Successfully",
                        user: {
                            id: userFound === null || userFound === void 0 ? void 0 : userFound.id,
                            fullname: userFound === null || userFound === void 0 ? void 0 : userFound.fullname,
                            email: userFound === null || userFound === void 0 ? void 0 : userFound.email,
                            username: userFound === null || userFound === void 0 ? void 0 : userFound.username,
                            profile_img: userFound === null || userFound === void 0 ? void 0 : userFound.profile_img,
                        },
                        token: (0, helper_1.generateToken)(userFound === null || userFound === void 0 ? void 0 : userFound.id),
                    });
                }
                else {
                    res.status(401);
                    throw new Error("Invalid login credentials");
                }
                return [2 /*return*/];
        }
    });
}); });
//----------------------------------------------
// detail user
//----------------------------------------------
exports.detailUserController = (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = req.params.id;
                return [4 /*yield*/, prisma_client_1.prisma.user.findFirst({
                        where: {
                            id: id,
                        },
                        include: {
                            Blog: true,
                        },
                    })];
            case 1:
                user = _a.sent();
                // console.log(user);
                if (!user)
                    throw new Error("User not exist");
                try {
                    res.json({
                        message: "Get detail user successfully",
                        user: user,
                    });
                }
                catch (error) {
                    res.json(error);
                }
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=index.js.map