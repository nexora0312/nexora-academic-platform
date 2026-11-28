import { z } from "zod";

export const USER_ROLES = [
  "SUPER_ADMIN",
  "ADMIN",
  "HOD",
  "LECTURER",
  "ACADEMIC_OFFICER",
  "STUDENT",
] as const;

export const userRoleSchema = z.enum(USER_ROLES);
export type UserRole = z.infer<typeof userRoleSchema>;

export const createUserSchema = z.object({
  email: z.email().max(255).transform((email) => email.toLowerCase()),
  password: z.string().min(12).max(128),
  roleName: userRoleSchema,
  isActive: z.boolean(),
});

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
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: "Provide at least one field to update.",
  });
