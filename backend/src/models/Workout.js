// src/models/userProgress.model.js
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  taskId: Number,
  name: String,
  done: { type: Boolean, default: false }
}, { _id: false });

const DaySchema = new mongoose.Schema({
  dayId: Number,
  tasks: [TaskSchema]
}, { _id: false });

const WeekSchema = new mongoose.Schema({
  weekId: Number,
  unlocked: { type: Boolean, default: false }, // week visible
  days: [DaySchema]
}, { _id: false });

const UserProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  weeks: [WeekSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProgress', UserProgressSchema);
