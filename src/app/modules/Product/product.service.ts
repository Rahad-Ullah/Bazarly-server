import { Product } from "@prisma/client";
import prisma from "../../shared/prisma";
import { TAuthUser } from "../../interface/common";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { Request } from "express";
import { IUploadedFile } from "../../interface/file";
import { fileUploader } from "../../utils/fileUploader";

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

export const ProductServices = {
  createProductIntoDB,
};
