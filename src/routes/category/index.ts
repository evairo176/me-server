import express from "express";
import {
  fetchCategoryBySlugController,
  findAllController,
} from "../../../src/controller/category";

export const categoriesRoutes = express.Router();

// fetch all category
categoriesRoutes.get("/", findAllController);

// fetch category by slug
categoriesRoutes.get("/:categorySlug", fetchCategoryBySlugController);
