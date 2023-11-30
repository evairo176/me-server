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
exports.deleteController = exports.fetchAllRoleController = exports.updateRoleController = exports.getDetailRoleController = exports.createController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma_client_1 = require("../../../src/lib/prisma-client");
const helper_1 = require("../../../src/helper/helper");
//----------------------------------------------
// create role
//----------------------------------------------
exports.createController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const checkIfExist = yield prisma_client_1.prisma.role.findFirst({
        where: {
            name: req.body.name,
        },
    });
    if (checkIfExist) {
        throw new Error(`Sorry you role already exist`);
    }
    try {
        const role = yield prisma_client_1.prisma.role.create({
            data: Object.assign({}, req.body),
        });
        res.json({
            message: `Role was created successfully`,
            role: role,
        });
    }
    catch (error) {
        (0, helper_1.responseError)(error, res);
    }
}));
//----------------------------------------------
// get detail role
//----------------------------------------------
exports.getDetailRoleController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const checkIfExist = yield prisma_client_1.prisma.role.findFirst({
        where: {
            id: id,
        },
    });
    if (!checkIfExist) {
        throw new Error("Sorry your data not found");
    }
    try {
        res.json({
            message: "Get detail data successfully",
            role: checkIfExist,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
//----------------------------------------------
// update role
//----------------------------------------------
exports.updateRoleController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const checkIfExist = yield prisma_client_1.prisma.role.findFirst({
        where: {
            id: id,
        },
    });
    if (!checkIfExist)
        throw new Error("Sorry your data not found");
    try {
        const roleUpdate = yield prisma_client_1.prisma.role.update({
            where: {
                id: id,
            },
            data: Object.assign({}, req.body),
        });
        res.json({
            message: "Updated role data successfully",
            role: roleUpdate,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
//----------------------------------------------
// fetch all role
//----------------------------------------------
exports.fetchAllRoleController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const role = yield prisma_client_1.prisma.role.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });
    if (!role)
        throw new Error(`Blog not found`);
    try {
        res.json({
            message: `Showed data detail blog successfully`,
            role: role,
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
//----------------------------------------------
// delete role
//----------------------------------------------
exports.deleteController = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ids = req.body.idArray;
    // check validation
    const checkIfExist = yield prisma_client_1.prisma.role.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
    if (checkIfExist.length < 1)
        throw new Error(`Role not found`);
    try {
        const deleteRole = yield prisma_client_1.prisma.role.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
        if (deleteRole.count === 0) {
            res.status(400).json({
                message: `data not found`,
                role: deleteRole,
            });
        }
        else {
            res.json({
                message: `Deleted Role successfully`,
                role: checkIfExist,
            });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
//# sourceMappingURL=index.js.map