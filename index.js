import express from "express";
import jwt from "jsonwebtoken";

import userRoutes from "./routes/user.route.js";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());

app.get("/", (req, res) => {
  return res.json({ status: "Server is up and running" });
});

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server up on ${PORT}`);
});
