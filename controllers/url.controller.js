import { nanoid } from "nanoid";

import { db } from "../db/index.js";
import { urlsTable } from "../models/index.js";

import { shortenPostRequestBodySchema } from "../validations/request.validations.js";
import { createUrl } from "../services/url.service.js";
import { and, eq } from "drizzle-orm";

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

  const [result] = await db
    .select({ targetURL: urlsTable.targetURL })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, code));

  if (!result) {
    return res.status(404).json({ error: "Invalid URL" });
  }

  return res.redirect(result.targetURL);
};

export const getUrlsofLoggedInUser = async (req, res) => {
  const codes = await db
    .select({
      id: urlsTable.id,
      targetURL: urlsTable.targetURL,
      shortCode: urlsTable.shortCode,
    })
    .from(urlsTable)
    .where(eq(urlsTable.userId, req.user.id));

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

  const [result] = await db
    .update(urlsTable)
    .set({ shortCode: code, targetURL: url })
    .where(and(eq(urlsTable.id, id), eq(urlsTable.userId, req.user.id)))
    .returning({
      targetURL: urlsTable.targetURL,
      shortCode: urlsTable.shortCode,
    });

  res.status(201).json({ status: "success", updated: { result } });
};

export const deleteUrlofUser = async (req, res) => {
  const id = req.params.id;
  const result = await db
    .delete(urlsTable)
    .where(and(eq(urlsTable.id, id), eq(urlsTable.userId, req.user.id)));

  res.status(200).json({ deleted: true });
};
