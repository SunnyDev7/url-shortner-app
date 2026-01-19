import express from "express";

import { handleUrlRequests } from "../controllers/url.controller.js";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/shorten", ensureAuthenticated, handleUrlRequests);

export default router;
