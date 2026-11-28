import { Prisma } from "@prisma/client";
import { hashPassword } from "@/server/auth/password";
import { AppError } from "@/server/errors/app-error";
import { userRepository } from "@/server/repositories/user.repository";
import type {
  CreateUserInput,
  UpdateUserInput,
} from "@/server/validators/user.schema";

export type UserActor = { id: string; role: string };

export function assertCanManageRole(
  actorRole: string,
  targetRole: string,
): void {
  if (
    actorRole !== "SUPER_ADMIN" &&
    (targetRole === "SUPER_ADMIN" || targetRole === "ADMIN")
  ) {
    throw new AppError("Only a super administrator can manage administrator roles.", 403);
  }
}

function handleUniqueConstraint(error: unknown): never {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new AppError("A user with this email already exists.", 409);
  }
  throw error;
}

export const userService = {
  listUsers() {
    return userRepository.list();
  },

  async getUser(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    return user;
  },

  async createUser(input: CreateUserInput, actor: UserActor) {
    assertCanManageRole(actor.role, input.roleName);
    const role = await userRepository.findRoleByName(input.roleName);
    if (!role) {
      throw new AppError("The requested role has not been seeded.", 422);
    }

    try {
      const passwordHash = await hashPassword(input.password);
      return await userRepository.create(input, role.id, passwordHash);
    } catch (error) {
      handleUniqueConstraint(error);
    }
  },

  async updateUser(id: string, input: UpdateUserInput, actor: UserActor) {
    const existing = await this.getUser(id);
    assertCanManageRole(actor.role, existing.role.name);

    if (
      actor.id === id &&
      (input.isActive === false || input.roleName !== undefined)
    ) {
      throw new AppError("You cannot disable or change the role of your own account.", 403);
    }

    let roleId: string | undefined;
    if (input.roleName !== undefined) {
      assertCanManageRole(actor.role, input.roleName);
      const role = await userRepository.findRoleByName(input.roleName);
      if (!role) {
        throw new AppError("The requested role has not been seeded.", 422);
      }
      roleId = role.id;
    }

    try {
      return await userRepository.update(id, input, roleId);
    } catch (error) {
      handleUniqueConstraint(error);
    }
  },
};
