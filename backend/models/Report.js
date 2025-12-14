import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  name: { type: String },
  contact: { type: String }, // store phone and email together, e.g., "Phone: 1234567890 | Email: example@mail.com"
  location: { type: String },
  description: { type: String, required: true },
  imageUrl: { type: String }, // store a URL to uploaded image (S3/Cloudinary) or base64
  date: { type: String }, // e.g., "2025-10-21"
  time: { type: String }, // e.g., "14:30"
  status: { type: String, enum: ['OPEN','IN_PROGRESS','RESOLVED'], default: 'OPEN' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Report', reportSchema);
