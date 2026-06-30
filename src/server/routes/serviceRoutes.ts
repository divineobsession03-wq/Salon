import express from 'express';
import mongoose from 'mongoose';
import { Service } from '../models/Service.js';
import { authenticate, requireAdmin } from '../middleware/auth.js';

export const serviceRoutes = express.Router();

let mockServices = [
  { _id: '1', name: 'Luxury Haircut', description: 'Premium haircut with wash and styling.', duration: 60, price: 1500, category: 'Hair' },
  { _id: '2', name: 'Bridal Makeup', description: 'Complete bridal makeup package.', duration: 180, price: 15000, category: 'Makeup' },
  { _id: '3', name: 'Keratin Treatment', description: 'Smooth and shiny hair treatment.', duration: 120, price: 5000, category: 'Hair' },
];

serviceRoutes.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const services = await Service.find();
      res.json(services);
    } else {
      res.json(mockServices);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error });
  }
});

serviceRoutes.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const service = new Service(req.body);
      await service.save();
      res.status(201).json(service);
    } else {
      const newService = { _id: String(Date.now()), ...req.body };
      mockServices.push(newService);
      res.status(201).json(newService);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error });
  }
});

// Mock updates/deletes omitted for brevity, but they should be added if possible.
