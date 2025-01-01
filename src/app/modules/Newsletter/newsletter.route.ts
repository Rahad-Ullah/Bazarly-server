import express from "express";
import { NewsletterControllers } from "./newsletter.controller";

const router = express.Router();

router.post("/create", NewsletterControllers.createNewsletter);
