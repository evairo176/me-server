"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoriesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const category_1 = require("../../../src/controller/category");
exports.categoriesRoutes = express_1.default.Router();
// fetch all category
exports.categoriesRoutes.get("/", category_1.findAllController);
// fetch category by slug
exports.categoriesRoutes.get("/:categorySlug", category_1.fetchCategoryBySlugController);
//# sourceMappingURL=index.js.map