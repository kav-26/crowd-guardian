import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  category: { type: String }, // e.g., temple, stadium, park
  crowdPercent: { type: Number },
  coordinates: {
    lat: Number,
    lng: Number,
  },
});

const Place = mongoose.model("Place", placeSchema);
export default Place;



