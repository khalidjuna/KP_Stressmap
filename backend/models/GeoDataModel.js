// models/GeoDataModel.js
import mongoose from 'mongoose';

const geoDataSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['FeatureCollection'],
    required: true
  },
  features: [
    {
      type: {
        type: String,
        enum: ['Feature'],
        required: true
      },
      geometry: {
        type: {
          type: String,
          enum: ['Point', 'LineString', 'Polygon', 'MultiPolygon'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
      properties: {
        type: Object,
        required: false
      }
    }
  ]
});

export default mongoose.model('GeoData', geoDataSchema); // Use export default for ES6
