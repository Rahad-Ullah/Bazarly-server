import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { Admin, Prisma, UserStatus } from "@prisma/client";
import { IPaginationOptions } from "../../interface/pagination";
import { IAdminFilterRequest } from "./admin.interface";
import { calculatePagination } from "../../utils/pagination";
import { adminSearchableFields } from "./admin.constant";

// **********--- get all admins ---**********
const getAllAdminsFromDB = async (
  params: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  // format params and options information
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const conditions: Prisma.AdminWhereInput[] = [];

  // filter if search term specified
  if (searchTerm) {
    conditions.push({
      OR: adminSearchableFields.map((value) => ({
        [value]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  // filter if filter data specified
  if (Object.keys(filterData).length > 0) {
    conditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  // filter non deleted items
  conditions.push({
    isDeleted: false,
  });

  // execute query
  const result = await prisma.admin.findMany({
    where: { AND: conditions } as Prisma.AdminWhereInput,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  // count total
  const total = await prisma.admin.count({
    where: { AND: conditions } as Prisma.AdminWhereInput,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// **********--- get single admin ---**********
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

// **********--- update admin ---**********
const updateAdminIntoDB = async (id: string, payload: Partial<Admin>) => {
  // check if the admin is exist
  const userData = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!userData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Admin does not exist");
  }

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

// **********--- delete admin ---**********
const deleteAdminFromDB = async (id: string) => {
  // check if the admin is exist
  const userData = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!userData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Admin does not exist");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    // delete from admin table
    const adminDeletedData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    // delete from user table
    await transactionClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });

    return adminDeletedData;
  });

  return result;
};

// **********--- soft delete admin ---**********
const softDeleteAdminFromDB = async (id: string) => {
  // check if the admin is exist
  const userData = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!userData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Admin does not exist");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    // delete from admin table
    const adminDeletedData = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    // delete from user table
    await transactionClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return adminDeletedData;
  });

  return result;
};

export const AdminServices = {
  getSingleAdminFromDB,
  getAllAdminsFromDB,
  updateAdminIntoDB,
  deleteAdminFromDB,
  softDeleteAdminFromDB,
};
