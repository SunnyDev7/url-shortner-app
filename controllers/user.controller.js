import {
  signUpPostRequestBodySchema,
  logInPostRequestBodySchema,
} from "../validations/request.validations.js";
import { hashPasswordWithSalt } from "../utils/hash.js";
import { getUserByEmail, createUser } from "../services/user.service.js";
import { createUserToken } from "../utils/token.js";

export const signUp = async (req, res) => {
  const validationResult = await signUpPostRequestBodySchema.safeParseAsync(
    req.body,
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  const { firstname, lastname, email, password } = validationResult.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser)
    return res.status(400).json({ error: `User with ${email} already exists` });

  const { salt, password: hashedPassword } = hashPasswordWithSalt(password);

  const user = await createUser(
    firstname,
    lastname,
    email,
    hashedPassword,
    salt,
  );

  return res.status(201).json({ status: "success", data: { userId: user.id } });
};

export const logIn = async (req, res) => {
  const validationResult = await logInPostRequestBodySchema.safeParseAsync(
    req.body,
  );

  if (validationResult.error) {
    return res.status(400).json({ error: validationResult.error.format() });
  }

  const { email, password } = validationResult.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser)
    return res
      .status(400)
      .json({ error: `User with ${email} does not exists` });

  const salt = existingUser.salt;
  const existingHash = existingUser.password;

  const { password: hashedPassword } = hashPasswordWithSalt(password, salt);

  if (hashedPassword !== existingHash) {
    return res.status(401).json({ error: `Password is incorrect` });
  }

  const token = await createUserToken({ id: existingUser.id });

  return res.json({ status: "success", token });
};

export const getLoggedInUser = async (req, res) => {
  const user = req.user;

  if (!user) return res.status(400).json({ error: "User is not logged in" });

  return res.json({ user });
};
