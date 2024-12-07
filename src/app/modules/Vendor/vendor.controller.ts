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

// // update admin
// const updateAdmin = catchAsync(async (req, res) => {
//     const result = await AdminServices.updateAdminIntoDB(req.params.id, req.body);

//     sendResponse(res, {
//       statusCode: StatusCodes.OK,
//       success: true,
//       message: "Admin updated successfully",
//       data: result,
//     });
//   });

//   const deleteAdmin = catchAsync(async (req, res) => {
//     const result = await AdminServices.deleteAdminFromDB(req.params.id);

//     sendResponse(res, {
//       statusCode: StatusCodes.OK,
//       success: true,
//       message: "Admin deleted successfully",
//       data: result,
//     });
//   });

//   const softDeleteAdmin = catchAsync(async (req, res) => {
//     const result = await AdminServices.softDeleteAdminFromDB(req.params.id);

//     sendResponse(res, {
//       statusCode: 200,
//       success: true,
//       message: "Admin deleted successfully",
//       data: result,
//     });
//   });

export const VendorControllers = {
  getAllVendors,
  getSingleVendor,
};
