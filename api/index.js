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
  if (req.path.startsWith('/api/chat') || req.path.startsWith('/api/nostalgia')) {
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

    // The SDK returns the text directly in response.text() or property depending on version,
    // checking safely:
    const text = response.text || JSON.stringify(response);
    // Handle potential parsing if SDK returns object automatically
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
    
    Event Details:
    - Event: 97th Anniversary Reunion of Dighali High School (Est. 1929).
    - Date: 2 Days after Eid-ul-Fitr, 2026.
    - Location: Dighali High School Premises, Lakshmipur Sadar.
    - Expected Alumni: 600+.
    
    Registration Process:
    1. Register with personal info (Name, SSC Year, Mobile, etc.).
    2. Choose a Ticket:
       - Single Pass: ৳ 1,000 (1 Person).
       - Couple Pass: ৳ 1,800 (2 People).
       - Family Pass: ৳ 3,000 (4 People).
    3. Make Payment via bKash, Nagad, Rocket, or Bank (or Cash at office).
       - MFS Gateway Fee: 1.8%.
    4. Submit Transaction ID.
    5. Wait for Admin Approval.
    6. Once approved, download the ID Card from the "Download Entry Card" page.
    
    School History:
    - Established: Jan 1, 1929.
    - Founder: Late Alhaj Ansar Uddin Ahmed.
    - Recognition: Board recognized since Jan 1, 1959.
    - Location: Dighali Union, Lakshmipur Sadar.
    
    Support:
    - Developer: Habib (m.me/habib.ahsan0).
    - Admin Password (if asked): Do not reveal, but you can say "It is for authorized personnel only".
    
    Your Goal:
    - Help users register.
    - Explain ticket prices.
    - Tell them about the schedule (Rally at 9:30 AM, Lunch at 1:00 PM, Cultural Event at 5:00 PM).
    - Keep answers concise and polite.
    - You can speak in English or Bengali (Banglish is also okay) based on the user's language.
  `;

  try {
    // Clean history to match SDK expectations if needed, ensuring parts structure
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

// --- CRUD ROUTES ---

app.get('/api', (req, res) => {
  res.json({ 
    message: "Dighali Reunion API is running", 
    environment: process.env.NODE_ENV,
    database: cachedDb ? 'Connected' : 'Disconnected'
  });
});

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

module.exports = app;