import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AuthServices } from "./auth.service";
import { Request } from "express";

const login = catchAsync(async (req: Request & { user?: any }, res) => {
  const result = await AuthServices.loginIntoDB(req.body);

  const { refreshToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: false,
    httpOnly: true,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Login successful",
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  console.log(refreshToken);

  const result = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Access token successful",
    data: result,
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res) => {
    const result = await AuthServices.changePassword(req.user, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  }
);

// forgot password
const forgotPassword = catchAsync(
    async (req: Request & { user?: any }, res) => {
      await AuthServices.forgotPassword(req.body);
  
      sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Reset link is sent successfully",
        data: null,
      });
    }
  );

export const AuthControllers = {
  login,
  refreshToken,
  changePassword,
  forgotPassword,
};
