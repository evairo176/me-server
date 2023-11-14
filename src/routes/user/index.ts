import express from "express";
import { validate } from "../../middleware/error";
import {
  LoginProviderSchema,
  LoginSchema,
  RegisterProviderSchema,
  RegisterSchema,
} from "../../lib/form-schema";
import {
  detailUserController,
  fetchUserByEmailController,
  refreshTokenController,
  userLoginController,
  userLoginProviderController,
  userRegisterController,
  userRegisterProviderController,
} from "../../controller/user";
import { authMiddleware } from "../../middleware/auth";

export const usersRoutes = express.Router();

// create user
usersRoutes.post("/register", validate(RegisterSchema), userRegisterController);

// create user with provider
usersRoutes.post(
  "/register/provider",
  validate(RegisterProviderSchema),
  userRegisterProviderController
);

// login user
usersRoutes.post("/login", validate(LoginSchema), userLoginController);

// login user
usersRoutes.post(
  "/login/provider",
  validate(LoginProviderSchema),
  userLoginProviderController
);

// create refresh token
usersRoutes.post("/refresh", refreshTokenController);

// get detail user
usersRoutes.get("/:id", authMiddleware, detailUserController);

// get detail user
usersRoutes.post("/auth/usercheck", fetchUserByEmailController);
