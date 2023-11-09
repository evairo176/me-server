"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.languagesRoutes = void 0;
const express_1 = __importDefault(require("express"));
const language_1 = require("../../../src/controller/language");
exports.languagesRoutes = express_1.default.Router();
// fetch defail all blog
exports.languagesRoutes.get("/", language_1.fetchAllLanguageController);
//# sourceMappingURL=index.js.map