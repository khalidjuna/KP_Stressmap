import express from "express";
import { addRole, getRoles, deleteRole } from "../controllers/RolesController.js";

const router = express.Router();
const v1 = express.Router();

v1.post("/roles", addRole);
v1.get("/roles", getRoles);
v1.delete("/roles/:id", deleteRole);

router.use("/v1", v1);
export default router;