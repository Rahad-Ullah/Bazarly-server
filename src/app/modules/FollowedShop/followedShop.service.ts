import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/ApiError";
import { TAuthUser } from "../../interface/common";
import prisma from "../../shared/prisma";
import { FollowedShop } from "@prisma/client";

const followShopIntoDB = async (user: TAuthUser, payload: FollowedShop) => {
  // check if shopId is valid
  const shopData = await prisma.shop.findUnique({
    where: {
      id: payload.shopId,
    },
  });
  if (!shopData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Shop does not exist");
  }

  // check if the user is valid
  const userData = await prisma.customer.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  // insert the customerId into payload
  payload.customerId = userData?.id;

  // check if the user already follows the shop
  const isFollowed = await prisma.followedShop.findFirst({
    where: {
      customerId: userData.id,
      shopId: shopData.id,
    },
  });
  if (isFollowed) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "You have already followed the shop"
    );
  }

  const result = await prisma.followedShop.create({
    data: payload,
  });

  return result;
};

const unfollowShopFromDB = async (user: TAuthUser, payload: FollowedShop) => {
  // check if shopId is valid
  const shopData = await prisma.shop.findUnique({
    where: {
      id: payload.shopId,
    },
  });
  if (!shopData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Shop does not exist");
  }

  // check if the user is valid
  const userData = await prisma.customer.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });
  // insert the customerId into payload
  payload.customerId = userData?.id;

  // check if the user already unfollows the shop
  const isFollowed = await prisma.followedShop.findFirst({
    where: {
      customerId: userData.id,
      shopId: shopData.id,
    },
  });
  if (!isFollowed) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "You have already unfollowed the shop"
    );
  }

  const result = await prisma.followedShop.delete({
    where: {
      id: isFollowed.id,
    },
  });

  return result;
};

export const FollowedShopServices = {
  followShopIntoDB,
  unfollowShopFromDB,
};
