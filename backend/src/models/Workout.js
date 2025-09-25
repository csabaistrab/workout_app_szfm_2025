import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  day: { type: Number, required: true },        // 1-5
  taskNumber: { type: Number, required: true }, // 1-5 per day
  description: { type: String, required: true },
  completed: { type: Boolean, default: false }
});

export default mongoose.model("Workout", workoutSchema);
