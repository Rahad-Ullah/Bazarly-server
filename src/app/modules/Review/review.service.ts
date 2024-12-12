import { Review } from "@prisma/client";
import { TAuthUser } from "../../interface/common";
import prisma from "../../shared/prisma";

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

export const ReviewServices = {
  createReviewIntoDB,
};
