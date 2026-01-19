/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */

import { validateUserToken } from "../utils/token.js";

export function authenticationMiddleware(req, res, next) {
  const tokenHeader = req.headers["authorization"];

  if (!tokenHeader) return next();

  if (!tokenHeader.startsWith("Bearer")) {
    return res.status(400).json({ error: "Token must start with Bearer" });
  }

  const token = tokenHeader.split(" ")[1];

  const payload = validateUserToken(token);

  req.user = payload;

  next();
}
