import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { jwtHelpers } from "../../utils/jwtHelpers";
import config from "../../../config";
import { JwtPayload } from "jsonwebtoken";

interface ILogin {
  email: string;
  password: string;
}
interface IChangePassword {
  oldPassword: string;
  newPassword: string;
}

const loginIntoDB = async (payload: ILogin) => {
  // check if the user exists
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  if (!userData) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  // verify the password
  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Password incorrect");
  }

  // generate access token
  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
      status: userData.status,
    },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  // generate refresh token
  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

// Refresh token
const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as string
    );
  } catch (error) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
  }

  const userData = await prisma.user.findUnique({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
      status: userData.status,
    },
    config.jwt.refresh_secret as string,
    config.jwt.refresh_expires_in as string
  );
  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

// change password
const changePassword = async (user: JwtPayload, payload: IChangePassword) => {
  // check if the user is valid
  const userData = await prisma.user.findUnique({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });
  if (!userData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User does not exist");
  }

  // verify old password
  const isCorrectPassword = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Password incorrect");
  }

  // hash the new password
  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  // update the password
  await prisma.user.update({
    where: {
      email: userData.email,
      status: UserStatus.ACTIVE,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });

  return {
    message: "Password changed successfully",
  };
};

export const AuthServices = {
  loginIntoDB,
  refreshToken,
  changePassword,
};
