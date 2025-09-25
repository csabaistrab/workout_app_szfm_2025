import express from "express";
import { getWorkouts, completeWorkout } from "../controllers/workoutController.js";

const router = express.Router();

router.get("/", getWorkouts);
router.post("/complete", completeWorkout);

export default router;
