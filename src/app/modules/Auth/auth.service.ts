import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { jwtHelpers } from "../../utils/jwtHelpers";
import config from "../../../config";

interface ILogin {
  email: string;
  password: string;
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

export const AuthServices = {
  loginIntoDB,
};
