import { z } from "zod";

export const loginSchema = z
  .object({
    email: z.email().max(255).transform((email) => email.toLowerCase()),
    password: z.string().min(1).max(128),
  })
  .strict();

export const sessionIdSchema = z.uuid();

export type LoginInput = z.infer<typeof loginSchema>;
