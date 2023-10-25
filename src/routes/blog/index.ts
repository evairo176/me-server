import express from "express";
import {
  createController,
  deleteController,
  editController,
  updateController,
} from "../../controller/blog";
import { photoUpload } from "../../middleware/uploads";
import { validate } from "../../middleware/error";
import { CreateBlogSchema } from "../../lib/form-schema";
import { authMiddleware } from "../../middleware/auth";

export const blogsRoutes = express.Router();

blogsRoutes.post(
  "/",
  authMiddleware,
  photoUpload.single("image"),
  validate(CreateBlogSchema),
  createController
);
blogsRoutes.get("/:id", authMiddleware, editController);
blogsRoutes.put(
  "/:id",
  authMiddleware,
  photoUpload.single("image"),
  updateController
);
blogsRoutes.delete("/:id", authMiddleware, deleteController);
