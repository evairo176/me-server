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
exports.createController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_client_1 = require("../../../src/lib/prisma-client");
const helper_1 = require("../../../src/helper/helper");
//----------------------------------------------
// create blog
//----------------------------------------------
exports.createController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const checkIfExist = yield prisma_client_1.prisma.menu.findFirst({
        where: {
            name: req.body.name,
        },
    });
    if (checkIfExist) {
        throw new Error(`Sorry you menu already exist`);
    }
    try {
        const menu = yield prisma_client_1.prisma.menu.create({
            data: Object.assign(Object.assign({}, req.body), { name: req.body.name, url: req.body.url, status: req.body.status ? req.body.status : false }),
        });
        res.json({
            message: `Menu was created successfully`,
            menu: menu,
        });
    }
    catch (error) {
        (0, helper_1.responseError)(error, res);
    }
}));
//# sourceMappingURL=index.js.map