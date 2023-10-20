import express from "express";
import { validate } from "../../middleware/error";
import { LoginSchema, RegisterSchema } from "../../lib/form-schema";
import {
  detailUserController,
  userLoginController,
  userRegisterController,
} from "../../controller/user";
import { authMiddleware } from "../../middleware/auth";

export const usersRoutes = express.Router();

usersRoutes.post("/register", validate(RegisterSchema), userRegisterController);
usersRoutes.post("/login", validate(LoginSchema), userLoginController);
usersRoutes.get("/:id", authMiddleware, detailUserController);