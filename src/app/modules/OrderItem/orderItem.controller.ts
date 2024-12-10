import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { OrderItemServices } from "./orderItem.service";

const createOrderItem = catchAsync(async (req, res) => {
  const result = await OrderItemServices.createOrderItemIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Order item created successfully",
    data: result,
  });
});

export const OrderItemControllers = {
  createOrderItem,
};
