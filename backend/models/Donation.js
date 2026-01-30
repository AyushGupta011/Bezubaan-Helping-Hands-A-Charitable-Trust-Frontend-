import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  message: { type: String },
  orderId: { type: String },
  paymentId: { type: String },
  transactionId: { type: String },
  paymentStatus: { type: String, enum: ['PENDING','SUCCESS','FAILED'], default: 'PENDING' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Donation', donationSchema);
