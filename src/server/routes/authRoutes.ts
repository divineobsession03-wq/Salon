import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';

export const authRoutes = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-dev-only';

// Mock DB for when MONGO_URI is missing
let mockUsers: any[] = [{
  _id: 'admin-001',
  name: 'Director',
  email: 'admin@gmail.com',
  password: bcrypt.hashSync('admin123', 10),
  role: 'admin'
}];

authRoutes.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Admin is already seeded, new registrations are customers unless they are the very first Mongo user
    let isFirstUser = false;
    if (mongoose.connection.readyState === 1) {
       isFirstUser = await User.countDocuments() === 0;
    }
    const role = (isFirstUser || email === 'admin@gmail.com') ? 'admin' : 'customer';

    let user;
    if (mongoose.connection.readyState === 1) {
      user = new User({ name, email, password: hashedPassword, role });
      await user.save();
    } else {
      user = { _id: String(Date.now()), name, email, password: hashedPassword, role };
      mockUsers.push(user);
    }
    
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

authRoutes.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Auto-seed admin in MongoDB on first login attempt if it doesn't exist
    if (mongoose.connection.readyState === 1 && email === 'admin@gmail.com') {
       const exists = await User.findOne({ email: 'admin@gmail.com' });
       if (!exists) {
         await new User({
           name: 'Director',
           email: 'admin@gmail.com',
           password: await bcrypt.hash('admin123', 10),
           role: 'admin'
         }).save();
       }
    }

    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email });
    } else {
      user = mockUsers.find(u => u.email === email);
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

authRoutes.get('/all', authenticate, requireAdmin, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find({ role: 'customer' }).select('-password');
      res.json(users);
    } else {
      const customers = mockUsers.filter(u => u.role === 'customer').map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
      });
      res.json(customers);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
  }
});

authRoutes.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(req.user?.id).select('-password');
    } else {
      user = mockUsers.find(u => u._id === req.user?.id);
      if (user) {
        const { password, ...userWithoutPassword } = user;
        user = userWithoutPassword;
      }
    }
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user', error });
  }
});
