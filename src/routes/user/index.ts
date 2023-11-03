import express from "express";
import { validate } from "../../middleware/error";
import { LoginSchema, RegisterSchema } from "../../lib/form-schema";
import {
  detailUserController,
  refreshTokenController,
  userLoginController,
  userRegisterController,
} from "../../controller/user";
import { authMiddleware } from "../../middleware/auth";

export const usersRoutes = express.Router();

// create user
usersRoutes.post("/register", validate(RegisterSchema), userRegisterController);

// login user
usersRoutes.post("/login", validate(LoginSchema), userLoginController);

// create refresh token
usersRoutes.post("/refresh", refreshTokenController);

// get detail user
usersRoutes.get("/:id", authMiddleware, detailUserController);
