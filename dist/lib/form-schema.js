"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginSchema = exports.RegisterSchema = exports.UpdateBlogSchema = exports.CreateBlogSchema = void 0;
const zod_1 = require("zod");
exports.CreateBlogSchema = zod_1.z.object({
    title: zod_1.z
        .string({ required_error: "Title is required" })
        .min(3, { message: "Title must be at least 3 characters" }),
    content: zod_1.z
        .string({ required_error: "Content is required" })
        .min(1, { message: "Content must be at least 1 characters" }),
    banner: zod_1.z.any(),
});
exports.UpdateBlogSchema = zod_1.z.object({
    title: zod_1.z
        .string({ required_error: "Title is required" })
        .min(3, { message: "Title must be at least 3 characters" }),
    content: zod_1.z
        .string({ required_error: "Content is required" })
        .min(1, { message: "Content must be at least 1 characters" }),
    banner: zod_1.z.any(),
});
exports.RegisterSchema = zod_1.z.object({
    fullname: zod_1.z
        .string({ required_error: "Title is required" })
        .min(3, { message: "Title must be at least 3 characters" }),
    email: zod_1.z.string({ required_error: "Email is required" }).email(),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(6, { message: "password must be at least 6 characters" }),
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string({ required_error: "Email is required" }).email(),
    password: zod_1.z
        .string({ required_error: "Password is required" })
        .min(6, { message: "password must be at least 6 characters" }),
});
//# sourceMappingURL=form-schema.js.map