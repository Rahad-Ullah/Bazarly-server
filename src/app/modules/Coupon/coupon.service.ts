import { Coupon, Prisma } from "@prisma/client";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { ICouponFilterRequest } from "./coupon.interface";
import { IPaginationOptions } from "../../interface/pagination";
import { calculatePagination } from "../../utils/pagination";
import { couponSearchableFields } from "./coupon.constant";
import { TAuthUser } from "../../interface/common";

// ********--- create coupon ---********
const createCouponIntoDB = async (payload: Coupon) => {
  // check if the coupon is already exist
  const couponData = await prisma.coupon.findUnique({
    where: {
      code: payload.code,
    },
  });
  if (couponData) {
    throw new ApiError(StatusCodes.CONFLICT, "Coupon already exists");
  }

  // check the startTime and endTime
  const today = new Date();
  const startTime = new Date(payload.startTime);
  const endTime = new Date(payload.endTime);

  // check if the startTime and endTime are before today
  if (startTime < today && endTime <= today) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Start time and end time must be before now"
    );
  }
  // check if the startTime before the endTime
  if (startTime >= endTime) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Start time must be before end time"
    );
  }

  const result = await prisma.coupon.create({
    data: payload,
  });

  return result;
};

// ********--- update coupon ---********
const updateCouponIntoDB = async (id: string, payload: Partial<Coupon>) => {
  // check if the coupon is exists
  const couponData = await prisma.coupon.findUnique({
    where: {
      id,
    },
  });
  if (!couponData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Coupon does not exists");
  }

  // check the startTime and endTime
  const today = new Date();
  const startTime = new Date(payload.startTime as Date);
  const endTime = new Date(payload.endTime as Date);

  // check if the startTime and endTime are before today
  if (startTime < today && endTime <= today) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Start time and end time must be before now"
    );
  }
  // check if the startTime before the endTime
  if (startTime >= endTime) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Start time must be before end time"
    );
  }

  const result = await prisma.coupon.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

// ********--- delete coupon ---********
const deleteCouponFromDB = async (id: string) => {
  // check if the coupon is exists
  const couponData = await prisma.coupon.findUnique({
    where: {
      id,
    },
  });
  if (!couponData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Coupon does not exists");
  }

  const result = await prisma.coupon.delete({
    where: {
      id,
    },
  });

  return result;
};

// ********--- get all coupons ---********
const getAllCouponsFromDB = async (
  params: ICouponFilterRequest,
  options: IPaginationOptions
) => {
  // format params and options information
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const {
    searchTerm,
    startTime: startDateTime,
    endTime: endDateTime,
    ...filterData
  } = params;

  const conditions: Prisma.CouponWhereInput[] = [];

  // filter if search term specified
  if (searchTerm) {
    conditions.push({
      OR: couponSearchableFields.map((value) => ({
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

  if (startDateTime) {
    conditions.push({
      startTime: {
        gte: startDateTime,
      },
    });
  }

  if (endDateTime) {
    conditions.push({
      endTime: {
        lte: endDateTime,
      },
    });
  }

  // filter non deleted items
  conditions.push({
    isDeleted: false,
  });

  // execute query
  const result = await prisma.coupon.findMany({
    where: { AND: conditions } as Prisma.CouponWhereInput,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  // count total
  const total = await prisma.coupon.count({
    where: { AND: conditions } as Prisma.CouponWhereInput,
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

// ********--- apply coupon ---********
const applyCouponIntoDB = async (
  user: TAuthUser,
  payload: { code: string }
) => {
  // get the user data
  const userData = await prisma.customer.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  // check if the coupon is exists
  const couponData = await prisma.coupon.findUnique({
    where: {
      code: payload.code,
      endTime: {
        gte: new Date(),
      },
    },
  });
  if (!couponData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid Coupon Code");
  }

  // check if user already used the coupon
  const usedCouponCount = await prisma.customerCoupon.count({
    where: {
      couponId: couponData.id,
      customer: {
        email: user?.email,
      },
    },
  });
  if (usedCouponCount >= couponData.usageLimit) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      `You cannot use the coupon more than ${couponData.usageLimit} times`
    );
  }

  const result = await prisma.$transaction(async (tx) => {
    // create in the customer coupon table
    await tx.customerCoupon.create({
      data: {
        customerId: userData.id,
        couponId: couponData.id,
      },
    });

    // update the coupon used count
    const updatedCoupon = await tx.coupon.update({
      where: {
        id: couponData.id,
      },
      data: {
        usedCount: couponData.usedCount + 1,
      },
    });

    return updatedCoupon;
  });

  return result;
};

export const CouponServices = {
  createCouponIntoDB,
  updateCouponIntoDB,
  deleteCouponFromDB,
  getAllCouponsFromDB,
  applyCouponIntoDB,
};
