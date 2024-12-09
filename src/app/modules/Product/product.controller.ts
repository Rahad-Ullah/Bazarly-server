import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ProductServices } from "./product.service";
import { Request } from "express";
import { TAuthUser } from "../../interface/common";

// create a new product
const createProduct = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const result = await ProductServices.createProductIntoDB(
      req.user as TAuthUser,
      req
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Product created successfully",
      data: result,
    });
  }
);

export const ProductControllers = {
  createProduct,
};
