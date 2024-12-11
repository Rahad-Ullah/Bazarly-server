import { Coupon } from "@prisma/client";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

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


export const CouponServices = {
  createCouponIntoDB,
};
