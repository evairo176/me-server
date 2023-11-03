import express from "express";
import { authMiddleware } from "../../../src/middleware/auth";
import {
  createController,
  deleteController,
  fetchAllRoleController,
  getDetailRoleController,
  updateRoleController,
} from "../../../src/controller/role";

export const rolesRoutes = express.Router();

rolesRoutes.get("/", authMiddleware, fetchAllRoleController);
rolesRoutes.get("/:id", authMiddleware, getDetailRoleController);
rolesRoutes.post("/", authMiddleware, createController);
rolesRoutes.put("/:id", authMiddleware, updateRoleController);
rolesRoutes.post("/delete/multiple", authMiddleware, deleteController);
