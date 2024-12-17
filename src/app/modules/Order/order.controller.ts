import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { OrderServices } from "./order.service";
import { Request } from "express";
import { TAuthUser } from "../../interface/common";
import pick from "../../utils/pick";
import { orderFilterableFields } from "./order.constant";
import { paginationOptions } from "../../utils/pagination";

// create a new order
const createOrder = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const { products, ...orderData } = req.body;
    const result = await OrderServices.createOrderIntoDB(
      req.user as TAuthUser,
      orderData,
      products
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
const changePaymentStatus = catchAsync(async (req, res) => {
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
});

// get single order
const getSingleOrder = catchAsync(async (req, res) => {
  const result = await OrderServices.getSingleOrderFromDB(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order retrieved successfully",
    data: result,
  });
});

// get orders by product id
const getProductOrder = catchAsync(async (req: Request & {user?: TAuthUser}, res) => {
  const result = await OrderServices.getProductOrderFromDB(req.user as TAuthUser, req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order retrieved successfully",
    data: result,
  });
});

// get my orders
const getMyOrders = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const options = pick(req.query, paginationOptions);
    const result = await OrderServices.getMyOrdersFromDB(
      req.user as TAuthUser,
      options
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Orders retrieved successfully",
      data: result,
    });
  }
);

// get shop orders
const getShopOrders = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const filters = pick(req.query, orderFilterableFields);
    const options = pick(req.query, paginationOptions);
    const result = await OrderServices.getShopOrdersFromDB(
      req.user as TAuthUser,
      filters,
      options
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Orders retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

// get shop orders
const getAllOrders = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const filters = pick(req.query, orderFilterableFields);
    const options = pick(req.query, paginationOptions);
    const result = await OrderServices.getAllOrdersFromDB(filters, options);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Orders retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  }
);

export const OrderControllers = {
  createOrder,
  changeOrderStatus,
  changePaymentStatus,
  getSingleOrder,
  getProductOrder,
  getMyOrders,
  getShopOrders,
  getAllOrders
};
