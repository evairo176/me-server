import express from "express";
import { authMiddleware } from "../../../src/middleware/auth";
import {
  createController,
  deleteController,
  fetchAllRoleController,
} from "../../../src/controller/role";

export const rolesRoutes = express.Router();

rolesRoutes.get("/", authMiddleware, fetchAllRoleController);
rolesRoutes.post("/", authMiddleware, createController);
rolesRoutes.post("/delete/multiple", authMiddleware, deleteController);
