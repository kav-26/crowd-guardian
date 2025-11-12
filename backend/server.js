import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from './models/user.js';
import Place from './models/place.js';
import Report from './models/report.js';
import placeRoutes from './routes/places.js';
import { verifyToken } from './middleware/auth.js';
import connectDB from "./db.js";


dotenv.config();
dotenv.config({ path: "./backend/.env" }); 
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/places", placeRoutes);



// --- JWT Secret ---
const JWT_SECRET = process.env.JWT_SECRET || 'mysecretkey';

// --- Registration Route ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.json({ message: 'Registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- Login Route ---
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password' });

    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// --- JWT Middleware ---
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// --- Chart Data Route ---
app.get('/api/chart-data', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    jwt.verify(token, JWT_SECRET);

    const data = {
      labels: ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM'],
      datasets: [
        { label: 'Charminar', data: [40, 60, 80, 70, 50, 30], borderColor: '#FF5733', fill: true },
        { label: 'Birla Mandir', data: [10, 30, 50, 40, 30, 20], borderColor: '#33C3FF', fill: true },
        { label: 'Hussain Sagar', data: [20, 40, 60, 80, 60, 40], borderColor: '#75FF33', fill: true },
        { label: 'Lumbini Park', data: [5, 15, 25, 30, 20, 10], borderColor: '#C70039', fill: true },
        { label: 'Gachibowli Stadium', data: [15, 35, 55, 75, 90, 60], borderColor: '#FFC300', fill: true }
      ]
    };

    res.json(data);
  } catch (err) {
    console.error('JWT verification failed:', err);
    res.status(403).json({ message: 'Invalid token' });
  }
});

// --- Report Crowd ---
app.post('/api/report', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const { placeId, crowdPercent } = req.body;

    if (!placeId || crowdPercent === undefined)
      return res.status(400).json({ message: 'Place ID and crowd percent required' });

    const report = new Report({
      userEmail: decoded.email,
      placeId,
      crowdPercent,
      reportedAt: new Date()
    });

    await report.save();
    res.json({ message: 'Report saved successfully', report });
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
});

// --- Hyderabad Default Places ---
const defaultPlaces = [
  { id: 1, name: "Charminar", lat: 17.3616, lng: 78.4747, category: "Monument", description: "Historic site, crowded evenings." },
  { id: 2, name: "Birla Mandir", lat: 17.4062, lng: 78.4691, category: "Temple", description: "Peaceful mornings." },
  { id: 3, name: "Hussain Sagar Lake", lat: 17.4239, lng: 78.4738, category: "Lake", description: "Busy weekends." },
  { id: 4, name: "Gachibowli Stadium", lat: 17.4401, lng: 78.3489, category: "Stadium", description: "Crowded during events." },
  { id: 5, name: "Lumbini Park", lat: 17.4156, lng: 78.4747, category: "Park", description: "Relaxed evenings." }
];

// --- Dynamic Places API ---
app.get('/api/places', async (req, res) => {
  try {
    const places = await Place.find();
    if (!places.length) {
      const updated = defaultPlaces.map(p => ({
        ...p,
        crowdPercent: Math.floor(Math.random() * 100)
      }));
      return res.json(updated);
    }

    const latestReports = await Report.aggregate([
      { $sort: { createdAt: -1 } },
      { $group: { _id: "$placeId", latestCrowd: { $first: "$crowdPercent" } } }
    ]);

    const placeData = places.map(p => {
      const report = latestReports.find(r => String(r._id) === String(p._id));
      return {
        id: p._id,
        name: p.name,
        lat: p.lat,
        lng: p.lng,
        category: p.category,
        description: p.description,
        crowdPercent: report ? report.latestCrowd : Math.floor(Math.random() * 100)
      };
    });

    res.json(placeData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching places" });
  }
});

// --- Auto-update crowd levels ---
async function updateCrowdLevels() {
  try {
    const places = await Place.find();
    for (const place of places) {
      const randomCrowd = Math.floor(Math.random() * 101);
      place.crowdPercent = randomCrowd;
      await place.save();
    }
    console.log('🟢 Crowd levels updated dynamically');
  } catch (err) {
    console.error('⚠️ Error updating crowd levels:', err.message);
  }
}

setInterval(updateCrowdLevels, 30000);

// --- Search Places API ---
app.get('/api/places/search', async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) {
      return res.status(400).json({ message: "Search query required" });
    }

    // Find matching places in the database (case-insensitive)
    const places = await Place.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ]
    });

    // If no DB data, fallback to defaultPlaces
    if (!places.length) {
      const filteredDefaults = defaultPlaces.filter(
        p =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      );

      return res.json(filteredDefaults);
    }

    res.json(places);
  } catch (err) {
    console.error("Error searching places:", err);
    res.status(500).json({ message: "Server error during search" });
  }
});

// --- Update Crowd Level ---
app.post("/api/crowd/update", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { placeId, crowdLevel } = req.body;

    if (!placeId || !crowdLevel)
      return res.status(400).json({ message: "placeId and crowdLevel are required" });

    let crowdPercent = 0;
    if (crowdLevel === "low") crowdPercent = 30;
    else if (crowdLevel === "medium") crowdPercent = 60;
    else if (crowdLevel === "high") crowdPercent = 90;

    const updated = await Place.findByIdAndUpdate(
      placeId,
      { crowdPercent },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Place not found" });

    res.json({ message: "Crowd level updated successfully", updated });
  } catch (err) {
    console.error("Error updating crowd:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// --- Fetch All Crowd Data for Dashboard ---
app.get("/api/dashboard/data", async (req, res) => {
  try {
    const places = await Place.find({});
    const summary = {
      totalPlaces: places.length,
      avgCrowd:
        places.length > 0
          ? Math.round(
              places.reduce((sum, p) => sum + (p.crowdPercent || 0), 0) / places.length
            )
          : 0,
      highCrowd: places.filter(p => p.crowdPercent > 70).length,
      mediumCrowd: places.filter(p => p.crowdPercent >= 40 && p.crowdPercent <= 70).length,
      lowCrowd: places.filter(p => p.crowdPercent < 40).length,
      places,
    };
    res.json(summary);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.patch("/api/places/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const { crowdPercent } = req.body;

    const updated = await Place.findOneAndUpdate(
      { name },
      { crowdPercent },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Place not found" });

    res.json({ message: "Crowd updated successfully", place: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});








// --- Start Server ---
const PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
});


