import { Shop } from "@prisma/client";
import { TAuthUser } from "../../interface/common";
import { Request } from "express";
import prisma from "../../shared/prisma";
import { IUploadedFile } from "../../interface/file";
import { fileUploader } from "../../utils/fileUploader";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

// *********--- create shop ---*********
const createShopIntoDB = async (user: TAuthUser, req: Request) => {
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

  // find the vendor
  const vendorData = await prisma.vendor.findUniqueOrThrow({
    where: {
      email: user?.email,
      isDeleted: false,
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

  // set vendorId to body data
  req.body.vendorId = vendorData.id;

  // upload profile photo to cloudinary
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

export const ShopServices = {
  createShopIntoDB,
};
