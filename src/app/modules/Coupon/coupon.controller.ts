import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { CouponServices } from "./coupon.service";
import pick from "../../utils/pick";
import { couponFilterableFields } from "./coupon.constant";
import { paginationOptions } from "../../utils/pagination";
import { TAuthUser } from "../../interface/common";
import { Request } from "express";

// create a new coupon
const createCoupon = catchAsync(async (req, res) => {
  const result = await CouponServices.createCouponIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon created successfully",
    data: result,
  });
});

// update coupon
const updateCoupon = catchAsync(async (req, res) => {
  const result = await CouponServices.updateCouponIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon updated successfully",
    data: result,
  });
});

// delete coupon
const deleteCoupon = catchAsync(async (req, res) => {
  const result = await CouponServices.deleteCouponFromDB(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupon deleted successfully",
    data: result,
  });
});

// get all coupons
const getAllCoupons = catchAsync(async (req, res) => {
  const filters = pick(req.query, couponFilterableFields);
  const options = pick(req.query, paginationOptions);
  const result = await CouponServices.getAllCouponsFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Coupons retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// apply coupon
const applyCoupon = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const result = await CouponServices.applyCouponIntoDB(
      req.user as TAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Coupon applied successfully",
      data: result,
    });
  }
);

export const CouponControllers = {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
  applyCoupon,
};
