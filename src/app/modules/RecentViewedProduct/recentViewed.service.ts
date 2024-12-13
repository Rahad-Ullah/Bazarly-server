import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/ApiError";
import { TAuthUser } from "../../interface/common";
import prisma from "../../shared/prisma";

// *******--- add to viewed products ---*******
const createRecentViewedProductIntoDB = async (
  userEmail: string,
  payload: { productId: string }
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
      email: userEmail,
    },
  });
  if (!customerData) {
    return "Customer not found";
  }

  // check if the product is already added to recent view
  const isAdded = await prisma.recentViewedProduct.findFirst({
    where: {
      customerId: customerData.id,
      productId: productData.id,
    },
  });
  if (isAdded) {
    return "Product already added";
  }

  const result = await prisma.recentViewedProduct.create({
    data: {
      customerId: customerData.id,
      productId: productData.id,
    },
  });

  return result;
};

// *******--- get recent viewed products ---*******
const getRecentViewedProductsFromDB = async (user: TAuthUser) => {
  // check if the customer is valid
  const customerData = await prisma.customer.findUnique({
    where: {
      email: user?.email,
    },
  });
  if (!customerData) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
  }

  const result = await prisma.recentViewedProduct.findMany({
    where: {
      customerId: customerData.id,
    },
    orderBy: {
      viewedAt: "desc",
    },
    take: 10,
  });

  return result;
};

// *******--- remove from recent viewed products ---*******
const removeRecentViewedProductFromDB = async (id: string) => {
    // check if the item is added
    const isAdded = await prisma.recentViewedProduct.findUnique({
        where: {
            id
        },
    });
    if (!isAdded) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Item not added");
    }

    const result = await prisma.recentViewedProduct.delete({
        where: {
            id
        }
    })

    return result
}

export const RecentViewedServices = {
  createRecentViewedProductIntoDB,
  getRecentViewedProductsFromDB,
  removeRecentViewedProductFromDB
};
