import { Request } from "express";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import * as bcrypt from "bcrypt";
import { UserRole, UserStatus } from "@prisma/client";
import { TAuthUser } from "../../interface/common";

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

  // hash the password
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  // prepare data for user table
  const userData = {
    email: req.body.data.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    // create into user table
    await transactionClient.user.create({
      data: userData,
    });

    // create into admin table
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

  // hash the password
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  // prepare data for user table
  const userData = {
    email: req.body.data.email,
    password: hashedPassword,
    role: UserRole.VENDOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    // create into user table
    await transactionClient.user.create({
      data: userData,
    });

    // create into vendor table
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

  // hash the password
  const hashedPassword: string = await bcrypt.hash(req.body.password, 12);

  // prepare data for user table
  const userData = {
    email: req.body.data.email,
    password: hashedPassword,
    role: UserRole.CUSTOMER,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    // create into user table
    await transactionClient.user.create({
      data: userData,
    });

    // create into customer table
    const createdCustomerData = await transactionClient.customer.create({
      data: req.body.data,
    });

    return createdCustomerData;
  });

  return result;
};

// change user status
const changeUserStatusIntoDB = async (
  id: string,
  payload: { status: UserStatus }
) => {
  // check if user is exist
  const userData = await prisma.user.findUnique({
    where: {
      id,
    },
  });
  if (!userData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User not exist");
  }

  // update user status
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const getMyProfileFromDB = async (user: TAuthUser) => {
  // check if user is exist
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      role: true,
      status: true,
    },
  });

  // get profile data based on role
  let profileInfo;

  if (userInfo.role === "SUPER_ADMIN" || "ADMIN") {
    profileInfo = await prisma.admin.findUnique({
      where: { email: userInfo.email },
    });
  } else if (userInfo.role === "VENDOR") {
    profileInfo = await prisma.vendor.findUnique({
      where: { email: userInfo.email },
    });
  } else if (userInfo.role === "CUSTOMER") {
    profileInfo = await prisma.customer.findUnique({
      where: { email: userInfo.email },
    });
  }

  return { ...userInfo, ...profileInfo };
};

export const UserServices = {
  createAdminIntoDB,
  createVendorIntoDB,
  createCustomerIntoDB,
  changeUserStatusIntoDB,
  getMyProfileFromDB,
};
