"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.menusRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../../src/middleware/auth");
const menu_1 = require("../../../src/controller/menu");
const error_1 = require("../../../src/middleware/error");
const form_schema_1 = require("../../../src/lib/form-schema");
exports.menusRoutes = express_1.default.Router();
// create role
exports.menusRoutes.post("/", auth_1.authMiddleware, (0, error_1.validate)(form_schema_1.createMenuSchema), menu_1.createController);
//# sourceMappingURL=index.js.map