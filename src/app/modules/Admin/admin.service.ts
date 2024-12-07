import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

const getSingleAdminFromDB = async (email: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      email,
      isDeleted: false,
    },
  });

  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Admin not found");
  }

  return result;
};

export const AdminServices = {
  getSingleAdminFromDB,
};
