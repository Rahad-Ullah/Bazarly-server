import { Payment } from "@prisma/client";
import { TAuthUser } from "../../interface/common";
import prisma from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { generateTrxId } from "../../utils/generateTrxId";
import axios from "axios";
import config from "../../../config";

const createPaymentIntoDB = async (user: TAuthUser, payload: Payment) => {
  // get user data
  const userData = await prisma.customer.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  // check if order is exists
  const orderData = await prisma.order.findUnique({
    where: {
      id: payload.orderId,
    },
  });
  if (!orderData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Order not found");
  }

  // generate transaction id
  const tranId = generateTrxId();

  // set amount and transaction ID to the payload
  payload.amount = orderData.totalAmount;
  payload.transactionId = tranId;

  // create a new payment in the DB
  const payment = await prisma.payment.create({
    data: payload,
  });

  // Initial data for payment
  const paymentData = {
    store_id: config.amaarpay.store_id,
    signature_key: config.amaarpay.sign_key,
    cus_name: userData.name,
    cus_email: userData.email,
    cus_phone: userData.phoneNumber,
    cus_add1: userData.address,
    amount: orderData.totalAmount,
    tran_id: tranId,
    success_url: `${config.site_url.server_url}/payments/success?payment_id=${payment.id}&order_id=${orderData.id}`,
    fail_url: `${config.site_url.server_url}/payments/fail?payment_id=${payment.id}&order_id=${orderData.id}`,
    cancel_url: `${config.site_url.server_url}/payments/cancel?payment_id=${payment.id}&order_id=${orderData.id}`,
    desc: `Payment for order ${orderData.id}`,
    currency: "BDT",
    type: "json",
  };

  try {
    const response = await axios.post(
      "https://sandbox.aamarpay.com/jsonpost.php",
      paymentData
    );

    if (response.status === 200) {
      return { redirect_url: response.data.payment_url };
    } else {
      console.error("Error in Aamarpay response:", response.data);
    }
  } catch (error: any) {
    if (error.response) {
      console.error("Error response from Aamarpay:", error.response.data);
    } else {
      console.error("Error creating payment:", error.message);
    }
  }
};

const successPaymentIntoDB = async (paymentId: string, orderId: string) => {
  // update the payment
  const result = await prisma.$transaction(async (tx) => {
    const result = await tx.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        status: "COMPLETED",
      },
    });

    await tx.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentStatus: "PAID",
      },
    });
    return result;
  });

  return result;
};

const failPaymentIntoDB = async (paymentId: string, orderId: string) => {
  // update the payment
  const result = await prisma.payment.update({
    where: {
      id: paymentId,
    },
    data: {
      status: "FAILED",
    },
  });
  return result;
};

const cancelPaymentIntoDB = async (paymentId: string, orderId: string) => {
  const result = await prisma.payment.delete({
    where: {
      id: paymentId,
    },
  });
  return result;
};

export const PaymentServices = {
  createPaymentIntoDB,
  successPaymentIntoDB,
  cancelPaymentIntoDB,
  failPaymentIntoDB,
};
