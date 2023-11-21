import { z } from "zod";

export const CreateBlogSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, { message: "Title must be at least 3 characters" }),
  content: z
    .string({ required_error: "Content is required" })
    .min(1, { message: "Content must be at least 1 characters" }),
  banner: z.any(),
});

export const UpdateBlogSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, { message: "Title must be at least 3 characters" }),
  content: z
    .string({ required_error: "Content is required" })
    .min(1, { message: "Content must be at least 1 characters" }),
  banner: z.any(),
});

export const RegisterSchema = z.object({
  name: z
    .string({ required_error: "Title is required" })
    .min(3, { message: "Title must be at least 3 characters" }),
  email: z.string({ required_error: "Email is required" }).email(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "password must be at least 6 characters" }),
});

export const RegisterProviderSchema = z.object({
  name: z
    .string({ required_error: "Title is required" })
    .min(3, { message: "Title must be at least 3 characters" }),
  email: z.string({ required_error: "Email is required" }).email(),
});

export const LoginSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, { message: "password must be at least 6 characters" }),
});

export const LoginProviderSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
});

export const createMenuSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters" }),
  url: z
    .string({ required_error: "Name is required" })
    .min(3, { message: "Name must be at least 3 characters" }),
  status: z.boolean().default(false),
  // roles: z.string().array().optional(),
});
