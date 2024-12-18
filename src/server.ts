import { Server } from "http";
import app from "./app";
import config from "./config";
import { UserServices } from "./app/modules/User/user.service";
import { UserRole } from "@prisma/client";
import prisma from "./app/shared/prisma";

async function main() {
  const server: Server = app.listen(config.port, () => {
    console.log(`Server is listening on port ${config.port}`);
  });

  // seed the super admin
  try {
    await UserServices.createAdminIntoDB({
      password: config.super_admin.password as string,
      data: {
        name: config.super_admin.name as string,
        email: config.super_admin.email as string,
        phoneNumber: config.super_admin.phone as string,
      },
      role: UserRole.SUPER_ADMIN,
    });

    console.log("Seeded Super Admin");
  } catch (error) {
    console.error("Error seeding Super Admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
