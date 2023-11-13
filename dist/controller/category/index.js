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
exports.fetchCategoryBySlugController = exports.findAllController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_client_1 = require("../../lib/prisma-client");
//----------------------------------------------
// detail category
//----------------------------------------------
exports.findAllController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let category = [];
        if (req.query.lang !== "") {
            category = yield prisma_client_1.prisma.category.findMany({
                where: {
                    lang: req.query.lang,
                },
            });
        }
        else {
            category = yield prisma_client_1.prisma.category.findMany({});
        }
        res.json({
            message: "Get detail category successfully",
            category: category,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
//----------------------------------------------
// fetch category by slug
//----------------------------------------------
exports.fetchCategoryBySlugController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categorySlug } = req.params;
    let category = {};
    if (req.query.lang !== "") {
        category = yield prisma_client_1.prisma.category.findFirst({
            where: {
                slug: categorySlug,
                lang: req.query.lang,
            },
        });
    }
    else {
        category = yield prisma_client_1.prisma.category.findFirst({
            where: {
                slug: categorySlug,
            },
        });
    }
    if (!category)
        throw new Error(`Blog not found`);
    try {
        res.json({
            message: `Showed data detail blog successfully`,
            category: category,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
//# sourceMappingURL=index.js.map