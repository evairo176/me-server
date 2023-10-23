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
exports.deleteController = exports.updateController = exports.editController = exports.createController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const slug_1 = __importDefault(require("slug"));
const prisma_client_1 = require("../../lib/prisma-client");
const helper_1 = require("../../helper/helper");
const fs = require("fs");
//----------------------------------------------
// create blog
//----------------------------------------------
exports.createController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.user;
    const slugTitle = (0, slug_1.default)(req.body.title);
    const checkIfExist = yield prisma_client_1.prisma.blog.findFirst({
        where: {
            slug: slugTitle,
        },
    });
    if (checkIfExist) {
        throw new Error(`Creating failed because ${slugTitle} content already exist`);
    }
    // console.log(req.body.image);
    let localPath = "";
    if (req === null || req === void 0 ? void 0 : req.file) {
        // // 1. get the path to img
        localPath = yield (0, helper_1.sharpUpload)(req.file, (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.title);
    }
    try {
        const blog = yield prisma_client_1.prisma.blog.create({
            data: Object.assign(Object.assign({}, req.body), { authorId: id, slug: slugTitle, image: localPath, content: req.body.content }),
        });
        res.json({
            message: `Blog was created successfully`,
            blog: blog,
        });
    }
    catch (error) {
        res.json(error);
    }
}));
//----------------------------------------------
// fetch single blog to update
//----------------------------------------------
exports.editController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const checkIfExist = yield prisma_client_1.prisma.blog.findFirst({
        where: {
            id: id,
        },
    });
    if (!checkIfExist)
        throw new Error(`Blog not found`);
    try {
        const blog = yield prisma_client_1.prisma.blog.findFirst({
            where: {
                id: id,
            },
            include: {
                Author: true,
            },
        });
        res.json({
            message: `Showed data detail blog successfully`,
            blog: blog,
        });
    }
    catch (error) {
        res.json(error);
    }
}));
//----------------------------------------------
// update blog
//----------------------------------------------
exports.updateController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    const { id } = req.params;
    const { authorId } = req.user;
    const slugTitle = (0, slug_1.default)((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.title);
    const blog = yield prisma_client_1.prisma.blog.findFirst({
        where: {
            id: id,
        },
    });
    if (!blog) {
        throw new Error(`Blog not found`);
    }
    const checkSlug = yield prisma_client_1.prisma.blog.findFirst({
        where: {
            slug: slugTitle,
        },
    });
    if (checkSlug) {
        throw new Error(`Creating failed because ${slugTitle} content already exist`);
    }
    const bannerOld = (blog === null || blog === void 0 ? void 0 : blog.image) || "";
    let localPath = "";
    if (req === null || req === void 0 ? void 0 : req.file) {
        // // 1. get the path to img
        localPath = yield (0, helper_1.sharpUpload)(req.file, ((_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.title) ? (_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.title : blog === null || blog === void 0 ? void 0 : blog.title);
        if (localPath != "") {
            (0, helper_1.deleteImage)(bannerOld);
        }
    }
    const imageUrl = localPath !== "" ? localPath : bannerOld;
    try {
        const blogUpdate = yield prisma_client_1.prisma.blog.update({
            data: Object.assign(Object.assign({}, req.body), { authorId: authorId, slug: slugTitle, image: imageUrl, content: req.body.content }),
            where: {
                id: id,
            },
        });
        res.json({
            message: `Updated blog successfully`,
            blog: blogUpdate,
        });
    }
    catch (error) {
        res.json(error);
    }
}));
//----------------------------------------------
// delete blog
//----------------------------------------------
exports.deleteController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // check validation
    const checkIfExist = yield prisma_client_1.prisma.blog.findFirst({
        where: {
            id: id,
        },
    });
    if (!checkIfExist)
        throw new Error(`Blog not found`);
    try {
        const deleteBlog = yield prisma_client_1.prisma.blog.delete({
            where: {
                id: id,
            },
        });
        if ((deleteBlog === null || deleteBlog === void 0 ? void 0 : deleteBlog.image) != "") {
            (0, helper_1.deleteImage)((deleteBlog === null || deleteBlog === void 0 ? void 0 : deleteBlog.image) || "");
        }
        res.json({
            message: `Deleted blog successfully`,
            blog: deleteBlog,
        });
    }
    catch (error) {
        res.json(error);
    }
}));
//# sourceMappingURL=index.js.map