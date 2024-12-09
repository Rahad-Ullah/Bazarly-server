import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { OrderServices } from "./order.service";
import { Request } from "express";
import { TAuthUser } from "../../interface/common";

// create a new order
const createOrder = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const result = await OrderServices.createOrderIntoDB(
      req.user as TAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Order created successfully",
      data: result,
    });
  }
);

// change order status
const changeOrderStatus = catchAsync(
    async (req: Request & { user?: TAuthUser }, res) => {
      const result = await OrderServices.changeOrderStatusIntoDB(
        req.params.id,
        req.body
      );
  
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Order status changed successfully",
        data: result,
      });
    }
  );

// change payment status
const changePaymentStatus = catchAsync(
    async (req, res) => {
      const result = await OrderServices.changePaymentStatusIntoDB(
        req.params.id,
        req.body
      );
  
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Payment status changed successfully",
        data: result,
      });
    }
  );

  // get single order
const getSingleOrder = catchAsync(
    async (req, res) => {
      const result = await OrderServices.getSingleOrderFromDB(
        req.params.id
      );
  
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Order retrieved successfully",
        data: result,
      });
    }
  );

export const OrderControllers = {
  createOrder,
  changeOrderStatus,
  changePaymentStatus,
  getSingleOrder,
};
