import { signUpPostRequestBodySchema } from "../validations/request.validations.js";
import { hashPasswordWithSalt } from "../utils/hash.js";
import { getUserByEmail, createUser } from "../services/user.service.js";

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
