import express from "express";
import { getCrowdData, getWeather } from "../controllers/crowdController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCrowdData);
router.get("/weather", getWeather);
router.get("/protected", protect, (req, res) => {
  res.json({ message: "Protected data", user: req.user });
});

export default router;

