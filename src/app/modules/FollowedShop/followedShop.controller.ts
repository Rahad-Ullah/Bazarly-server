import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { FollowedShopServices } from "./followedShop.service";
import { Request } from "express";
import { TAuthUser } from "../../interface/common";
import pick from "../../utils/pick";
import { followedShopFilterableFields } from "./followedShop.constant";
import { paginationOptions } from "../../utils/pagination";

const followShop = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const result = await FollowedShopServices.followShopIntoDB(
      req.user as TAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Shop followed successfully",
      data: result,
    });
  }
);

const unFollowShop = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const result = await FollowedShopServices.unfollowShopFromDB(
      req.user as TAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Shop unfollowed successfully",
      data: result,
    });
  }
);

const getUserFollowedShops = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const result = await FollowedShopServices.getUserFollowedShopsFromDB(
      req.user as TAuthUser
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Followed shops retrieved successfully",
      data: result,
    });
  }
);

const getShopFollowers = catchAsync(async (req, res) => {
  const filters = pick(req.query, followedShopFilterableFields);
  const options = pick(req.query, paginationOptions);
  const result = await FollowedShopServices.getShopFollowersFromDB(
    req.params.vendorEmail,
    filters,
    options
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Followers retrieved successfully",
    data: result,
  });
});

export const FollowedShopControllers = {
  followShop,
  unFollowShop,
  getUserFollowedShops,
  getShopFollowers,
};
