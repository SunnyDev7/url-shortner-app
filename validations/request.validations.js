import { z } from "zod";

export const signUpPostRequestBodySchema = z.object({
  firstname: z.string(),
  lastname: z.string().optional(),
  email: z.email(),
  password: z.string().min(3),
});

export const logInPostRequestBodySchema = z.object({
  email: z.email(),
  password: z.string().min(3),
});
