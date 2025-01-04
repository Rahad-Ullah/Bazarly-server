import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/ApiError";
import { TAuthUser } from "../../interface/common";
import prisma from "../../shared/prisma";
import { FollowedShop, Prisma } from "@prisma/client";
import { IFollowedShopFilterRequest } from "./followedShop.interface";
import { IPaginationOptions } from "../../interface/pagination";
import { calculatePagination } from "../../utils/pagination";
import { followedShopSearchableFields } from "./followedShop.constant";

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

const getUserFollowedShopsFromDB = async (user: TAuthUser) => {
  // check if the customer is valid
  const customerData = await prisma.customer.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const result = await prisma.followedShop.findMany({
    where: {
      customerId: customerData.id,
    },
    include: {
      shop: true,
    },
  });

  return result;
};

// **********--- get all customers ---**********
const getShopFollowersFromDB = async (
  vendorEmail: string,
  params: IFollowedShopFilterRequest,
  options: IPaginationOptions
) => {
  // format params and options information
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const conditions: Prisma.FollowedShopWhereInput[] = [];

  // filter if search term specified
  if (searchTerm) {
    conditions.push({
      OR: followedShopSearchableFields.map((value) => ({
        customer: {
          [value]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      })),
    });
  }
  // filter if filter data specified
  if (Object.keys(filterData).length > 0) {
    conditions.push({
      AND: Object.keys(filterData).map((key) => ({
        customer: {
          [key]: {
            equals: (filterData as any)[key],
          },
        },
      })),
    });
  }
  // filter by shop
  conditions.push({
    shop: {
      vendor: {
        email: vendorEmail,
      },
    },
  });

  // execute query
  const result = await prisma.followedShop.findMany({
    where: { AND: conditions } as Prisma.FollowedShopWhereInput,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      customer: true,
    },
  });

  // count total
  const total = await prisma.followedShop.count({
    where: { AND: conditions } as Prisma.FollowedShopWhereInput,
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

export const FollowedShopServices = {
  followShopIntoDB,
  unfollowShopFromDB,
  getUserFollowedShopsFromDB,
  getShopFollowersFromDB,
};
