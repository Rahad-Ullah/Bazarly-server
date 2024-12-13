import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { RecentViewedServices } from "./recentViewed.service";
import { Request } from "express";
import { TAuthUser } from "../../interface/common";

// create recent viewed items
const createRecentViewedProduct = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const result = await RecentViewedServices.createRecentViewedProductIntoDB(
      req.user as TAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Added to recent viewed products successfully",
      data: result,
    });
  }
);

export const RecentViewedControllers = {
  createRecentViewedProduct,
};
