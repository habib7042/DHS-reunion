
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
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

  const MONGO_URI = process.env.MONGO_URI;

  if (!MONGO_URI) {
    if (process.env.NODE_ENV === 'production') {
      const errorMsg = "❌ FATAL: MONGO_URI is missing. Go to Vercel Settings > Environment Variables.";
      console.error(errorMsg);
      throw new Error(errorMsg);
    }
    console.log("⚠️  MONGO_URI not found. Using local fallback.");
  }

  const connectionString = MONGO_URI || 'mongodb://localhost:27017/dighali_reunion';

  try {
    const db = await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 5000 
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
  // Skip DB connection for AI routes to speed them up
  if (req.path.startsWith('/api/chat') || req.path.startsWith('/api/nostalgia') || req.path.startsWith('/api/memories/refine')) {
    return next();
  }

  try {
    await connectToDatabase();
    next();
  } catch (error) {
    console.error("Database Middleware Error:", error);
    res.status(500).json({ 
      error: 'Database connection failed', 
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
});

// --- GEMINI AI SETUP ---
const apiKey = process.env.API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// --- AI ROUTES ---

// 1. Nostalgia Generator Endpoint
app.post('/api/nostalgia', async (req, res) => {
  if (!ai) return res.status(503).json({ error: "AI Service Unavailable (Missing Key)" });

  const { year } = req.body;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate 3 short nostalgic facts for the year ${year} specifically relevant to a high school student in that era (globally or South Asia context). Return exactly three fields: a major event, a popular song, and a popular movie.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            fact: { type: "STRING", description: "A significant historical or cultural event from that year." },
            song: { type: "STRING", description: "A hit song title and artist from that year." },
            movie: { type: "STRING", description: "A popular movie title from that year." }
          },
          required: ["fact", "song", "movie"]
        }
      }
    });

    const text = response.text || JSON.stringify(response);
    const data = typeof text === 'string' ? JSON.parse(text) : text;
    
    res.json(data);
  } catch (error) {
    console.error("AI Nostalgia Error:", error);
    res.status(500).json({ error: "Failed to generate content" });
  }
});

// 2. Chat Assistant Endpoint
app.post('/api/chat', async (req, res) => {
  if (!ai) return res.status(503).json({ error: "AI Service Unavailable" });

  const { message, history } = req.body;

  const systemPrompt = `
    You are "Habib", a helpful and friendly AI assistant for the Dighali High School Reunion 2026.
    Event Details: 97th Anniversary, 2 Days after Eid-ul-Fitr 2026, Dighali High School.
    Registration: Register -> Select Ticket -> Pay -> Wait for Approval -> Download Card.
    Ticket Prices: Single (1000), Couple (1800), Family (3000).
    Support: m.me/habib.ahsan0.
  `;

  try {
    const chat = ai.chats.create({
      model: "gemini-2.5-flash",
      config: { systemInstruction: systemPrompt },
      history: history || []
    });

    const result = await chat.sendMessage({ message });
    res.json({ text: result.text });
  } catch (error) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: "Failed to get response" });
  }
});

// 3. Refine Memory Text (AI)
app.post('/api/memories/refine', async (req, res) => {
  if (!ai) return res.status(503).json({ error: "AI Service Unavailable" });
  
  const { text } = req.body;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Fix grammar and polish this short memory text for a school reunion wall (keep it concise and emotional, max 50 words). Just return the refined text string. Text: "${text}"`,
    });
    res.json({ text: response.text });
  } catch (error) {
    console.error("AI Refine Error:", error);
    res.status(500).json({ error: "Failed to refine text" });
  }
});


// --- DB SCHEMA ---
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

const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);

const MemorySchema = new mongoose.Schema({
  studentName: String,
  sscYear: Number,
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const Memory = mongoose.models.Memory || mongoose.model('Memory', MemorySchema);


// --- CRUD ROUTES ---

app.get('/api', (req, res) => {
  res.json({ 
    message: "Dighali Reunion API is running", 
    environment: process.env.NODE_ENV
  });
});

// --- REGISTRATION ROUTES ---
app.get('/api/registrations', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ submissionDate: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/registrations', async (req, res) => {
  try {
    const newReg = new Registration(req.body);
    const savedReg = await newReg.save();
    res.status(201).json(savedReg);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

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

// --- MEMORY ROUTES ---

app.get('/api/memories', async (req, res) => {
  try {
    const memories = await Memory.find().sort({ timestamp: -1 });
    res.json(memories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/memories', async (req, res) => {
  try {
    const newMemory = new Memory(req.body);
    await newMemory.save();
    res.status(201).json(newMemory);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/memories/verify', async (req, res) => {
  try {
    const { mobile, sscYear } = req.body;
    // Look for approved registration
    const reg = await Registration.findOne({
      'student.mobile': mobile,
      'student.sscYear': Number(sscYear),
      status: 'approved'
    });

    if (!reg) {
      // Check if pending exists
      const pending = await Registration.findOne({
        'student.mobile': mobile,
        'student.sscYear': Number(sscYear)
      });
      if (pending) {
        return res.status(403).json({ error: "Your registration is still pending approval." });
      }
      return res.status(404).json({ error: "No approved registration found. Please register first." });
    }

    res.json({
      verified: true,
      studentName: reg.student.fullName,
      sscYear: reg.student.sscYear
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = app;
