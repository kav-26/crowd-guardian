import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String },
  description: { type: String },
  lat: { type: Number },
  lng: { type: Number },
  crowdPercent: { type: Number },
});

const Place = mongoose.model("Place", placeSchema);
export default Place;
