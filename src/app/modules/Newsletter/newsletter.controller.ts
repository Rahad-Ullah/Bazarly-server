import { StatusCodes } from "http-status-codes";
import catchAsync from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponse";
import { NewsletterService } from "./newsletter.service";

// create a new newsletter
const createNewsletter = catchAsync(async (req, res) => {
  const result = await NewsletterService.createNewsletterIntoDB(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Newsletter created successfully",
    data: result,
  });
});

// get all newsletters
const getAllNewsletters = catchAsync(async (req, res) => {
  const result = await NewsletterService.getAllNewslettersFromDB()

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Newsletters retrieved successfully",
    data: result,
  });
});

export const NewsletterControllers = {
  createNewsletter,
  getAllNewsletters,
};
