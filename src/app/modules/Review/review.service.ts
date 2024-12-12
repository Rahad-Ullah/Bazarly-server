import { Review } from "@prisma/client";
import { TAuthUser } from "../../interface/common";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

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

export const ReviewServices = {
  createReviewIntoDB,
  updateReviewIntoDB,
  deleteReviewIntoDB,
};
