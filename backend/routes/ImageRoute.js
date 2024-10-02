import express from "express";
import { uploadImage } from "../controllers/ImageController.js";

const router = express.Router();
const v1 = express.Router();
v1.post("/upload-image", uploadImage);

router.use("/v1", v1);
export default router;
