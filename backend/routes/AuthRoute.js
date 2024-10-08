import express from "express";
import bcrypt from "bcryptjs";
import {
  register,
  login,
  init,
  logout,
} from "../controllers/AuthController.js";
import useToken from "../middleware/useToken.js";
import { canAccess } from "../middleware/canAccess.js";

const router = express.Router();
const v1 = express.Router();

v1.get("/ping", (_, res) => res.json({ message: "OK" }));
v1.get("/encrypt/:value", async (req, res) =>
  res.json({ encrypted: await bcrypt.hash(req.params.value, 10) })
);

v1.post("/register", register);
v1.post("/login", login);
v1.get("/init", useToken, canAccess(["Super Admin", "Admin", "User"]), init);
v1.delete("/logout", useToken, logout);

router.use("/auth/v1", v1);
export default router;
