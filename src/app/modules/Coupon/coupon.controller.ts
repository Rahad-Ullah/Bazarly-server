import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { CouponServices } from "./coupon.service";

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
    const result = await CouponServices.updateCouponIntoDB(req.params.id, req.body)
  
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Coupon updated successfully",
      data: result,
    });
  });

  // delete coupon
const deleteCoupon = catchAsync(async (req, res) => {
    const result = await CouponServices.deleteCouponFromDB(req.params.id)
  
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Coupon deleted successfully",
      data: result,
    });
  });

export const CouponControllers = {
  createCoupon,
  updateCoupon,
  deleteCoupon
};
