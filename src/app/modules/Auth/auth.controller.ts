import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AuthServices } from "./auth.service";
import { Request } from "express";

const login = catchAsync(async (req: Request & { user?: any }, res) => {
  const result = await AuthServices.loginIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Login successful",
    data: result,
  });
});

export const AuthControllers = {
  login,
};
