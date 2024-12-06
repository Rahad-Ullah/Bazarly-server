import { UserRole, UserStatus } from "@prisma/client";

export type TAuthUser = {
  email: string;
  role: UserRole;
  status: UserStatus;
} | null;
