import { StatusCodes } from "http-status-codes";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";
import { UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { jwtHelpers } from "../../utils/jwtHelpers";
import config from "../../../config";
import { JwtPayload, Secret } from "jsonwebtoken";
import emailSender from "../../utils/emailSender";

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

// forgot password
const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  if (!userData) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  // generate reset token for sending by email
  const resetPassToken = jwtHelpers.generateToken(
    { email: userData.email, role: userData.role, status: userData.status },
    config.jwt.reset_pass_secret as string,
    config.jwt.reset_pass_expires_in as string
  );
  // generate reset link for sending by email
  const resetPassLink = `${config.reset_pass_link}?id=${userData.id}&token=${resetPassToken}`;

  // send email
  await emailSender(
    userData.email,
    `
      <div>
        <p>Dear User,</p>
        <p>Your password reset link:
          <a href=${resetPassLink}>
            <button>Reset Password</button>
          </a>
        </p>
      </div>
      `
  );
};

// reset password -------
const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  // check if the user valid
  const userData = await prisma.user.findUnique({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });
  if (!userData) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User does not exist");
  }

  // verify token
  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_secret as Secret
  );
  if (!isValidToken) {
    throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden!");
  }

  // hash password
  const hashedPassword = await bcrypt.hash(payload.password, 12);

  // update password into DB
  const result = await prisma.user.update({
    where: {
      id: payload.id,
    },
    data: { password: hashedPassword },
  });
  return result;
};

export const AuthServices = {
  loginIntoDB,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
