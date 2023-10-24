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
exports.detailUserController = exports.userLoginController = exports.userRegisterController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_client_1 = require("../../lib/prisma-client");
const unique_username_generator_1 = require("unique-username-generator");
const helper_1 = require("../../helper/helper");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
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
    try {
        const user = yield prisma_client_1.prisma.user.create({
            data: Object.assign(Object.assign({}, req.body), { username: username, password: password, profile_img: `https://api.dicebear.com/6.x/${profile_imgs_collections_list[Math.floor(Math.random() * profile_imgs_collections_list.length)]}/svg?seed=${profile_imgs_name_list[Math.floor(Math.random() * profile_imgs_name_list.length)]}` }),
        });
        res.json({
            message: "Register Successfully",
            user: user,
        });
    }
    catch (error) {
        res.json(error);
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
        res.json(error);
    }
}));
//# sourceMappingURL=index.js.map