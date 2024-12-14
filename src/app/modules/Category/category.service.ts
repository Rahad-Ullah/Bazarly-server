import { Category, Prisma } from "@prisma/client";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { ICategoryFilterRequest } from "./category.interface";
import { IPaginationOptions } from "../../interface/pagination";
import { calculatePagination } from "../../utils/pagination";
import { categorySearchableFields } from "./category.constant";
import { Request } from "express";
import { IUploadedFile } from "../../interface/file";
import { fileUploader } from "../../utils/fileUploader";

// *********--- create category ---*********
const createCategoryIntoDB = async (req: Request) => {
  // check if the category is already exists
  const categoryData = await prisma.category.findFirst({
    where: {
      name: req.body.name,
    },
  });
  if (categoryData) {
    throw new ApiError(StatusCodes.CONFLICT, "Category already exists");
  }

  // upload photo to cloudinary
  const file = req.file as IUploadedFile;
  if (file) {
    const uploadedFile = await fileUploader.uploadToCloudinary(file);
    req.body.image = uploadedFile?.secure_url;
  }

  const result = await prisma.category.create({
    data: req.body,
  });

  return result;
};

// *********--- get all categories ---*********
const getAllCategoriesFromDB = async (
  params: ICategoryFilterRequest,
  options: IPaginationOptions
) => {
  // format params and options information
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const conditions: Prisma.CategoryWhereInput[] = [];

  // filter if search term specified
  if (searchTerm) {
    conditions.push({
      OR: categorySearchableFields.map((value) => ({
        [value]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  // filter if filter data specified
  if (Object.keys(filterData).length > 0) {
    conditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }
  // filter non deleted items
  conditions.push({
    isDeleted: false,
  });

  // execute query
  const result = await prisma.category.findMany({
    where: { AND: conditions } as Prisma.CategoryWhereInput,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  // count total
  const total = await prisma.category.count({
    where: { AND: conditions } as Prisma.CategoryWhereInput,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

// *********--- get single category ---*********
const getSingleCategoryFromDB = async (id: string) => {
  const result = await prisma.category.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};

// *********--- update category ---*********
const updateCategoryIntoDB = async (id: string, req: Request) => {
  // check if category exists
  const categoryData = await prisma.category.findUnique({
    where: {
      id,
    },
  });
  if (!categoryData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Category does not exist");
  }

  // upload photo to cloudinary
  const file = req.file as IUploadedFile;
  if (file) {
    const uploadedFile = await fileUploader.uploadToCloudinary(file);
    req.body.image = uploadedFile?.secure_url;
  }

  const result = await prisma.category.update({
    where: {
      id,
    },
    data: req.body,
  });

  return result;
};

// *********--- delete category ---*********
const deleteCategoryFromDB = async (id: string) => {
    // check if category exists
    const categoryData = await prisma.category.findUnique({
      where: {
        id
      }
    })
    if(!categoryData) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Category does not exist")
    }
  
  const result = await prisma.category.delete({
    where: {
      id
    }
  })

  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
};
