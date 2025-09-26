import mongoose from "mongoose";
import dotenv from "dotenv";
import Workout from "../models/Workout.js";

dotenv.config();

const seedWorkouts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    await Workout.deleteMany(); // clear old data

    const workouts = [];

    const descriptions = [
      "Push-ups",
      "Squats",
      "Plank",
      "Jumping Jacks",
      "Lunges"
    ];

    // Create 8 weeks * 5 days * 5 tasks
    for (let week = 1; week <= 8; week++) {
      for (let day = 1; day <= 5; day++) {
        for (let task = 1; task <= 5; task++) {
          workouts.push({
            week,
            day,
            taskNumber: task,
            description: descriptions[task - 1], // map from array
            completed: false
          });
        }
      }
    }

    await Workout.insertMany(workouts);
    console.log("✅ Workouts seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding workouts:", error);
    process.exit(1);
  }
};

seedWorkouts();
