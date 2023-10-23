"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const error_1 = require("./middleware/error");
const blog_1 = require("./routes/blog");
const user_1 = require("./routes/user");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, morgan_1.default)("tiny"));
// show image
app.use(express_1.default.static("public"));
// blogs routes
app.use("/api/blogs", blog_1.blogsRoutes);
// users routes
app.use("/api/users", user_1.usersRoutes);
// error handler
app.use(error_1.notFound);
app.use(error_1.errorHandler);
// server
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("Express server listening on port: " + port);
});
//# sourceMappingURL=index.js.map