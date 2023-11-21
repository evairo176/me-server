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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserByEmailController = exports.detailUserController = exports.createTokenController = exports.refreshTokenController = exports.userLoginProviderController = exports.userLoginController = exports.userRegisterProviderController = exports.userRegisterController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_client_1 = require("../../lib/prisma-client");
const unique_username_generator_1 = require("unique-username-generator");
const helper_1 = require("../../helper/helper");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
//----------------------------------------------
// Register
//----------------------------------------------
exports.userRegisterController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let profile_imgs_name_list = [
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
    let profile_imgs_collections_list = [
        "notionists-neutral",
        "adventurer-neutral",
        "fun-emoji",
    ];
    // check if user is already registered
    const userExists = yield prisma_client_1.prisma.user.findFirst({
        where: { email: (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.email },
    });
    if (userExists)
        throw new Error("user already registered");
    // add three random digits
    const username = (0, unique_username_generator_1.generateFromEmail)((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.email, 5);
    const salt = yield bcrypt.genSaltSync(10);
    const password = yield bcrypt.hashSync((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.password, salt);
    // console.log(password);
    try {
        const user = yield prisma_client_1.prisma.user.create({
            data: Object.assign(Object.assign({}, req.body), { username: username, password: password, image: `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/png?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}` }),
        });
        res.json({
            message: "Register Successfully",
            user: user,
        });
    }
    catch (error) {
        (0, helper_1.responseError)(error, res);
    }
}));
//----------------------------------------------
// Register with provider
//----------------------------------------------
exports.userRegisterProviderController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    // check if user is already registered
    const userExists = yield prisma_client_1.prisma.user.findFirst({
        where: { email: (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.email },
    });
    if (userExists)
        throw new Error("user already registered");
    // add three random digits
    const username = (0, unique_username_generator_1.generateFromEmail)((_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.email, 5);
    // console.log(password);
    // console.log(req?.body);
    try {
        const user = yield prisma_client_1.prisma.user.create({
            data: Object.assign(Object.assign({}, req.body), { username: username }),
        });
        res.json({
            message: "Register Successfully",
            user: user,
        });
    }
    catch (error) {
        (0, helper_1.responseError)(error, res);
    }
}));
//----------------------------------------------
// Login
//----------------------------------------------
exports.userLoginController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // check if user exists
    const userFound = yield prisma_client_1.prisma.user.findFirst({
        where: {
            email: email,
        },
    });
    if (!userFound)
        throw new Error("User not exist");
    const isPasswordMatched = yield bcrypt.compare(password, userFound === null || userFound === void 0 ? void 0 : userFound.password);
    if (!isPasswordMatched)
        throw new Error("Password not matched");
    if (userFound) {
        const token = (0, helper_1.generateToken)(userFound === null || userFound === void 0 ? void 0 : userFound.id);
        const refreshToken = (0, helper_1.generateRefreshToken)(userFound === null || userFound === void 0 ? void 0 : userFound.id);
        res.json({
            message: "Login Successfully",
            user: {
                id: userFound === null || userFound === void 0 ? void 0 : userFound.id,
                name: userFound === null || userFound === void 0 ? void 0 : userFound.name,
                email: userFound === null || userFound === void 0 ? void 0 : userFound.email,
                username: userFound === null || userFound === void 0 ? void 0 : userFound.username,
                image: userFound === null || userFound === void 0 ? void 0 : userFound.image,
            },
            token: token,
            refreshToken: refreshToken,
        });
    }
    else {
        res.status(401);
        throw new Error("Invalid login credentials");
    }
}));
//----------------------------------------------
// Login with provider example google
//----------------------------------------------
exports.userLoginProviderController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // check if user exists
    const userFound = yield prisma_client_1.prisma.user.findFirst({
        where: {
            email: email,
        },
    });
    if (!userFound)
        throw new Error("User not exist");
    if (password) {
        const isPasswordMatched = yield bcrypt.compare(password, userFound === null || userFound === void 0 ? void 0 : userFound.password);
        if (!isPasswordMatched)
            throw new Error("Password not matched");
    }
    if (userFound) {
        const token = (0, helper_1.generateToken)(userFound === null || userFound === void 0 ? void 0 : userFound.id);
        const refreshToken = (0, helper_1.generateRefreshToken)(userFound === null || userFound === void 0 ? void 0 : userFound.id);
        res.json({
            message: "Login Successfully",
            user: {
                id: userFound === null || userFound === void 0 ? void 0 : userFound.id,
                name: userFound === null || userFound === void 0 ? void 0 : userFound.name,
                email: userFound === null || userFound === void 0 ? void 0 : userFound.email,
                username: userFound === null || userFound === void 0 ? void 0 : userFound.username,
                image: userFound === null || userFound === void 0 ? void 0 : userFound.image,
            },
            token: token,
            refreshToken: refreshToken,
        });
    }
    else {
        res.status(401);
        throw new Error("Invalid login credentials");
    }
}));
//----------------------------------------------
// Refresh token
//----------------------------------------------
exports.refreshTokenController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prevToken = req.body.prevToken;
    if (!prevToken) {
        throw new Error("Access Denied. No Previous Token token provided.");
    }
    try {
        const decoded = jwt.verify(prevToken, process.env.JWT_KEY);
        const token = (0, helper_1.generateToken)(decoded.id);
        res.json({
            id: decoded.id,
            token: token,
            expired: Date.now() / 1000 + (decoded.exp - decoded.iat),
        });
    }
    catch (error) {
        throw new Error("Invalid refresh token.");
    }
}));
//----------------------------------------------
// create token
//----------------------------------------------
exports.createTokenController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.body.id;
    if (!id) {
        throw new Error("Email empty");
    }
    try {
        const token = jwt.sign({ id: id }, process.env.JWT_KEY, {
            expiresIn: "1d",
        });
        const decoded = jwt.verify(id, process.env.JWT_KEY);
        res.json({
            id: decoded.id,
            token: token,
            expired: Date.now() / 1000 + (decoded.exp - decoded.iat),
        });
    }
    catch (error) {
        throw new Error("Invalid refresh token.");
    }
}));
//----------------------------------------------
// detail user
//----------------------------------------------
exports.detailUserController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // check id
    const user = yield prisma_client_1.prisma.user.findFirst({
        where: {
            id: id,
        },
        include: {
            Blog: {
                include: {
                    Categories: true,
                    Tags: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            },
        },
    });
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
        res.status(500).json(error);
    }
}));
//----------------------------------------------
// fetch user by email
//----------------------------------------------
exports.fetchUserByEmailController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    // check id
    const user = yield prisma_client_1.prisma.user.findFirst({
        where: {
            email: email,
        },
    });
    // console.log(user);
    if (!user) {
        res.json({
            message: "Get detail user successfully",
            user: false,
        });
    }
    try {
        res.json({
            message: "Get detail user successfully",
            user: true,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
//# sourceMappingURL=index.js.map