import { eq, and } from "drizzle-orm";

import { db } from "../db/index.js";
import { urlsTable } from "../models/index.js";

export async function createUrl(url, shortCode, userId) {
  const [result] = await db
    .insert(urlsTable)
    .values({
      shortCode: shortCode,
      targetURL: url,
      userId: userId,
    })
    .returning({
      id: urlsTable.id,
      shortCode: urlsTable.shortCode,
      targetURL: urlsTable.targetURL,
    });

  return result;
}

export async function createRedirection(code) {
  const [result] = await db
    .select({ targetURL: urlsTable.targetURL })
    .from(urlsTable)
    .where(eq(urlsTable.shortCode, code));

  return result;
}

export async function getUrls(userId) {
  const codes = await db
    .select({
      id: urlsTable.id,
      targetURL: urlsTable.targetURL,
      shortCode: urlsTable.shortCode,
    })
    .from(urlsTable)
    .where(eq(urlsTable.userId, userId));

  return codes;
}

export async function updateUrl(id, userId, code, url) {
  const [result] = await db
    .update(urlsTable)
    .set({ shortCode: code, targetURL: url })
    .where(and(eq(urlsTable.id, id), eq(urlsTable.userId, userId)))
    .returning({
      targetURL: urlsTable.targetURL,
      shortCode: urlsTable.shortCode,
    });

  return result;
}

export async function deleteUrl(id, userId) {
  const result = await db
    .delete(urlsTable)
    .where(and(eq(urlsTable.id, id), eq(urlsTable.userId, userId)));

  return result;
}
