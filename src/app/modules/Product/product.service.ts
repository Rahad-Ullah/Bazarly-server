import { Prisma, Product } from "@prisma/client";
import prisma from "../../shared/prisma";
import { TAuthUser } from "../../interface/common";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { Request } from "express";
import { IUploadedFile } from "../../interface/file";
import { fileUploader } from "../../utils/fileUploader";
import { calculatePagination } from "../../utils/pagination";
import { productSearchableFields } from "./product.constant";
import { IProductFilterRequest } from "./product.interface";
import { IPaginationOptions } from "../../interface/pagination";

// **********--- create product ---*********
const createProductIntoDB = async (user: TAuthUser, req: Request) => {
  // check if the shopId is valid
  const shopData = await prisma.shop.findFirst({
    where: {
      vendor: {
        email: user?.email,
      },
    },
  });
  if (!shopData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Shop not found");
  }

  // set shopId to body data
  req.body.shopId = shopData.id;

  // check if the categoryId is valid
  await prisma.category.findUnique({
    where: {
      id: req.body.categoryId,
    },
  });

  // upload photo to cloudinary
  const file = req.file as IUploadedFile;
  if (file) {
    const uploadedFile = await fileUploader.uploadToCloudinary(file);
    req.body.image = uploadedFile?.secure_url;
  }

  console.log(req.body);

  // create product
  const result = await prisma.product.create({
    data: req.body,
  });

  return result;
};

// **********--- update product ---*********
const updateProductIntoDB = async (req: Request) => {
  // check if the product is exists
  const productData = await prisma.product.findUnique({
    where: {
      id: req.params.id,
    },
  });
  if (!productData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Product does not exists");
  }

  // check if the categoryId is valid
  await prisma.category.findUnique({
    where: {
      id: req.body.categoryId,
    },
  });

  // upload photo to cloudinary
  const file = req.file as IUploadedFile;
  if (file) {
    const uploadedFile = await fileUploader.uploadToCloudinary(file);
    req.body.image = uploadedFile?.secure_url;
  }

  // create product
  const result = await prisma.product.update({
    where: {
      id: productData.id,
    },
    data: req.body,
  });

  return result;
};

// **********--- get single product ---*********
const getSingleProductFromDB = async (id: string) => {
  const result = await prisma.product.findUnique({
    where: {
      id,
    },
  });

  return result;
};

// *********--- retrieve all products ---*********
const getAllProductsFromDB = async (
  params: IProductFilterRequest,
  options: IPaginationOptions
) => {
  // format params and options information
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, category, minPrice, maxPrice, ...filterData } = params;

  const conditions: Prisma.ProductWhereInput[] = [];

  // filter if search term specified
  if (searchTerm) {
    conditions.push({
      OR: productSearchableFields.map((value) => ({
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

  // filter if category specified
  if (category) {
    conditions.push({
      category: {
        name: {
          contains: category,
          mode: "insensitive",
        },
      },
    });
  }

  // filter if price specified
  if (minPrice && maxPrice) {
    conditions.push({
      AND: [
        {
          price: {
            gte: Number(minPrice), // Minimum price
          },
        },
        {
          price: {
            lte: Number(maxPrice), // Maximum price
          },
        },
      ],
    });
  } else if (minPrice) {
    conditions.push({
      price: {
        gte: Number(minPrice),
      },
    });
  } else if (maxPrice) {
    conditions.push({
      price: {
        lte: Number(maxPrice),
      },
    });
  }

  // filter non deleted items
  conditions.push({
    isDeleted: false,
  });

  // execute query
  const result = await prisma.product.findMany({
    where: { AND: conditions } as Prisma.ProductWhereInput,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  // count total
  const total = await prisma.product.count({
    where: { AND: conditions } as Prisma.ProductWhereInput,
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
export const ProductServices = {
  createProductIntoDB,
  updateProductIntoDB,
  getSingleProductFromDB,
  getAllProductsFromDB,
};
