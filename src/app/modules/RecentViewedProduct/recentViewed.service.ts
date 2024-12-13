import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/ApiError";
import { TAuthUser } from "../../interface/common";
import prisma from "../../shared/prisma";
import { RecentViewedProduct } from "@prisma/client";

const createRecentViewedProductIntoDB = async (
  user: TAuthUser,
  payload: RecentViewedProduct
) => {
  // check if product id is valid
  const productData = await prisma.product.findUnique({
    where: {
      id: payload.productId,
    },
  });
  if (!productData) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Product not found");
  }

  // check if the customer is valid
  const customerData = await prisma.customer.findUnique({
    where: {
      email: user?.email,
    },
  });
  if (!customerData) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
  }
  // insert the customer id to the payload
  payload.customerId = customerData?.id;

  // check if the product is already added to recent view
  const isAdded = await prisma.recentViewedProduct.findFirst({
    where: {
      customerId: customerData.id,
      productId: productData.id,
    },
  });
  if (isAdded) {
    throw new ApiError(StatusCodes.CONFLICT, "Product already added");
  }

  const result = await prisma.recentViewedProduct.create({
    data: payload,
  });

  return result;
};

export const RecentViewedServices = {
  createRecentViewedProductIntoDB,
};
