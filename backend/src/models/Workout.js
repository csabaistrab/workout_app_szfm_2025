import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  week: { type: Number, required: true },
  day: { type: Number, required: true },
  taskNumber: { type: Number, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, {
  versionKey: false // removes __v
});

// Transform _id → id
workoutSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  }
});

export default mongoose.model("Workout", workoutSchema);
