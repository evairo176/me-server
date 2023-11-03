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
// get all role
rolesRoutes.get("/", authMiddleware, fetchAllRoleController);

// get detail role
rolesRoutes.get("/:id", authMiddleware, getDetailRoleController);

// create role
rolesRoutes.post("/", authMiddleware, createController);

// update role
rolesRoutes.put("/:id", authMiddleware, updateRoleController);

// delete role
rolesRoutes.post("/delete/multiple", authMiddleware, deleteController);
