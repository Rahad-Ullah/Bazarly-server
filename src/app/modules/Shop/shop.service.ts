import { Prisma, Shop, UserStatus } from "@prisma/client";
import { TAuthUser } from "../../interface/common";
import { Request } from "express";
import prisma from "../../shared/prisma";
import { IUploadedFile } from "../../interface/file";
import { fileUploader } from "../../utils/fileUploader";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { IShopFilterRequest } from "./shop.interface";
import { IPaginationOptions } from "../../interface/pagination";
import { calculatePagination } from "../../utils/pagination";
import { shopSearchableFields } from "./shop.constant";

// *********--- create shop ---*********
const createShopIntoDB = async (user: TAuthUser, req: Request) => {
  // check if the vendor is valid
  const vendorData = await prisma.vendor.findUniqueOrThrow({
    where: {
      email: user?.email,
      user: {
        status: UserStatus.ACTIVE,
      },
    },
  });

  // check if the vendor has already created a shop
  const isShopDuplicate = await prisma.shop.findUnique({
    where: {
      vendorId: vendorData.id,
    },
  });
  if (isShopDuplicate) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "You can't create more than one shop"
    );
  }

  // check if the shop already exists
  const shopData = await prisma.shop.findUnique({
    where: {
      name: req.body.name,
    },
  });
  if (shopData) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      "Shop name is not available. Someone already using it."
    );
  }

  // set vendorId to body data
  req.body.vendorId = vendorData.id;

  // upload logo photo to cloudinary
  const file = req.file as IUploadedFile;
  if (file) {
    const uploadedFile = await fileUploader.uploadToCloudinary(file);
    req.body.logoUrl = uploadedFile?.secure_url;
  }

  // create shop
  const result = await prisma.shop.create({
    data: req.body,
  });

  return result;
};

// *********--- retrieve all shops ---*********
const getAllShopsFromDB = async (
  params: IShopFilterRequest,
  options: IPaginationOptions
) => {
  // format params and options information
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const conditions: Prisma.ShopWhereInput[] = [];

  // filter if search term specified
  if (searchTerm) {
    conditions.push({
      OR: shopSearchableFields.map((value) => ({
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
  const result = await prisma.shop.findMany({
    where: { AND: conditions } as Prisma.ShopWhereInput,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      vendor: true,
    },
  });

  // count total
  const total = await prisma.shop.count({
    where: { AND: conditions } as Prisma.ShopWhereInput,
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

// *********--- retrieve single shop ---*********
const getSingleShopFromDB = async (id: string) => {
  const result = await prisma.shop.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  return result;
};

// *********--- retrieve vendor shops ---*********
const getVendorShopsFromDB = async (vendorId: string) => {
  // check if vendor is valid
  const vendorData = await prisma.vendor.findUnique({
    where: {
      id: vendorId,
      user: {
        status: UserStatus.ACTIVE,
      },
    },
  });
  if (!vendorData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Vendor does not exist");
  }

  const result = await prisma.shop.findMany({
    where: {
      vendorId,
      isDeleted: false,
    },
  });

  return result;
};

// *********--- update shop ---*********
const updateShopIntoDB = async (id: string, req: Request) => {
  // check if the shop exists
  const shopData = await prisma.shop.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!shopData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "The shop does not exists");
  }

  // upload logo photo to cloudinary
  const file = req.file as IUploadedFile;
  if (file) {
    const uploadedFile = await fileUploader.uploadToCloudinary(file);
    req.body.logoUrl = uploadedFile?.secure_url;
  }

  const result = await prisma.shop.update({
    where: {
      id: shopData.id,
    },
    data: req.body,
  });

  return result;
};

// *********--- change shop status ---*********
const changeStatusIntoDB = async (id: string, payload: Partial<Shop>) => {
  // check if the shop exists
  const shopData = await prisma.shop.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  if (!shopData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "The shop does not exists");
  }

  const result = await prisma.shop.update({
    where: {
      id: shopData.id,
    },
    data: payload,
  });

  return result;
};

// *********--- delete shop ---*********
const deleteShopFromDB = async (user: TAuthUser, id: string) => {
    // check if the user is valid
    const userData = await prisma.vendor.findUnique({
        where: {
            email: user?.email,
            user: {
                status: UserStatus.ACTIVE
            }
        }
    })
    if(!userData){
        throw new ApiError(StatusCodes.UNAUTHORIZED, "User is not authourized");
    }

    // check if the shop is valid
    await prisma.shop.findUniqueOrThrow({
        where: {
            id,
            isDeleted: false
        }
    })

    const result = await prisma.shop.delete({
        where: {
            id
        }
    })

    return result
}


export const ShopServices = {
  createShopIntoDB,
  getAllShopsFromDB,
  getSingleShopFromDB,
  getVendorShopsFromDB,
  updateShopIntoDB,
  deleteShopFromDB,
  changeStatusIntoDB,
};
