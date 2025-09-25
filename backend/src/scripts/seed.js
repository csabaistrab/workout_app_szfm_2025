import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Workout from "../models/Workout.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    await Workout.deleteMany();

    const workouts = [];
    for (let day = 1; day <= 5; day++) {
      for (let task = 1; task <= 5; task++) {
        workouts.push({
          day,
          taskNumber: task,
          description: `Workout ${task} for day ${day}`,
        });
      }
    }

    await Workout.insertMany(workouts);
    console.log("✅ Database seeded");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding:", err.message);
    process.exit(1);
  }
};

seed();
