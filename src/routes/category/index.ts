import express from "express";
import { findAllController } from "../../../src/controller/category";

export const categoriesRoutes = express.Router();

categoriesRoutes.get("/", findAllController);
