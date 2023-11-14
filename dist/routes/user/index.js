"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const express_1 = __importDefault(require("express"));
const error_1 = require("../../middleware/error");
const form_schema_1 = require("../../lib/form-schema");
const user_1 = require("../../controller/user");
const auth_1 = require("../../middleware/auth");
exports.usersRoutes = express_1.default.Router();
// create user
exports.usersRoutes.post("/register", (0, error_1.validate)(form_schema_1.RegisterSchema), user_1.userRegisterController);
// create user with provider
exports.usersRoutes.post("/register/provider", (0, error_1.validate)(form_schema_1.RegisterProviderSchema), user_1.userRegisterProviderController);
// login user
exports.usersRoutes.post("/login", (0, error_1.validate)(form_schema_1.LoginSchema), user_1.userLoginController);
// login user
exports.usersRoutes.post("/login/provider", (0, error_1.validate)(form_schema_1.LoginProviderSchema), user_1.userLoginProviderController);
// create refresh token
exports.usersRoutes.post("/refresh", user_1.refreshTokenController);
// get detail user
exports.usersRoutes.get("/:id", auth_1.authMiddleware, user_1.detailUserController);
// get detail user
exports.usersRoutes.post("/auth/usercheck", user_1.fetchUserByEmailController);
//# sourceMappingURL=index.js.map