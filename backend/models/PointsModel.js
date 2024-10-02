import mongoose from "mongoose";

const Model = mongoose.model(
  "points",
  new mongoose.Schema({
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    ratio: {
      type: Number,
      required: true,
    },
    orientation: {
      type: Number,
      required: true,
    },
  })
);

export { Model };

export async function createNew({ x, y, ratio, orientation }) {
  const newPoint = new Model({ x, y, ratio, orientation });
  try {
    const savedPoint = await newPoint.save();
    return savedPoint;
  } catch (error) {
    throw new Error(`Error creating point: ${error.message}`);
  }
}

export async function getAllPoints() {
  try {
    const points = await Model.find();
    return points;
  } catch (error) {
    throw new Error(`Error getting points: ${error.message}`);
  }
}

export async function insertMany(points) {
  try {
    const savedPoints = await Model.insertMany(points);
    return savedPoints;
  } catch (error) {
    throw new Error(`Error inserting points: ${error.message}`);
  }
}
