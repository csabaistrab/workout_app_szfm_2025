import 'dotenv/config';
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import workoutRoutes from "./routes/workouts.js";
import authRoutes from "./routes/auth.js";
import connectDB from "./config/db.js";

// Validate required environment variables (GOOGLE_API_KEY is optional for local/dev)
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  process.exit(1);
}

if (!process.env.GROQ_API_KEY && !process.env.GOOGLE_API_KEY) {
  console.warn('⚠️ No AI API key set (GROQ_API_KEY or GOOGLE_API_KEY) — AI features will fallback to heuristic plans');
} else if (process.env.GROQ_API_KEY) {
  console.log('✅ Groq AI enabled');
} else if (process.env.GOOGLE_API_KEY) {
  console.log('✅ Google AI enabled');
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);

// Start server
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});
