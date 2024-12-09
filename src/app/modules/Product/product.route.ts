import express, { NextFunction, Request, Response } from "express";
import { ProductControllers } from "./product.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../utils/fileUploader";

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

export const ProductRoutes = router;
