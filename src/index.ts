import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { errorHandler, notFound } from "./middleware/error";
import { blogsRoutes } from "./routes/blog";
import { usersRoutes } from "./routes/user";
import { categoriesRoutes } from "./routes/category";

dotenv.config();

const app = express();
app.use(cookieParser());
app.use(cors());
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

// error handler
app.use(notFound);
app.use(errorHandler);

// server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Express server listening on port: " + port);
});
