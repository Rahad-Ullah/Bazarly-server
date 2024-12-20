import express, { NextFunction, Request, Response } from "express";
import { ProductControllers } from "./product.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../utils/fileUploader";
import validateRequest from "../../middlewares/validateRequest";
import { ProductValidations } from "./product.validation";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.VENDOR),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return ProductControllers.createProduct(req, res, next);
  }
);

router.post(
  "/duplicate",
  auth(UserRole.VENDOR),
  validateRequest(ProductValidations.duplicate),
  ProductControllers.duplicateProduct
);

router.patch(
  "/:id",
  auth(UserRole.VENDOR),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return ProductControllers.updateProduct(req, res, next);
  }
);

router.get("/:id", ProductControllers.getSingleProduct);

router.get("/", ProductControllers.getAllProducts);

router.delete("/:id", auth(UserRole.VENDOR), ProductControllers.deleteProduct);

export const ProductRoutes = router;
