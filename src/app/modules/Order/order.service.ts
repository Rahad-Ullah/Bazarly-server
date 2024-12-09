import { Order, OrderPaymentStatus, OrderStatus } from "@prisma/client";
import { TAuthUser } from "../../interface/common";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

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

export const OrderServices = {
  createOrderIntoDB,
  changeOrderStatusIntoDB,
  changePaymentStatusIntoDB,
};
