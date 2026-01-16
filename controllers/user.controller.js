import { eq } from "drizzle-orm";
import { randomBytes, createHmac } from "node:crypto";

import db from "../db/index.js";
import { usersTable } from "../models/user.model.js";

export const signUp = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  const [existingUser] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existingUser)
    return res.status(400).json({ error: `User with ${email} already exists` });

  const salt = randomBytes(256).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  const [user] = await db
    .insert(usersTable)
    .values({ firstname, lastname, email, password: hashedPassword, salt })
    .returning({ id: usersTable.id });

  return res.status(201).json({ status: "success", data: { userId: user.id } });
};
