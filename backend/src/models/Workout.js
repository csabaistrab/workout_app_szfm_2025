import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  week: { type: Number, required: true },        // add week number
  day: { type: Number, required: true },
  taskNumber: { type: Number, required: true },
  description: { type: String, required: true }, // actual task description
  completed: { type: Boolean, default: false }
}, {
  versionKey: false // removes __v
});

// Optional: create a cleaner JSON without _id
workoutSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;  // rename _id -> id
    delete ret._id;
    return ret;
  }
});

export default mongoose.model("Workout", workoutSchema);
