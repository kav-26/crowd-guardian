// seed.js
import mongoose from 'mongoose';
import Place from './models/place.js';
import dotenv from 'dotenv';
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const places = [
  { name: "Charminar", category: "Historical", lat: 17.3616, lng: 78.4747, crowdPercent: 75, description: "Peak in evenings" },
  { name: "Hitech City", category: "IT Hub", lat: 17.4479, lng: 78.3800, crowdPercent: 40, description: "Moderate crowd" },
  { name: "Birla Mandir", category: "Temple", lat: 17.4065, lng: 78.4691, crowdPercent: 60, description: "Good in mornings" },
  { name: "Ramoji Film City", category: "Entertainment", lat: 17.2540, lng: 78.5622, crowdPercent: 50, description: "Tourists frequent" },
  { name: "Hussain Sagar", category: "Lake", lat: 17.4239, lng: 78.4738, crowdPercent: 30, description: "Calm area" },
  { name: "Gachibowli Stadium", category: "Stadium", lat: 17.4300, lng: 78.3500, crowdPercent: 70, description: "Sports events popular" },
  { name: "Salar Jung Museum", category: "Museum", lat: 17.3612, lng: 78.4744, crowdPercent: 35, description: "Moderate visitors" },
  { name: "Shilparamam", category: "Cultural Village", lat: 17.4423, lng: 78.4488, crowdPercent: 25, description: "Crafts and exhibitions" }
];

await Place.insertMany(places);
console.log('✅ Hyderabad places added!');
process.exit();
