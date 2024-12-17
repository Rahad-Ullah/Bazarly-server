import express from "express";
import { FollowedShopControllers } from "./followedShop.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

// get user followed shops
router.get(
  "/",
  auth(UserRole.CUSTOMER),
  FollowedShopControllers.getUserFollowedShops
);

// get shop follwers
router.get(
  "/followers/:shopId",
  auth(UserRole.CUSTOMER, UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  FollowedShopControllers.getShopFollowers
);

router.post(
  "/follow",
  auth(UserRole.CUSTOMER),
  FollowedShopControllers.followShop
);

router.delete(
  "/unfollow",
  auth(UserRole.CUSTOMER),
  FollowedShopControllers.unFollowShop
);

export const FollowedShopRoutes = router;
