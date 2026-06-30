import express from 'express';
import mongoose from 'mongoose';
import { Booking } from '../models/Booking.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';

export const bookingRoutes = express.Router();

let mockBookings: any[] = [];

// Get my bookings
bookingRoutes.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const bookings = await Booking.find({ user: req.user?.id }).populate('service');
      res.json(bookings);
    } else {
      const myBookings = mockBookings.filter(b => b.user === req.user?.id);
      res.json(myBookings);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
});

// Create booking
bookingRoutes.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { serviceId, date, timeSlot, notes } = req.body;
    
    // Check double booking
    if (mongoose.connection.readyState === 1) {
      const existing = await Booking.findOne({ date, timeSlot });
      if (existing) {
        return res.status(400).json({ message: 'Time slot already booked' });
      }
      const booking = new Booking({
        user: req.user?.id,
        service: serviceId,
        date,
        timeSlot,
        notes
      });
      await booking.save();
      res.status(201).json(booking);
    } else {
      const existing = mockBookings.find(b => String(b.date) === String(date) && b.timeSlot === timeSlot);
      if (existing) {
        return res.status(400).json({ message: 'Time slot already booked' });
      }
      const booking = {
        _id: String(Date.now()),
        user: req.user?.id,
        service: { _id: serviceId, name: 'Service Name' }, // Mock populated service
        date,
        timeSlot,
        notes,
        status: 'pending'
      };
      mockBookings.push(booking);
      res.status(201).json(booking);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error });
  }
});

// Admin: Get all bookings
bookingRoutes.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const bookings = await Booking.find().populate('user').populate('service').sort({ date: 1 });
      res.json(bookings);
    } else {
      res.json(mockBookings);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all bookings', error });
  }
});

// Admin: Update status
bookingRoutes.patch('/:id/status', authenticate, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (mongoose.connection.readyState === 1) {
      const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true });
      res.json(booking);
    } else {
      const booking = mockBookings.find(b => b._id === req.params.id);
      if (booking) booking.status = status;
      res.json(booking);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error });
  }
});
