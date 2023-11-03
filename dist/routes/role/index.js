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
// get all role
exports.rolesRoutes.get("/", auth_1.authMiddleware, role_1.fetchAllRoleController);
// get detail role
exports.rolesRoutes.get("/:id", auth_1.authMiddleware, role_1.getDetailRoleController);
// create role
exports.rolesRoutes.post("/", auth_1.authMiddleware, role_1.createController);
// update role
exports.rolesRoutes.put("/:id", auth_1.authMiddleware, role_1.updateRoleController);
// delete role
exports.rolesRoutes.post("/delete/multiple", auth_1.authMiddleware, role_1.deleteController);
//# sourceMappingURL=index.js.map