"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const blog_1 = require("../../controller/blog");
const uploads_1 = require("../../middleware/uploads");
const error_1 = require("../../middleware/error");
const form_schema_1 = require("../../lib/form-schema");
const auth_1 = require("../../middleware/auth");
exports.blogsRoutes = express_1.default.Router();
// create blog
exports.blogsRoutes.post("/", auth_1.authMiddleware, uploads_1.photoUpload.single("image"), (0, error_1.validate)(form_schema_1.CreateBlogSchema), blog_1.createController);
// get detail blog
exports.blogsRoutes.get("/:id", blog_1.editController);
// update blog
exports.blogsRoutes.put("/:id", auth_1.authMiddleware, uploads_1.photoUpload.single("image"), (0, error_1.validate)(form_schema_1.UpdateBlogSchema), blog_1.updateController);
// delete blog
exports.blogsRoutes.post("/delete/multiple", auth_1.authMiddleware, blog_1.deleteController);
// delete blog
exports.blogsRoutes.put("/read/:id", blog_1.readController);
// fetch all blog by user id
exports.blogsRoutes.get("/user/:id", blog_1.fetchAllblogByUserController);
// fetch all blog by category slug
exports.blogsRoutes.get("/category/:categorySlug", blog_1.fetchAllblogBySlugCategoryController);
// fetch defail blog by slug
exports.blogsRoutes.get("/detail/:slug", blog_1.fetchBlogBySlugController);
// fetch defail all blog
exports.blogsRoutes.get("/", blog_1.fetchAllblogController);
// fetch defail all blog
exports.blogsRoutes.post("/like", auth_1.authMiddleware, blog_1.likeBlogController);
// comment blog
exports.blogsRoutes.post("/comment", auth_1.authMiddleware, blog_1.createCommentBlogController);
// delete comment blog
exports.blogsRoutes.delete("/comment/:id", auth_1.authMiddleware, blog_1.deleteCommentBlogController);
//# sourceMappingURL=index.js.map