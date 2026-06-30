import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true }, // e.g. "10:00 AM"
  notes: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema);
