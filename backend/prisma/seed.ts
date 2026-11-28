import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      { name: "SUPER_ADMIN" },
      { name: "ADMIN" },
      { name: "HOD" },
      { name: "LECTURER" },
      { name: "ACADEMIC_OFFICER" },
      { name: "STUDENT" },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
