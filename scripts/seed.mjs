import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  console.log("Connecting to database...");
  await prisma.$connect();
  console.log("Connected.");

  const adminEmail = "admin@souqlink.com";
  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log(`Admin user already exists: ${adminEmail}`);
  } else {
    const hashed = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        name: "Admin",
        email: adminEmail,
        password: hashed,
        role: "admin",
      },
    });
    console.log(`Admin user created: ${adminEmail} / admin123`);
  }

  await prisma.$disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
