// src/scripts/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const UserProgress = require('../models/userProgress.model');
const { connect } = require('../config/db');

const WORKOUT_WEEKS = 8;

function makeTask(id, name) {
  return { taskId: id, name, done: false };
}

function makeDay(dayId) {
  return {
    dayId,
    tasks: [
      makeTask(1, '10 push-ups'),
      makeTask(2, '15 squats'),
      makeTask(3, '30s plank'),
      makeTask(4, '20 lunges'),
      makeTask(5, '20s rest-walk')
    ]
  };
}

async function run() {
  await connect(process.env.MONGO_URI);
  // Create a template user progress for guest "guest-1" if missing
  const userId = 'guest-1';
  const existing = await UserProgress.findOne({ userId });
  if (existing) {
    console.log('Seed exists for', userId);
    process.exit(0);
  }
  const weeks = [];
  for (let w = 1; w <= WORKOUT_WEEKS; w++) {
    const days = [];
    for (let d = 1; d <= 5; d++) days.push(makeDay(d));
    weeks.push({ weekId: w, unlocked: w === 1, days });
  }
  await UserProgress.create({ userId, weeks });
  console.log('Seeded userProgress for', userId);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
