import { Order, OrderPaymentStatus, OrderStatus, Prisma } from "@prisma/client";
import { TAuthUser } from "../../interface/common";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { IOrderFilterRequest } from "./order.interface";
import { IPaginationOptions } from "../../interface/pagination";
import { calculatePagination } from "../../utils/pagination";
import { orderSearchableFields } from "./order.constant";

// ********--- create order ---********
const createOrderIntoDB = async (user: TAuthUser, payload: Order) => {
  // check if user is valid
  const customerData = await prisma.customer.findFirstOrThrow({
    where: {
      user: {
        email: user?.email,
      },
    },
  });

  // check if shop is valid
  const shopData = await prisma.shop.findUnique({
    where: {
      id: payload.shopId,
    },
  });
  if (!shopData) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Shop does not exist");
  }

  // set shopId to order data
  payload.customerId = customerData.id;

  const result = await prisma.order.create({
    data: payload,
  });

  return result;
};

// ********--- change order status ---********
const changeOrderStatusIntoDB = async (
  id: string,
  payload: { status: OrderStatus }
) => {
  // check if the order is valid
  const orderData = await prisma.order.findUnique({
    where: {
      id,
    },
  });
  if (!orderData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Order does not exist");
  }

  const result = await prisma.order.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

// ********--- change payment status ---********
const changePaymentStatusIntoDB = async (
  id: string,
  payload: { paymentStatus: OrderPaymentStatus }
) => {
  // check if the order is valid
  const orderData = await prisma.order.findUnique({
    where: {
      id,
    },
  });
  if (!orderData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Order does not exist");
  }

  const result = await prisma.order.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

// ********--- get single order ---********
const getSingleOrderFromDB = async (id: string) => {
  const result = await prisma.order.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// ********--- get my orders ---********
const getMyOrdersFromDB = async (
  user: TAuthUser,
  options: IPaginationOptions
) => {
  // format params and options information
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

  const conditions: Prisma.OrderWhereInput[] = [];

  conditions.push({
    customer: {
      email: user?.email,
    },
  });

  // execute query
  const result = await prisma.order.findMany({
    where: { AND: conditions } as Prisma.OrderWhereInput,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  // count total
  const total = await prisma.order.count({
    where: { AND: conditions } as Prisma.OrderWhereInput,
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

// *********--- retrieve all products ---*********
const getShopOrdersFromDB = async (
  user: TAuthUser,
  params: IOrderFilterRequest,
  options: IPaginationOptions
) => {
  // format params and options information
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const conditions: Prisma.OrderWhereInput[] = [];

  // filter if search term specified
  if (searchTerm) {
    conditions.push({
      customer: {
        OR: orderSearchableFields.map((value) => ({
          [value]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })),
      },
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

  // filter by shop
  conditions.push({
    shop: {
      vendor: {
        email: user?.email,
      },
    },
  });

  // execute query
  const result = await prisma.order.findMany({
    where: { AND: conditions } as Prisma.OrderWhereInput,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  // count total
  const total = await prisma.order.count({
    where: { AND: conditions } as Prisma.OrderWhereInput,
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

// *********--- retrieve all products ---*********
const getAllOrdersFromDB = async (
  params: IOrderFilterRequest,
  options: IPaginationOptions
) => {
  // format params and options information
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, shop, ...filterData } = params;

  const conditions: Prisma.OrderWhereInput[] = [];

  // filter if search term specified
  if (searchTerm) {
    conditions.push({
      customer: {
        OR: orderSearchableFields.map((value) => ({
          [value]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        })),
      },
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

  // filter if shop specified
  if (shop) {
    conditions.push({
      shop: {
        name: {
          contains: shop,
          mode: "insensitive",
        },
      },
    });
  }

  // execute query
  const result = await prisma.order.findMany({
    where: { AND: conditions } as Prisma.OrderWhereInput,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  // count total
  const total = await prisma.order.count({
    where: { AND: conditions } as Prisma.OrderWhereInput,
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

export const OrderServices = {
  createOrderIntoDB,
  changeOrderStatusIntoDB,
  changePaymentStatusIntoDB,
  getSingleOrderFromDB,
  getMyOrdersFromDB,
  getShopOrdersFromDB,
  getAllOrdersFromDB,
};
