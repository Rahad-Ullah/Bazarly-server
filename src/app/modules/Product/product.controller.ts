import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { ProductServices } from "./product.service";
import { Request } from "express";
import { TAuthUser } from "../../interface/common";
import pick from "../../utils/pick";
import { productFilterableFields } from "./product.constant";
import { paginationOptions } from "../../utils/pagination";

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

// duplicate product
const duplicateProduct = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const result = await ProductServices.duplicateProductIntoDB(req.body)

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Product duplicated successfully",
      data: result,
    });
  }
);

// update product
const updateProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.updateProductIntoDB(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

// get single product
const getSingleProduct = catchAsync(async (req, res) => {
  const result = await ProductServices.getSingleProductFromDB(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product retrieved successfully",
    data: result,
  });
});

// get all products
const getAllProducts = catchAsync(async (req, res) => {
  const filters = pick(req.query, productFilterableFields);
  const options = pick(req.query, paginationOptions);
  const result = await ProductServices.getAllProductsFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Products retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// get all products
const deleteProduct = catchAsync(async (req: Request & {user?: TAuthUser}, res) => {
  const result = await ProductServices.deleteProductFromDB(req.user as TAuthUser, req.params.id)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Product deleted successfully",
    data: result,
  });
});

export const ProductControllers = {
  createProduct,
  duplicateProduct,
  updateProduct,
  getSingleProduct,
  getAllProducts,
  deleteProduct
};
