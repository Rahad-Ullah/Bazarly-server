import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { Prisma, UserStatus, Vendor } from "@prisma/client";
import { IPaginationOptions } from "../../interface/pagination";
import { calculatePagination } from "../../utils/pagination";
import { IVendorFilterRequest } from "./vendor.interface";
import { vendorSearchableFields } from "./vendor.constant";

// **********--- get all vendors ---**********
const getAllVendorsFromDB = async (
  params: IVendorFilterRequest,
  options: IPaginationOptions
) => {
  // format params and options information
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const conditions: Prisma.VendorWhereInput[] = [];

  // filter if search term specified
  if (searchTerm) {
    conditions.push({
      OR: vendorSearchableFields.map((value) => ({
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
  const result = await prisma.vendor.findMany({
    where: { AND: conditions } as Prisma.VendorWhereInput,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      user: true,
    },
  });

  // count total
  const total = await prisma.vendor.count({
    where: { AND: conditions } as Prisma.VendorWhereInput,
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

// **********--- get single vendor ---**********
const getSingleVendorFromDB = async (email: string) => {
  const result = await prisma.vendor.findUnique({
    where: {
      email,
      isDeleted: false,
    },
  });

  return result;
};

// **********--- update vendor ---**********
const updateVendorIntoDB = async (id: string, payload: Partial<Vendor>) => {
  // check if the user is exist
  const userData = await prisma.vendor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!userData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Vendor does not exist");
  }

  const result = await prisma.vendor.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

// **********--- delete vendor ---**********
const deleteVendorFromDB = async (id: string) => {
  // check if the user is exist
  const userData = await prisma.vendor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!userData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Vendor does not exist");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    // delete from vendor table
    const vendorDeletedData = await transactionClient.vendor.delete({
      where: {
        id,
      },
    });

    // delete from user table
    await transactionClient.user.delete({
      where: {
        email: vendorDeletedData.email,
      },
    });

    return vendorDeletedData;
  });

  return result;
};

// **********--- soft delete vendor ---**********
const softDeleteVendorFromDB = async (id: string) => {
  // check if the user is exist
  const userData = await prisma.vendor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!userData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Vendor does not exist");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    // delete from vendor table
    const vendorDeletedData = await transactionClient.vendor.update({
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
        email: vendorDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return vendorDeletedData;
  });

  return result;
};

export const VendorServices = {
  getAllVendorsFromDB,
  getSingleVendorFromDB,
  updateVendorIntoDB,
  deleteVendorFromDB,
  softDeleteVendorFromDB,
};
