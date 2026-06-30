import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true }, // in minutes
  price: { type: Number, required: true },
  images: [{ type: String }], // Array of URLs or paths
  category: { type: String },
}, { timestamps: true });

export const Service = mongoose.model('Service', serviceSchema);
