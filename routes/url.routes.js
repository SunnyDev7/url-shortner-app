import express from "express";

import {
  handleUrlRequests,
  redirectToTargetUrl,
} from "../controllers/url.controller.js";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/shorten", ensureAuthenticated, handleUrlRequests);

router.get("/short/:shortCode", redirectToTargetUrl);

export default router;
