import type { z } from "zod";
import type { authUserSchema } from "../schemas/auth.schema";

export type AuthUser = z.infer<typeof authUserSchema>;
