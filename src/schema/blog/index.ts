import { z } from "zod";
export const UserSchema = z.object({
  title: z
    .string({
      required_error: "Name is required",
    })
    .trim()
    .min(1, "Name cannot be empty"),
  slug: z
    .string({
      required_error: "Name is required",
    })
    .trim()
    .min(1, "Name cannot be empty"),
  email: z
    .string({
      required_error: "Email is required",
    })
    .trim()
    .min(1, "Email cannot be empty")
    .email("Invalid email"),
  banner: z.any(),
});

export type CreateUserDto = z.infer<typeof UserSchema>;
