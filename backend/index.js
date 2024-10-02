import path from 'path';
import { fileURLToPath } from 'url';
import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
// Routes import
import CsvRoute from './routes/CsvRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import PointsRoute from './routes/PointsRoute.js';
import UserRoute from './routes/UserRoute.js';
import ImageRoute from './routes/ImageRoute.js';
import RoleRoute from './routes/RoleRoute.js';

import GeoDataModel from './models/GeoDataModel.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Setup mongoose connection
mongoose.connect('mongodb://localhost:27017/stressmap_db', {
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log("Connected to MongoDB successfully!");
});

// Routes
app.use('/api', CsvRoute);
app.use('/api', PointsRoute);
app.use('/api', UserRoute);
app.use('/api', AuthRoute);
app.use('/api', ImageRoute);
app.use('/api', RoleRoute);

// API endpoint to store GeoJSON data
app.post('/api/v1/geodata', async (req, res) => {
  try {
    const geoData = new GeoDataModel(req.body); // GeoJSON data from the request body
    await geoData.save();
    res.status(201).json({ message: 'GeoJSON data saved successfully!' });
  } catch (error) {
    res.status(400).json({ error: 'Error saving GeoJSON data', details: error });
  }
});

app.listen(5002, () => {
  console.log('Server up and running on port 5002...');
});
