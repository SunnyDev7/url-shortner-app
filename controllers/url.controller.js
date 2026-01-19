import { nanoid } from "nanoid";

import { shortenPostRequestBodySchema } from "../validations/request.validations.js";
import { createUrl } from "../services/url.service.js";

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
