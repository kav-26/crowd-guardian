import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import Place from '../models/place.js';

const router = express.Router();

// ✅ GET all places
router.get('/', async (req, res) => {
  try {
    const places = await Place.find();
    res.json({ success: true, data: places });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching places', error });
  }
});

// 🔍 SEARCH places by name or category (for dashboard search bar)
router.get('/search', verifyToken, async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({ success: false, message: 'No search query provided' });
    }

    const results = await Place.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },        // e.g. "Charminar"
        { category: { $regex: query, $options: 'i' } },    // e.g. "temple"
        { location: { $regex: query, $options: 'i' } }     // e.g. "Nampally"
      ]
    }).limit(15);

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ message: 'Error searching places', error });
  }
});

export default router;


