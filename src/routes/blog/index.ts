import express from "express";
import {
  createCommentBlogController,
  createController,
  deleteCommentBlogController,
  deleteController,
  editController,
  fetchAllblogByCategorySlugController,
  fetchAllblogBySlugCategoryController,
  fetchAllblogByUserController,
  fetchAllblogController,
  fetchBlogBySlugController,
  likeBlogController,
  readController,
  updateController,
} from "../../controller/blog";
import { photoUpload } from "../../middleware/uploads";
import { validate } from "../../middleware/error";
import { CreateBlogSchema, UpdateBlogSchema } from "../../lib/form-schema";
import { authMiddleware } from "../../middleware/auth";

export const blogsRoutes = express.Router();
// create blog
blogsRoutes.post(
  "/",
  authMiddleware,
  photoUpload.single("image"),
  validate(CreateBlogSchema),
  createController
);

// get detail blog
blogsRoutes.get("/:id", editController);

// update blog
blogsRoutes.put(
  "/:id",
  authMiddleware,
  photoUpload.single("image"),
  validate(UpdateBlogSchema),
  updateController
);

// delete blog
blogsRoutes.post("/delete/multiple", authMiddleware, deleteController);

// delete blog
blogsRoutes.put("/read/:id", readController);

// fetch all blog by user id
blogsRoutes.get("/user/:id", fetchAllblogByUserController);

// fetch all blog by category slug
blogsRoutes.get(
  "/category/:categorySlug",
  fetchAllblogBySlugCategoryController
);

// fetch defail blog by slug
blogsRoutes.get("/detail/:slug", fetchBlogBySlugController);

// fetch defail all blog
blogsRoutes.get("/", fetchAllblogController);

// fetch defail all blog
blogsRoutes.post("/like", authMiddleware, likeBlogController);

// comment blog
blogsRoutes.post("/comment", authMiddleware, createCommentBlogController);

// delete comment blog
blogsRoutes.delete("/comment/:id", authMiddleware, deleteCommentBlogController);
