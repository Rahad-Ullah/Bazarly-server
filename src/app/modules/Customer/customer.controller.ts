import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import pick from "../../utils/pick";
import { paginationOptions } from "../../utils/pagination";
import { customerFilterableFields } from "./customer.constant";
import { CustomerServices } from "./customer.service";

const getAllCustomers = catchAsync(async (req, res) => {
  const filters = pick(req.query, customerFilterableFields);
  const options = pick(req.query, paginationOptions);
  const result = await CustomerServices.getAllCustomersFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Customers retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// get single customer
const getSingleCustomer = catchAsync(async (req, res) => {
  const result = await CustomerServices.getSingleCustomerFromDB(
    req.params.email
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Customer retrieved successfully",
    data: result,
  });
});

// update customer
const updateCustomer = catchAsync(async (req, res) => {
  const result = await CustomerServices.updateCustomerIntoDB(
    req.params.id,
    req.body
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Customer updated successfully",
    data: result,
  });
});

// delete customer
  const deleteCustomer = catchAsync(async (req, res) => {
    const result = await CustomerServices.deleteCustomerFromDB(req.params.id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Customer deleted successfully",
      data: result,
    });
  });

// soft delete customer
  const softDeleteCustomer = catchAsync(async (req, res) => {
    const result = await CustomerServices.softDeleteCustomerFromDB(req.params.id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Customer deleted successfully",
      data: result,
    });
  });

export const CustomerControllers = {
  getAllCustomers,
  getSingleCustomer,
  updateCustomer,
  deleteCustomer,
  softDeleteCustomer
};
