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
      req.params.userEmail,
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

// get recent viewed items
const getRecentViewedProduct = catchAsync(
    async (req: Request & { user?: TAuthUser }, res) => {
      const result = await RecentViewedServices.getRecentViewedProductsFromDB(
        req.user as TAuthUser
      );
  
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Retrieved recent viewed products successfully",
        data: result,
      });
    }
  );

  // remove recent viewed items
const removeRecentViewedProduct = catchAsync(
    async (req: Request & { user?: TAuthUser }, res) => {
      const result = await RecentViewedServices.removeRecentViewedProductFromDB(
        req.params.id
      );
  
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Removed from recent viewed products successfully",
        data: result,
      });
    }
  );

export const RecentViewedControllers = {
  createRecentViewedProduct,
  getRecentViewedProduct,
  removeRecentViewedProduct
};
