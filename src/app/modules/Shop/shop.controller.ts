import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ShopServices } from "./shop.service";
import { Request } from "express";
import { TAuthUser } from "../../interface/common";
import pick from "../../utils/pick";
import { paginationOptions } from "../../utils/pagination";
import { shopFilterableFields } from "./shop.constant";

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

// get all shops
const getAllShops = catchAsync(async (req, res) => {
  const filters = pick(req.query, shopFilterableFields);
  const options = pick(req.query, paginationOptions);
  const result = await ShopServices.getAllShopsFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Shops retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// get single shop
const getSingleShop = catchAsync(async (req, res) => {
    const result = await ShopServices.getSingleShopFromDB(
      req.params.id
    );
  
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Shop retrieved successfully",
      data: result,
    });
  });

export const ShopControllers = {
  createShop,
  getAllShops,
  getSingleShop,
};
