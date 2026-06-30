import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  isPublic: { type: Boolean, default: true }, // True for all users
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
