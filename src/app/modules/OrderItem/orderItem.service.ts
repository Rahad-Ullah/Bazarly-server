import { OrderItem } from "@prisma/client";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

const createOrderItemIntoDB = async (payload: OrderItem[]) => {
  // check if the product id is valid
  for (const item of payload) {
    const productData = await prisma.product.findUnique({
      where: {
        id: item?.productId,
      },
    });
    if (!productData) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Product is not found");
    }

    // check if the order id is valid
    const orderData = await prisma.order.findUnique({
      where: {
        id: item?.orderId,
      },
    });
    if (!orderData) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Order is not found");
    }
  }

  // create
  const result = await prisma.orderItem.createMany({
    data: payload,
  });

  return result;
};

export const OrderItemServices = {
  createOrderItemIntoDB,
};
