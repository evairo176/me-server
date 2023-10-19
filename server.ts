import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { blogsRoutes } from "./src/routes/user";
import { errorHandler, notFound } from "./src/middleware/error";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// post routes
app.use("/api/blogs", blogsRoutes);

// error handler
app.use(notFound);
app.use(errorHandler);

// server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("Express server listening on port: " + port);
});
