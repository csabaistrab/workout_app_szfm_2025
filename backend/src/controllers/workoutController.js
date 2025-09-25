import { getAllWorkouts, markWorkoutDone } from "../services/workoutService.js";

export const getWorkouts = async (req, res) => {
  try {
    const workouts = await getAllWorkouts();
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const completeWorkout = async (req, res) => {
  try {
    const { day, taskNumber } = req.body;
    const updated = await markWorkoutDone(day, taskNumber);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
