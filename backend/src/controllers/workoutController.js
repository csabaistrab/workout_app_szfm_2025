import Workout from "../models/Workout.js";

// BMI calculation
const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

// Base workouts
const baseWorkouts = [
  { taskNumber: 1, description: "Push-ups", baseReps: 10 },
  { taskNumber: 2, description: "Squats", baseReps: 15 },
  { taskNumber: 3, description: "Plank (seconds)", baseReps: 30 },
  { taskNumber: 4, description: "Jumping Jacks", baseReps: 20 },
  { taskNumber: 5, description: "Lunges", baseReps: 12 },
];

// Workout multipliers
const workoutPlans = {
  underweight: { multiplier: 0.8 },
  normal: { multiplier: 1.0 },
  overweight: { multiplier: 1.2 },
  obese: { multiplier: 1.5 },
};

// GET /api/workouts?week=1&day=2
export const getAllWorkouts = async (req, res) => {
  try {
    const { week, day } = req.query;
    const filter = {};
    if (week) filter.week = Number(week);
    if (day) filter.day = Number(day);

    const workouts = await Workout.find(filter).sort({ week: 1, day: 1, taskNumber: 1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching workouts", error });
  }
};

// PUT /api/workouts/:id (toggle completed or update)
export const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Workout.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Workout not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating workout", error });
  }
};

// POST /api/workouts/generate { weight, height }
export const generatePlan = async (req, res) => {
  try {
    const { weight, height } = req.body;
    if (!weight || !height) {
      return res.status(400).json({ message: "Weight and height required" });
    }

    const bmi = calculateBMI(weight, height);

    let category = "normal";
    if (bmi < 18.5) category = "underweight";
    else if (bmi < 25) category = "normal";
    else if (bmi < 30) category = "overweight";
    else category = "obese";

    const multiplier = workoutPlans[category].multiplier;
    const personalizedWorkouts = [];

    for (let week = 1; week <= 8; week++) {
      for (let day = 1; day <= 5; day++) {
        baseWorkouts.forEach((task) => {
          personalizedWorkouts.push({
            week,
            day,
            taskNumber: task.taskNumber,
            description: `${task.description} - ${Math.round(task.baseReps * multiplier)} reps`,
            completed: false,
          });
        });
      }
    }

    // ⚠️ Save plan in DB (optional)
    await Workout.deleteMany(); // clear previous
    const savedPlan = await Workout.insertMany(personalizedWorkouts);

    res.json({ bmi: bmi.toFixed(1), category, plan: savedPlan });
  } catch (error) {
    res.status(500).json({ message: "Error generating plan", error });
  }
};
