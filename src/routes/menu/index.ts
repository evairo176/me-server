import express from "express";
import { authMiddleware } from "../../../src/middleware/auth";
import { createController } from "../../../src/controller/menu";
import { validate } from "../../../src/middleware/error";
import { createMenuSchema } from "../../../src/lib/form-schema";

export const menusRoutes = express.Router();

// create role
menusRoutes.post(
  "/",
  authMiddleware,
  validate(createMenuSchema),
  createController
);
