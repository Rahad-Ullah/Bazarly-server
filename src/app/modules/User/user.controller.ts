import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { UserServices } from "./user.service";
import { Request } from "express";
import { TAuthUser } from "../../interface/common";

const createAdmin = catchAsync(async (req, res) => {
  const result = await UserServices.createAdminIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

const createVendor = catchAsync(async (req, res) => {
  const result = await UserServices.createVendorIntoDB(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Vendor created successfully",
    data: result,
  });
});

const createCustomer = catchAsync(async (req, res) => {
  const result = await UserServices.createCustomerIntoDB(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Customer created successfully",
    data: result,
  });
});

const changeUserStatus = catchAsync(async (req, res) => {
  const result = await UserServices.changeUserStatusIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Status changed successfully",
    data: result,
  });
});

const getMyProfile = catchAsync(async (req: Request & { user?: any }, res) => {
  const result = await UserServices.getMyProfileFromDB(req.user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const updateMyProfile = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const result = await UserServices.updateMyProfile(
      req.user as TAuthUser,
      req
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "User profile updated successfully",
      data: result,
    });
  }
);

export const UserControllers = {
  createAdmin,
  createVendor,
  createCustomer,
  changeUserStatus,
  getMyProfile,
  updateMyProfile,
};
