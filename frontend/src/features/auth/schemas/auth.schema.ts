import { z } from "zod";
import { userRoleSchema } from "@/features/users/schemas/user.schema";

export const loginSchema = z.object({
  email: z.email().max(255).transform((email) => email.toLowerCase()),
  password: z.string().min(1).max(128),
});

export const authUserSchema = z.object({
  id: z.uuid(),
  email: z.email(),
  name: z.string().nullable().optional(),
  role: userRoleSchema,
});

export const authUserResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: authUserSchema,
  meta: z.unknown(),
});

export const logoutResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({ loggedOut: z.literal(true) }),
  meta: z.unknown(),
});

export type LoginInput = z.infer<typeof loginSchema>;
