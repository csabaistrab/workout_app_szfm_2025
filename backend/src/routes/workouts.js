import express from "express";
import { getAllWorkouts, updateWorkout, generatePlan } from "../controllers/workoutController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Public: POST /api/workouts/generate (supports guest payload or authenticated user)
router.post("/generate", generatePlan);

// Protected routes: require authentication
router.get("/", authenticateToken, getAllWorkouts);
router.put("/:id", authenticateToken, updateWorkout);

export default router;
