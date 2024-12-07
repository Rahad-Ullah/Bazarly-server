import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import pick from "../../utils/pick";
import { paginationOptions } from "../../utils/pagination";
import { vendorFilterableFields } from "./vendor.constant";
import { VendorServices } from "./vendor.service";

const getAllVendors = catchAsync(async (req, res) => {
  const filters = pick(req.query, vendorFilterableFields);
  const options = pick(req.query, paginationOptions);
  const result = await VendorServices.getAllVendorsFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Vendors retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// get single vendor
const getSingleVendor = catchAsync(async (req, res) => {
  const result = await VendorServices.getSingleVendorFromDB(req.params.email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Vendor retrieved successfully",
    data: result,
  });
});

// update vendor
const updateVendor = catchAsync(async (req, res) => {
    const result = await VendorServices.updateVendorIntoDB(req.params.id, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Vendor updated successfully",
      data: result,
    });
  });

  const deleteVendor = catchAsync(async (req, res) => {
    const result = await VendorServices.deleteVendorFromDB(req.params.id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Vendor deleted successfully",
      data: result,
    });
  });

  const softDeleteVendor = catchAsync(async (req, res) => {
    const result = await VendorServices.softDeleteVendorFromDB(req.params.id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Vendor deleted successfully",
      data: result,
    });
  });

export const VendorControllers = {
  getAllVendors,
  getSingleVendor,
  updateVendor,
  deleteVendor,
  softDeleteVendor,
};
