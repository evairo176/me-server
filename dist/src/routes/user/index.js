"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
var express_1 = __importDefault(require("express"));
var error_1 = require("../../middleware/error");
var form_schema_1 = require("../../lib/form-schema");
var user_1 = require("../../controller/user");
var auth_1 = require("../../middleware/auth");
exports.usersRoutes = express_1.default.Router();
exports.usersRoutes.post("/register", (0, error_1.validate)(form_schema_1.RegisterSchema), user_1.userRegisterController);
exports.usersRoutes.post("/login", (0, error_1.validate)(form_schema_1.LoginSchema), user_1.userLoginController);
exports.usersRoutes.get("/:id", auth_1.authMiddleware, user_1.detailUserController);
//# sourceMappingURL=index.js.map