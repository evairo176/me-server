import express from "express";
import {
  createController,
  editController,
  updateController,
} from "../../controller/blog";
import { photoUpload, postImgResize } from "../../middleware/uploads";
import { validate } from "../../middleware/error";
import { CreateBlogSchema } from "../../lib/form-schema";
import { authMiddleware } from "../../middleware/auth";

export const blogsRoutes = express.Router();

blogsRoutes.post(
  "/",
  authMiddleware,
  photoUpload.single("image"),
  postImgResize,
  validate(CreateBlogSchema),
  createController
);
blogsRoutes.get("/:id", authMiddleware, editController);
blogsRoutes.put(
  "/:id",
  authMiddleware,
  photoUpload.single("image"),
  postImgResize,
  updateController
);
