import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { errorHandler, notFound } from "./middleware/error";
import { blogsRoutes } from "./routes/blog";
import { usersRoutes } from "./routes/user";
import { categoriesRoutes } from "./routes/category";
import { rolesRoutes } from "./routes/role";
import { languagesRoutes } from "./routes/language";
import { menusRoutes } from "./routes/menu";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN_URL,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
);
app.use(express.json());
app.use(morgan("tiny"));
// show image
app.use(express.static("public"));

// blogs routes
app.use("/api/blogs", blogsRoutes);

// users routes
app.use("/api/users", usersRoutes);

// categories routes
app.use("/api/category", categoriesRoutes);

// roles routes
app.use("/api/role", rolesRoutes);

// menus routes
app.use("/api/menu", menusRoutes);

// languages routes
app.use("/api/language", languagesRoutes);

// error handler
app.use(notFound);
app.use(errorHandler);

// server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Express server listening on port: " + port);
});
