import express from "express";
import { fetchAllLanguageController } from "../../../src/controller/language";

export const languagesRoutes = express.Router();

// fetch defail all blog
languagesRoutes.get("/", fetchAllLanguageController);
