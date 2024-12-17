import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { Admin, Customer, Prisma, UserStatus } from "@prisma/client";
import { IPaginationOptions } from "../../interface/pagination";
import { calculatePagination } from "../../utils/pagination";
import { ICustomerFilterRequest } from "./customer.interface";
import { customerSearchableFields } from "./customer.constant";

// **********--- get all customers ---**********
const getAllCustomersFromDB = async (
  params: ICustomerFilterRequest,
  options: IPaginationOptions
) => {
  // format params and options information
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const conditions: Prisma.CustomerWhereInput[] = [];

  // filter if search term specified
  if (searchTerm) {
    conditions.push({
      OR: customerSearchableFields.map((value) => ({
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
  const result = await prisma.customer.findMany({
    where: { AND: conditions } as Prisma.CustomerWhereInput,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          status: true,
          role: true,
        },
      },
    },
  });

  // count total
  const total = await prisma.customer.count({
    where: { AND: conditions } as Prisma.CustomerWhereInput,
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

// **********--- get single customer ---**********
const getSingleCustomerFromDB = async (email: string) => {
  const result = await prisma.customer.findUnique({
    where: {
      email,
      isDeleted: false,
    },
  });

  return result;
};

// **********--- update customer ---**********
const updateCustomerIntoDB = async (id: string, payload: Partial<Customer>) => {
  // check if the customer is exist
  const userData = await prisma.customer.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!userData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Customer does not exist");
  }

  const result = await prisma.customer.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

// **********--- delete customer ---**********
const deleteCustomerFromDB = async (id: string) => {
  // check if the user is exist
  const userData = await prisma.customer.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!userData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Customer does not exist");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    // delete from customer table
    const customerDeletedData = await transactionClient.customer.delete({
      where: {
        id,
      },
    });

    // delete from user table
    await transactionClient.user.delete({
      where: {
        email: customerDeletedData.email,
      },
    });

    return customerDeletedData;
  });

  return result;
};

// **********--- soft delete customer ---**********
const softDeleteCustomerFromDB = async (id: string) => {
  // check if the customer is exist
  const userData = await prisma.customer.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!userData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Customer does not exist");
  }

  const result = await prisma.$transaction(async (transactionClient) => {
    // delete from customer table
    const customerDeletedData = await transactionClient.customer.update({
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
        email: customerDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return customerDeletedData;
  });

  return result;
};

export const CustomerServices = {
  getAllCustomersFromDB,
  getSingleCustomerFromDB,
  updateCustomerIntoDB,
  deleteCustomerFromDB,
  softDeleteCustomerFromDB,
};
