import express from "express";
import { UserRole } from "@prisma/client";
import auth from "../../middlewares/auth";
import { CategoryControllers } from "./category.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CategoryValidations } from "./category.validation";

const router = express.Router();

// create a new category
router.post(
  "/create",
  validateRequest(CategoryValidations.create),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CategoryControllers.createCategory
);

router.get("/", CategoryControllers.getAllCategories);

router.get("/:id", CategoryControllers.getSingleCategory);

router.patch(
  "/:id",
  validateRequest(CategoryValidations.update),
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CategoryControllers.updateCategory
);

router.delete(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  CategoryControllers.deleteCategory
);

export const CategoryRoutes = router;
