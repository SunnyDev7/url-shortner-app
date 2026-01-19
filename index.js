import express from "express";

import userRoutes from "./routes/user.route.js";
import { authenticationMiddleware } from "./middlewares/auth.middleware.js";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ status: "Server is up and running" });
});

app.use(authenticationMiddleware);

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server up on ${PORT}`);
});
