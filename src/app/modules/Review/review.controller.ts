import { Request } from "express";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { TAuthUser } from "../../interface/common";
import { StatusCodes } from "http-status-codes";
import { ReviewServices } from "./review.service";

// create a new review
const createReview = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const result = await ReviewServices.createReviewIntoDB(
      req.user as TAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Review created successfully",
      data: result,
    });
  }
);

// update review
const updateReview = catchAsync(
    async (req: Request & { user?: TAuthUser }, res) => {
      const result = await ReviewServices.updateReviewIntoDB(
        req.params.id,
        req.body
      );
  
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Review updated successfully",
        data: result,
      });
    }
  );

  // delete review
const deleteReview = catchAsync(
    async (req: Request & { user?: TAuthUser }, res) => {
      const result = await ReviewServices.deleteReviewIntoDB(
        req.params.id
      );
  
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Review deleted successfully",
        data: result,
      });
    }
  );

export const ReviewControllers = {
  createReview,
  updateReview,
  deleteReview
};