import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ShopServices } from "./shop.service";
import { Request } from "express";
import { TAuthUser } from "../../interface/common";

// create a new shop
const createShop = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const result = await ShopServices.createShopIntoDB(
      req.user as TAuthUser,
      req
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Shop created successfully",
      data: result,
    });
  }
);

export const ShopControllers = {
  createShop,
};
