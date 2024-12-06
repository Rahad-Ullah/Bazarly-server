import { Request } from "express";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import * as bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";

const createAdminIntoDB = async (req: Request) => {
  // check if the user is already exists
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: req.body.data.email,
    },
  });
  if (isUserExists) {
    throw new ApiError(StatusCodes.CONFLICT, "Admin already exists!");
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.data.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdAdminData = await transactionClient.admin.create({
      data: req.body.data,
    });

    return createdAdminData;
  });

  return result;
};

const createVendorIntoDB = async (req: Request) => {
  // check if the user is already exists
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: req.body.data.email,
    },
  });
  if (isUserExists) {
    throw new ApiError(StatusCodes.CONFLICT, "Vendor already exists!");
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.data.email,
    password: hashedPassword,
    role: UserRole.VENDOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdVendorData = await transactionClient.vendor.create({
      data: req.body.data,
    });

    return createdVendorData;
  });

  return result;
};


const createCustomerIntoDB = async (req: Request) => {
  // check if the user is already exists
  const isUserExists = await prisma.user.findUnique({
    where: {
      email: req.body.data.email,
    },
  });
  if (isUserExists) {
    throw new ApiError(StatusCodes.CONFLICT, "Customer already exists!");
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  const userData = {
    email: req.body.data.email,
    password: hashedPassword,
    role: UserRole.CUSTOMER,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdCustomerData = await transactionClient.customer.create({
      data: req.body.data,
    });

    return createdCustomerData;
  });

  return result;
};

export const UserServices = {
  createAdminIntoDB,
  createVendorIntoDB,
  createCustomerIntoDB,
};
