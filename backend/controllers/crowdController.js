// Fake live crowd data handler
export const getCrowdData = (req, res) => {
  const crowdInfo = [
    { location: "Temple A", count: 120, timestamp: new Date() },
    { location: "Concert B", count: 450, timestamp: new Date() }
  ];
  res.json(crowdInfo);
};

// Example integration with external API (weather)
import axios from "axios";

export const getWeather = async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=28.6&longitude=77.2&current_weather=true`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Weather API failed" });
  }
};
