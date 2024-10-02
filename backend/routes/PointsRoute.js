import express from 'express';
import {
  createPoint,
  getPoints,
} from "../controllers/PointsController.js"; 

const router = express.Router();
const v1 = express.Router();

v1.post('/points', createPoint);
v1.get('/points', getPoints);

router.use("/v1", v1);
export default router;
