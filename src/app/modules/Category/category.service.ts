import { Category } from "@prisma/client";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";

const createCategoryIntoDB = async (payload: Category) => {
  // check if the category is already exists
  const categoryData = await prisma.category.findFirst({
    where: {
      name: payload.name,
    },
  });
  if (categoryData) {
    throw new ApiError(StatusCodes.CONFLICT, "Category already exists");
  }

  const result = await prisma.category.create({
    data: payload,
  });

  return result;
};

export const CategoryServices = {
  createCategoryIntoDB,
};
