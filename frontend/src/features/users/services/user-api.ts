import { z } from "zod";
import { apiRequest } from "../../../services/api-client";
import {
  createUserSchema,
  updateUserSchema,
  userRoleSchema,
} from "../schemas/user.schema";
import type {
  ApiEnvelope,
  CreateUserInput,
  UpdateUserInput,
  User,
} from "../types/user.types";

const userSchema = z.object({
  id: z.uuid(),
  name: z.string().nullable().optional(),
  email: z.email(),
  isActive: z.boolean(),
  role: z.object({
    id: z.uuid(),
    name: userRoleSchema,
  }),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

const userListResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.array(userSchema),
  meta: z.unknown(),
});

const userResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: userSchema,
  meta: z.unknown(),
});

function parseResponse<T>(
  response: ApiEnvelope<unknown>,
  schema: z.ZodType<T>,
): T {
  const result = schema.safeParse(response);
  if (!result.success) {
    throw new Error("The user API returned an invalid response.");
  }
  return result.data;
}

export const userApi = {
  async list(): Promise<User[]> {
    const response = await apiRequest<ApiEnvelope<unknown>>("/users");
    return parseResponse(response, userListResponseSchema).data;
  },

  async get(id: string): Promise<User> {
    const response = await apiRequest<ApiEnvelope<unknown>>(
      `/users/${encodeURIComponent(id)}`,
    );
    return parseResponse(response, userResponseSchema).data;
  },

  async create(input: CreateUserInput): Promise<User> {
    const payload = createUserSchema.parse(input);
    const response = await apiRequest<ApiEnvelope<unknown>>("/users", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return parseResponse(response, userResponseSchema).data;
  },

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const payload = updateUserSchema.parse(input);
    const response = await apiRequest<ApiEnvelope<unknown>>(
      `/users/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );
    return parseResponse(response, userResponseSchema).data;
  },
};
