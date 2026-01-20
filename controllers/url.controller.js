import { nanoid } from "nanoid";

import { shortenPostRequestBodySchema } from "../validations/request.validations.js";
import {
  createUrl,
  createRedirection,
  getUrls,
  updateUrl,
  deleteUrl,
} from "../services/url.service.js";

export const handleUrlRequests = async (req, res) => {
  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(
    req.body,
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  const { url, code } = validationResult.data;

  const shortCode = code ?? nanoid(6);

  const userId = req.user.id;

  const result = await createUrl(url, shortCode, userId);

  return res.status(201).json({
    id: result.id,
    shortCode: result.shortCode,
    targetURL: result.targetURL,
  });
};

export const redirectToTargetUrl = async (req, res) => {
  const code = req.params.shortCode;

  const result = await createRedirection(code);

  if (!result) {
    return res.status(404).json({ error: "Invalid URL" });
  }

  return res.redirect(result.targetURL);
};

export const getUrlsofLoggedInUser = async (req, res) => {
  const userId = req.user.id;

  const codes = await getUrls(userId);

  return res.json({ codes });
};

export const updateUrlofUser = async (req, res) => {
  const validationResult = await shortenPostRequestBodySchema.safeParseAsync(
    req.body,
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  const { url, code } = validationResult.data;

  const id = req.params.id;
  const userId = req.user.id;

  const result = await updateUrl(id, userId, code, url);

  res.status(201).json({ status: "success", updated: { result } });
};

export const deleteUrlofUser = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  const result = await deleteUrl(id, userId);

  res.status(200).json({ deleted: true });
};
