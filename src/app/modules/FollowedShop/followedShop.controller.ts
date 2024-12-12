import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { FollowedShopServices } from "./followedShop.service";
import { Request } from "express";
import { TAuthUser } from "../../interface/common";

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

export const FollowedShopControllers = {
  followShop,
  unFollowShop,
};
