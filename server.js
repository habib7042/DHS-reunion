
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// Replace 'process.env.MONGO_URI' with your actual connection string if not using .env
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dighali_reunion';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

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

const Registration = mongoose.model('Registration', RegistrationSchema);

// API Routes

// 1. Get all registrations (Admin)
app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ submissionDate: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Create new registration
app.post('/api/registrations', async (req, res) => {
  try {
    const newReg = new Registration(req.body);
    const savedReg = await newReg.save();
    res.status(201).json(savedReg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Update status (Approve/Reject)
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

// 4. Search/Check Status
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
