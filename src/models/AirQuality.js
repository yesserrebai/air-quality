import mongoose from 'mongoose';

const airQualitySchema = new mongoose.Schema({
  ts: {
    type: String,
    unique: true,
  },
  aqius: Number,
  mainus: String,
  aqicn: Number,
  maincn: String,
});
export default mongoose.model('Air-Quality', airQualitySchema);
