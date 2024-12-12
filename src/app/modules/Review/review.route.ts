import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { UserRole } from "@prisma/client";
import { ReviewControllers } from "./review.controller";
import { ReviewValidations } from "./review.validation";

const router = express.Router();

router.get("/product/:id", ReviewControllers.getProductReviews);

router.get("/", ReviewControllers.getAllReviews);

router.post(
  "/create",
  auth(UserRole.CUSTOMER),
  validateRequest(ReviewValidations.create),
  ReviewControllers.createReview
);

router.patch(
  "/:id",
  auth(UserRole.CUSTOMER),
  validateRequest(ReviewValidations.update),
  ReviewControllers.updateReview
);

router.delete("/:id", auth(UserRole.CUSTOMER), ReviewControllers.deleteReview);

export const ReviewRoutes = router;
