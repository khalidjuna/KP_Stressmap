import express from "express";
import {
  addUser,
  deleteUser,
  getUsers,
  getUserById,
  updateUser,
} from "../controllers/UserController.js";
import authUser from "../middleware/authUser.js";

const router = express.Router();
const v1 = express.Router();

v1.post("/users", addUser);
v1.get("/users", getUsers);
v1.get("/user/:id", getUserById);
v1.delete("/user/:id", deleteUser);
v1.put("/user/:id", updateUser);

v1.get("/users/profile", authUser, (req, res) => {
  const userId = req.user.id; // assuming user ID is stored in the token
  User.findById(userId)
    .then((user) => res.json(user))
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.use("/v1", v1);
export default router;
