import express from "express";
import { AdminControllers } from "./admin.controller";

const router = express.Router();

router.get("/:email", AdminControllers.getSingleAdmin);

export const AdminRoutes = router;
