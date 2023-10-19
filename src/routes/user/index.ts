import express from "express";
import { createPostController } from "../../controller/blog";
import { photoUpload, postImgResize } from "../../middleware/uploads";
import { validate } from "../../middleware/error";
import { UserSchema } from "../../schema/blog";

export const blogsRoutes = express.Router();

blogsRoutes.post(
  "/",
  validate(UserSchema),
  photoUpload.single("image"),
  // mencoba
  postImgResize,
  createPostController
);
