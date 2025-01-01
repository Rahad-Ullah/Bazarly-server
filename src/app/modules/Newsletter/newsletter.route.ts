import express from "express";
import { NewsletterControllers } from "./newsletter.controller";
import validateRequest from "../../middlewares/validateRequest";
import { NewsletterValidations } from "./newsletter.validation";

const router = express.Router();

router.post(
  "/create",
  validateRequest(NewsletterValidations.create),
  NewsletterControllers.createNewsletter
);

router.get("/", NewsletterControllers.getAllNewsletters);

export const NewsletterRoutes = router;