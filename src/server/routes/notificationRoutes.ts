import express from 'express';
import mongoose from 'mongoose';
import { Notification } from '../models/Notification.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

export const notificationRoutes = express.Router();

let mockNotifications = [
  { _id: '1', title: 'Welcome!', message: 'Welcome to Heenuvanshii Salon Studio.', isPublic: true, createdAt: new Date() }
];

notificationRoutes.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const notifications = await Notification.find().sort({ createdAt: -1 });
      res.json(notifications);
    } else {
      res.json(mockNotifications);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
});

notificationRoutes.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { title, message } = req.body;
    if (mongoose.connection.readyState === 1) {
      const notification = new Notification({ title, message, isPublic: true });
      await notification.save();
      res.status(201).json(notification);
    } else {
      const newNotification = { _id: String(Date.now()), title, message, isPublic: true, createdAt: new Date() };
      mockNotifications.unshift(newNotification);
      res.status(201).json(newNotification);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error });
  }
});

notificationRoutes.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      await Notification.findByIdAndDelete(req.params.id);
      res.json({ message: 'Deleted successfully' });
    } else {
      mockNotifications = mockNotifications.filter(n => n._id !== req.params.id);
      res.json({ message: 'Deleted successfully' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting notification', error });
  }
});
