"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRoutes = void 0;
var express_1 = __importDefault(require("express"));
var blog_1 = require("../../controller/blog");
var uploads_1 = require("../../middleware/uploads");
var error_1 = require("../../middleware/error");
var form_schema_1 = require("../../lib/form-schema");
var auth_1 = require("../../middleware/auth");
exports.blogsRoutes = express_1.default.Router();
exports.blogsRoutes.post("/", auth_1.authMiddleware, uploads_1.photoUpload.single("image"), (0, error_1.validate)(form_schema_1.CreateBlogSchema), blog_1.createController);
exports.blogsRoutes.get("/:id", auth_1.authMiddleware, blog_1.editController);
exports.blogsRoutes.put("/:id", auth_1.authMiddleware, uploads_1.photoUpload.single("image"), blog_1.updateController);
exports.blogsRoutes.delete("/:id", auth_1.authMiddleware, blog_1.deleteController);
//# sourceMappingURL=index.js.map