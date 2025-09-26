import Workout from "../models/Workout.js";

// GET /api/workouts?week=1&day=2
export const getAllWorkouts = async (req, res) => {
  try {
    const { week, day } = req.query; // read query params
    const filter = {};

    if (week) filter.week = Number(week);
    if (day) filter.day = Number(day);

    const workouts = await Workout.find(filter).sort({ day: 1, taskNumber: 1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching workouts", error });
  }
};
