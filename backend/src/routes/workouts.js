import express from "express";
import { getAllWorkouts, updateWorkout, generatePlan } from "../controllers/workoutController.js";

const router = express.Router();

// GET /api/workouts?week=1&day=1
router.get("/", getAllWorkouts);

// PUT /api/workouts/:id
router.put("/:id", updateWorkout);

// POST /api/workouts/generate
router.post("/generate", generatePlan);

export default router;
