import Workout from "../models/Workout.js";

// BMI calculation
const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

// Base workouts (expanded)
const baseWorkouts = [
  { description: "Fekvőtámasz", baseReps: 10 },
  { description: "Guggolás", baseReps: 15 },
  { description: "Plank (másodperc)", baseReps: 30 },
  { description: "Terpszbe szökkenés", baseReps: 20 },
  { description: "Kitörés", baseReps: 12 },
  { description: "Burpee", baseReps: 8 },
  { description: "Hegymászás", baseReps: 20 },
  { description: "Felülés", baseReps: 15 },
  { description: "Térdemelés (másodperc)", baseReps: 30 },
  { description: "Híd", baseReps: 12 },
  { description: "Tolódzkodás székkel", baseReps: 10 },
  { description: "Vádli emelés", baseReps: 20 },
  { description: "Bicikliző felülés", baseReps: 20 },
  { description: "Russian Twist", baseReps: 20 },
  { description: "Falguggolás (másodperc)", baseReps: 45 },
  { description: "Oldalsó Plank (másodperc)", baseReps: 25 },
  { description: "Lábemelés", baseReps: 12 },
  { description: "Csípőemelés", baseReps: 12 },
  { description: "Ugrálókötelezés (másodperc)", baseReps: 60 },
  { description: "Kúszás (méter)", baseReps: 20 },
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

    // For each day pick a random subset of exercises (between 5 and 10 items)
    for (let week = 1; week <= 8; week++) {
      for (let day = 1; day <= 5; day++) {
        // shuffle a copy of baseWorkouts
        const pool = [...baseWorkouts];
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }

        const count = 5;//Math.min(pool.length, 5 + Math.floor(Math.random() * 6)); // 5..10
        const selected = pool.slice(0, count);

        selected.forEach((task, idx) => {
          personalizedWorkouts.push({
            week,
            day,
            taskNumber: idx + 1, // sequential per day
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
