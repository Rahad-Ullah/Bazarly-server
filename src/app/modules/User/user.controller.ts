import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { UserServices } from "./user.service";

const createAdmin = catchAsync(async (req, res) => {
  const result = await UserServices.createAdminIntoDB(req);

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

export const UserControllers = {
  createAdmin,
  createVendor,
};
