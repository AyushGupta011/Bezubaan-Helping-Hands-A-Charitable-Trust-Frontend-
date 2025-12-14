import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  role: {
    type: String,
   required: [true, 'Please select a role'],
    enum: ['feeding', 'rescue','fundraising', 'awareness'], 
    // <-- add the roles you provide in your select dropdown
    message: 'Please select a valid role'
  },
  availability: {
    type: String,
       required: [true, 'Please fill your availability']
  },
  message: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Volunteer', volunteerSchema);
