import { z } from "zod";
import { ROLES } from "@/lib/constants";

export const userRoleSchema = z.enum(ROLES);

export const createUserSchema = z
  .object({
    email: z.email().max(255).transform((email) => email.toLowerCase()),
    password: z.string().min(12).max(128),
    roleName: userRoleSchema,
    isActive: z.boolean().default(true),
  })
  .strict();

export const updateUserSchema = z
  .object({
    email: z
      .email()
      .max(255)
      .transform((email) => email.toLowerCase())
      .optional(),
    roleName: userRoleSchema.optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: "Provide at least one field to update.",
  });

export const userIdSchema = z.uuid();

export type UserRole = z.infer<typeof userRoleSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
