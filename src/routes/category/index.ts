import express from "express";
import {
  fetchCategoryBySlugController,
  AllCtegoryController,
} from "../../../src/controller/category";

export const categoriesRoutes = express.Router();

// fetch all category
categoriesRoutes.get("/", AllCtegoryController);

// fetch category by slug
categoriesRoutes.get("/:categorySlug", fetchCategoryBySlugController);
