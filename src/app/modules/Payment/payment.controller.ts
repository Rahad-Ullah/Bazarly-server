import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { PaymentServices } from "./payment.service";
import { Request } from "express";
import { TAuthUser } from "../../interface/common";
import config from "../../../config";

const createPayment = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const result = await PaymentServices.createPaymentIntoDB(
      req.user as TAuthUser,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Payment created successfully",
      data: result,
    });
  }
);

const successPayment = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const result = await PaymentServices.successPaymentIntoDB(
      req.query.payment_id as string,
      req.query.order_id as string
    );

    if (result) {
      res.redirect(
        `${config.site_url.client_url}/payment/success?payment_id=${req.query.payment_id}`
      );
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Payment successful",
      data: null,
    });
  }
);
const failPayment = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const result = await PaymentServices.failPaymentIntoDB(
      req.query.payment_id as string,
      req.query.order_id as string
    );

    if (result) {
      res.redirect(
        `${config.site_url.client_url}/payment/failed?payment_id=${result.id}`
      );
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Payment failed",
      data: null,
    });
  }
);

const cancelPayment = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const result = await PaymentServices.cancelPaymentIntoDB(
      req.query.payment_id as string,
      req.query.order_id as string
    );

    if (result) {
      res.redirect(
        `${config.site_url.client_url}/payment/canceled?payment_id=${result.id}`
      );
    }

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Payment canceled",
      data: null,
    });
  }
);

const getSinglePayment = catchAsync(
  async (req: Request & { user?: TAuthUser }, res) => {
    const result = await PaymentServices.getSinglePayment(req.params.id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Payment retrieved successfully",
      data: result,
    });
  }
);

export const PaymentControllers = {
  createPayment,
  successPayment,
  failPayment,
  cancelPayment,
  getSinglePayment,
};
