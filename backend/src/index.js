import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import workoutRoutes from "./routes/progress.routes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/workouts", workoutRoutes);

// Start server
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
  });
});
