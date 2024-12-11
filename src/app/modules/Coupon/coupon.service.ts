import { Coupon } from "@prisma/client";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

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
            id
        }
    })

    return result
}

export const CouponServices = {
  createCouponIntoDB,
  updateCouponIntoDB,
  deleteCouponFromDB
};
