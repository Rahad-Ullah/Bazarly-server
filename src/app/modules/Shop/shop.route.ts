import express, { NextFunction, Request, Response } from "express";
import { ShopControllers } from "./shop.controller";
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
    return ShopControllers.createShop(req, res, next);
  }
);

export const ShopRoutes = router;
