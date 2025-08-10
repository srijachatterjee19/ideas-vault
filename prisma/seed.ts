import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Create sample ideas
  await prisma.idea.create({
    data: {
      title: "First idea",
      note: "Hello world",
      tags: ["demo", "local"]
    }
  });

  await prisma.idea.create({
    data: {
      title: "Second",
      note: "Try editing me",
      tags: ["edit"]
    }
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
