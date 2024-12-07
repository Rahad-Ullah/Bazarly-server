import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { AdminServices } from "./admin.service";
import { adminFilterableFields } from "./admin.constant";
import pick from "../../utils/pick";
import { paginationOptions } from "../../utils/pagination";

const getAllAdmins = catchAsync(async (req, res) => {
  const filters = pick(req.query, adminFilterableFields);
  const options = pick(req.query, paginationOptions);
  const result = await AdminServices.getAllAdminsFromDB(filters, options);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

// get single admin
const getSingleAdmin = catchAsync(async (req, res) => {
  const result = await AdminServices.getSingleAdminFromDB(req.params.email);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin retrieved successfully",
    data: result,
  });
});

// update admin
const updateAdmin = catchAsync(async (req, res) => {
    const result = await AdminServices.updateAdminIntoDB(req.params.id, req.body);
  
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin updated successfully",
      data: result,
    });
  });

  const deleteAdmin = catchAsync(async (req, res) => {
    const result = await AdminServices.deleteAdminFromDB(req.params.id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  });

  const softDeleteAdmin = catchAsync(async (req, res) => {
    const result = await AdminServices.softDeleteAdminFromDB(req.params.id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  });

  export const AdminControllers = {
    getSingleAdmin,
    getAllAdmins,
    updateAdmin,
    deleteAdmin,
    softDeleteAdmin,
  };
