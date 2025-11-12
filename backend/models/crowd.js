// models/Location.js
const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: '' },    // temple, park, station...
  crowdPercent: { type: Number, default: 0 },  // 0-100
  description: { type: String, default: '' },
  lat: Number,
  lng: Number,
  images: [String],
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Location', LocationSchema);
