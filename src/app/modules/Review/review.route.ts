import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import { ReviewControllers } from "./review.controller";
import { ReviewValidations } from "./review.validation";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.CUSTOMER),
  validateRequest(ReviewValidations.create),
  ReviewControllers.createReview
);

export const ReviewRoutes = router;
