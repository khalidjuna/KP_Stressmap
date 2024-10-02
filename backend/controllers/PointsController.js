import { StatusCodes } from "http-status-codes";
import *as Point from "../models/PointsModel.js";

// Fungsi untuk membuat titik baru
export async function createPoint(req, res) {
  const { x, y, ratio, orientation } = req.body;

  try {
    const newPoint = new PointModel({
      x,
      y,
      ratio,
      orientation,
    });

    const savedPoint = await newPoint.save();
    res.status(StatusCodes.CREATED).json(savedPoint);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error creating point: ${error.message}` });
  }
}

export async function getPoints(req, res) {
  try {
    const points = await Point.getAllPoints();
    res.status(StatusCodes.OK).json(points);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: `Error retrieving points: ${error.message}` });
  }
}


