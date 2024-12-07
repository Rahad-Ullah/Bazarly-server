import express, { NextFunction, Request, Response } from "express";
import { ShopControllers } from "./shop.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../utils/fileUploader";

const router = express.Router();

// get all shops
router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ShopControllers.getAllShops
);

// get single shop by shopId
router.get(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VENDOR),
  ShopControllers.getSingleShop
);

// get all shops of a vendor
router.get(
  "/vendor-shops/:vendorId",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.VENDOR),
  ShopControllers.getVendorShops
);

// create a new shop
router.post(
  "/create",
  auth(UserRole.VENDOR),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return ShopControllers.createShop(req, res, next);
  }
);

// update shop
router.patch(
  "/:id",
  auth(UserRole.VENDOR),
  fileUploader.upload.single("file"),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    return ShopControllers.updateShop(req, res, next);
  }
);

// change shop status
// router.patch(
//     "/change-status/:id",
//     auth(UserRole.SUPER_ADMIN, UserRole.ADMIN), ShopControllers.
// );

// delete shop
router.delete(
    "/:id",
    auth(UserRole.VENDOR), ShopControllers.deleteShop
);

export const ShopRoutes = router;
