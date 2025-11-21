const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with Caching for Serverless
let cachedDb = null;

const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dighali_reunion';

  try {
    const db = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000 // Fail fast if no connection
    });
    console.log('✅ MongoDB Connected');
    cachedDb = db;
    return db;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    throw err;
  }
};

// Ensure DB is connected for every request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Schema Definition
const RegistrationSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  student: {
    fullName: String,
    sscYear: Number,
    mobile: String,
    email: String,
    occupation: String,
    presentAddress: String,
    permanentAddress: String,
    isVolunteer: Boolean
  },
  ticket: {
    type: { type: String, enum: ['single', 'couple', 'family'] },
    price: Number,
    guests: Number,
    ticketId: String
  },
  payment: {
    method: String,
    amount: Number,
    fee: Number,
    total: Number,
    transactionId: String,
    senderNumber: String,
    timestamp: String
  },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submissionDate: { type: Date, default: Date.now }
});

// Check if model exists before compiling to avoid OverwriteModelError in hot-reload/serverless
const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);

// API Routes

// 1. Root test route
app.get('/api', (req, res) => {
  res.json({ message: "Dighali Reunion API is running" });
});

// 2. Get all registrations (Admin)
app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ submissionDate: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Create new registration
app.post('/api/registrations', async (req, res) => {
  try {
    const newReg = new Registration(req.body);
    const savedReg = await newReg.save();
    res.status(201).json(savedReg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Update status (Approve/Reject)
app.put('/api/registrations/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updatedReg = await Registration.findOneAndUpdate(
      { id: req.params.id },
      { status },
      { new: true }
    );
    if (!updatedReg) return res.status(404).json({ error: 'Registration not found' });
    res.json(updatedReg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Search/Check Status
app.post('/api/registrations/search', async (req, res) => {
  try {
    const { mobile, sscYear } = req.body;
    const reg = await Registration.findOne({ 
      'student.mobile': mobile, 
      'student.sscYear': Number(sscYear) 
    });
    
    if (!reg) return res.status(404).json({ message: 'Not found' });
    res.json(reg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;