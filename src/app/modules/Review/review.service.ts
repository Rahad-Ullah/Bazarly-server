import { Prisma, Review } from "@prisma/client";
import { TAuthUser } from "../../interface/common";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { IReviewFilterRequest } from "./review.interface";
import { IPaginationOptions } from "../../interface/pagination";
import { calculatePagination } from "../../utils/pagination";
import { reviewSearchableFields } from "./review.constant";

// *******--- create review ---*******
const createReviewIntoDB = async (user: TAuthUser, payload: Review) => {
  // check if the user is valid
  const userData = await prisma.customer.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  // set customer ID to payload
  payload.customerId = userData?.id;

  const result = await prisma.review.create({
    data: payload,
  });

  return result;
};

// *******--- update review ---*******
const updateReviewIntoDB = async (id: string, payload: Partial<Review>) => {
  // check if the review ID is valid
  const reviewData = await prisma.review.findUnique({
    where: {
      id,
    },
  });
  if (!reviewData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Review does not exist");
  }

  const result = await prisma.review.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

// *******--- delete review ---*******
const deleteReviewIntoDB = async (id: string) => {
  // check if the review ID is valid
  const reviewData = await prisma.review.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!reviewData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Review does not exist");
  }

  const result = await prisma.review.update({
    where: {
      id,
    },
    data: { isDeleted: true },
  });

  return result;
};

// *******--- get product review ---*******
const getProductReviews = async (id: string) => {
  // check if the product ID is valid
  const productData = await prisma.product.findUnique({
    where: {
      id,
    },
  });
  if (!productData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Product does not found");
  }

  const reviews = await prisma.review.findMany({
    where: {
      productId: id,
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      customer: true,
    },
  });

  const avgRating = await prisma.review.aggregate({
    where: {
      productId: id,
      isDeleted: false,
    },
    _avg: {
      rating: true,
    },
  });

  return {
    reviews,
    rating: avgRating._avg.rating || 0,
  };
};

// *******--- get review ---*******
const getShopReviews = async (id: string) => {
  // check if the shop ID is valid
  const shopData = await prisma.shop.findUnique({
    where: {
      id,
    },
  });
  if (!shopData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Shop does not found");
  }

  const reviews = await prisma.review.findMany({
    where: {
      product: {
        shopId: shopData.id
      },
      isDeleted: false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const avgRating = await prisma.review.aggregate({
    where: {
      product: {
        shopId: shopData.id
      },
      isDeleted: false,
    },
    _avg: {
      rating: true,
    },
  });

  return {
    reviews,
    rating: avgRating._avg.rating || 0,
  };
};

// *********--- retrieve all reviews ---*********
const getAllReviewsFromDB = async (
  params: IReviewFilterRequest,
  options: IPaginationOptions
) => {
  // format params and options information
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, shopId, ...filterData } = params;

  const conditions: Prisma.ReviewWhereInput[] = [];

  // filter if search term specified
  if (searchTerm) {
    conditions.push({
      OR: [
        // Search in product fields
        ...reviewSearchableFields.map((value) => ({
          product: {
            [value]: {
              contains: searchTerm,
              mode: "insensitive",
            },
          },
        })),
        // Search in shop name
        {
          product: {
            shop: {
              name: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    });
  }

  // filter if filter data specified
  if (Object.keys(filterData).length > 0) {
    conditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  // filter for shop
  if (shopId) {
    conditions.push({
      product: {
        shopId,
      },
    });
  }

  // filter non deleted items
  conditions.push({
    isDeleted: false,
  });

  // execute query
  const result = await prisma.review.findMany({
    where: { AND: conditions } as Prisma.ReviewWhereInput,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  // count total
  const total = await prisma.review.count({
    where: { AND: conditions } as Prisma.ReviewWhereInput,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const ReviewServices = {
  createReviewIntoDB,
  updateReviewIntoDB,
  deleteReviewIntoDB,
  getProductReviews,
  getShopReviews,
  getAllReviewsFromDB,
};
