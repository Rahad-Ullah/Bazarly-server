import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { CategoryServices } from "./category.service";
import pick from "../../utils/pick";
import { categoryFilterableFields } from "./category.constant";
import { paginationOptions } from "../../utils/pagination";

// create a new category
const createCategory = catchAsync(async (req, res) => {
  const result = await CategoryServices.createCategoryIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});

// get all categories
const getAllCategories = catchAsync(async (req, res) => {
  const filters = pick(req.query, categoryFilterableFields);
  const options = pick(req.query, paginationOptions);
  const result = await CategoryServices.getAllCategoriesFromDB(
    filters,
    options
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Categories retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// get single categories
const getSingleCategory = catchAsync(async (req, res) => {
  const result = await CategoryServices.getSingleCategoryFromDB(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Category retrieved successfully",
    data: result,
  });
});

export const CategoryControllers = {
  createCategory,
  getAllCategories,
  getSingleCategory,
};
