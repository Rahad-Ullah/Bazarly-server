import express from "express";
import { UserRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.route";
import { AdminRoutes } from "../modules/Admin/admin.route";
import { VendorRoutes } from "../modules/Vendor/vendor.route";
import { CustomerRoutes } from "../modules/Customer/customer.route";
import { ShopRoutes } from "../modules/Shop/shop.route";
import { CategoryRoutes } from "../modules/Category/category.route";
import { ProductRoutes } from "../modules/Product/product.route";
import { OrderRoutes } from "../modules/Order/order.route";
import { OrderItemRoutes } from "../modules/OrderItem/orderItem.route";
import { PaymentRoutes } from "../modules/Payment/payment.route";
import { CouponRoutes } from "../modules/Coupon/coupon.route";
import { ReviewRoutes } from "../modules/Review/review.route";
import { FollowedShopRoutes } from "../modules/FollowedShop/followedShop.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/admins",
    route: AdminRoutes,
  },
  {
    path: "/vendors",
    route: VendorRoutes,
  },
  {
    path: "/customers",
    route: CustomerRoutes,
  },
  {
    path: "/shops",
    route: ShopRoutes,
  },
  {
    path: "/categories",
    route: CategoryRoutes,
  },
  {
    path: "/products",
    route: ProductRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/order-items",
    route: OrderItemRoutes,
  },
  {
    path: "/payments",
    route: PaymentRoutes,
  },
  {
    path: "/coupons",
    route: CouponRoutes,
  },
  {
    path: "/reviews",
    route: ReviewRoutes,
  },
  {
    path: "/followed-shops",
    route: FollowedShopRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
