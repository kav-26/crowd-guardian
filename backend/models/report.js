import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userEmail: String,
  placeId: Number,
  crowdPercent: Number,
  reportedAt: Date
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
