import Workout from "../models/Workout.js";

export const getAllWorkouts = async () => {
  return await Workout.find();
};

export const markWorkoutDone = async (day, taskNumber) => {
  return await Workout.findOneAndUpdate(
    { day, taskNumber },
    { completed: true },
    { new: true }
  );
};
