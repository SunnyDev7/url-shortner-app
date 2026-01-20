import express from "express";

import {
  handleUrlRequests,
  redirectToTargetUrl,
  getUrlsofLoggedInUser,
  deleteUrlofUser,
} from "../controllers/url.controller.js";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/shorten", ensureAuthenticated, handleUrlRequests);

router.get("/short/:shortCode", redirectToTargetUrl);

router.get("/urls", ensureAuthenticated, getUrlsofLoggedInUser);

router.delete("/:id", ensureAuthenticated, deleteUrlofUser);

export default router;
