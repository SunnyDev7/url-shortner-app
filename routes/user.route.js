import express from "express";

import {
  signUp,
  logIn,
  getLoggedInUser,
} from "../controllers/user.controller.js";

import { authenticationMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/user", getLoggedInUser);

export default router;
