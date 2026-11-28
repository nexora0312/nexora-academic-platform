import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  CreateUserInput,
  UpdateUserInput,
} from "@/server/validators/user.schema";

const userSelect = {
  id: true,
  email: true,
  isActive: true,
  role: {
    select: {
      id: true,
      name: true,
    },
  },
  studentProfile: {
    select: {
      displayName: true,
    },
  },
  lecturerProfile: {
    select: {
      displayName: true,
    },
  },
  createdAt: true,
  updatedAt: true,
} as const satisfies Prisma.UserSelect;

const authenticationUserSelect = {
  id: true,
  email: true,
  passwordHash: true,
  isActive: true,
  role: {
    select: {
      name: true,
    },
  },
  studentProfile: {
    select: {
      displayName: true,
    },
  },
  lecturerProfile: {
    select: {
      displayName: true,
    },
  },
} as const satisfies Prisma.UserSelect;

export type UserRecord = Prisma.UserGetPayload<{ select: typeof userSelect }>;
export type AuthenticationUserRecord = Prisma.UserGetPayload<{
  select: typeof authenticationUserSelect;
}>;

function toPublicUser(user: UserRecord) {
  const { studentProfile, lecturerProfile, ...publicUser } = user;
  return {
    ...publicUser,
    name: studentProfile?.displayName ?? lecturerProfile?.displayName ?? null,
  };
}

export const userRepository = {
  findUserForAuthentication(email: string): Promise<AuthenticationUserRecord | null> {
    return prisma.user.findUnique({
      where: { email },
      select: authenticationUserSelect,
    });
  },

  async list() {
    const users = await prisma.user.findMany({
      select: userSelect,
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return users.map(toPublicUser);
  },

  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: userSelect,
    });
    return user ? toPublicUser(user) : null;
  },

  findRoleByName(name: string) {
    return prisma.role.findUnique({
      where: { name },
      select: { id: true, name: true },
    });
  },

  async findSessionActor(sessionId: string, now = new Date()) {
    const session = await prisma.session.findFirst({
      where: {
        id: sessionId,
        expiresAt: { gt: now },
        user: { isActive: true },
      },
      select: {
        userId: true,
        user: { select: { role: { select: { name: true } } } },
      },
    });

    return session
      ? { id: session.userId, role: session.user.role.name }
      : null;
  },

  createSession(userId: string, expiresAt: Date) {
    return prisma.session.create({
      data: { userId, expiresAt },
      select: { id: true, expiresAt: true },
    });
  },

  deleteSession(sessionId: string) {
    return prisma.session.deleteMany({ where: { id: sessionId } });
  },

  async create(input: CreateUserInput, roleId: string, passwordHash: string) {
    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        roleId,
        isActive: input.isActive,
      },
      select: userSelect,
    });
    return toPublicUser(user);
  },

  async update(id: string, input: UpdateUserInput, roleId?: string) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...(input.email === undefined ? {} : { email: input.email }),
        ...(input.isActive === undefined ? {} : { isActive: input.isActive }),
        ...(roleId === undefined ? {} : { roleId }),
      },
      select: userSelect,
    });
    return toPublicUser(user);
  },
};
