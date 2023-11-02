"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rolesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../src/middleware/auth");
const role_1 = require("../../../src/controller/role");
exports.rolesRoutes = express_1.default.Router();
exports.rolesRoutes.get("/", auth_1.authMiddleware, role_1.fetchAllRoleController);
exports.rolesRoutes.post("/", auth_1.authMiddleware, role_1.createController);
exports.rolesRoutes.post("/delete/multiple", auth_1.authMiddleware, role_1.deleteController);
//# sourceMappingURL=index.js.map