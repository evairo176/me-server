import express from "express";
import {
  createController,
  deleteController,
  editController,
  fetchAllblogByCategorySlugController,
  fetchAllblogByUserController,
  fetchAllblogController,
  fetchBlogBySlugController,
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

// fetch all blog by user id
blogsRoutes.get("/user/:id", fetchAllblogByUserController);

// fetch all blog by category slug
blogsRoutes.get(
  "/category/:categorySlug",
  fetchAllblogByCategorySlugController
);

// fetch defail blog by slug
blogsRoutes.get("/detail/:slug", fetchBlogBySlugController);

// fetch defail all blog
blogsRoutes.get("/", fetchAllblogController);
