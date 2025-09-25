// src/services/progress.service.js
const UserProgress = require('../models/userProgress.model');

/**
 * Helpers: compute completion flags on a week object (in-memory)
 */
function augmentWeek(week) {
  const days = week.days.map(day => {
    const done = day.tasks.every(t => t.done);
    return { ...day.toObject ? day.toObject() : day, done };
  });
  const done = days.every(d => d.done);
  return { ...week.toObject ? week.toObject() : week, days, done };
}

async function getWeeksForUser(userId) {
  const doc = await UserProgress.findOne({ userId }).lean();
  if (!doc) return null;
  doc.weeks = doc.weeks.map(augmentWeek);
  return doc;
}

async function getWeek(userId, weekId) {
  const doc = await UserProgress.findOne({ userId, 'weeks.weekId': weekId }, { 'weeks.$': 1 }).lean();
  if (!doc || !doc.weeks || !doc.weeks[0]) return null;
  return augmentWeek(doc.weeks[0]);
}

/**
 * Mark a nested task as done.
 * We update only the task.done flag in DB, then return the updated week (computed).
 */
async function markTaskComplete(userId, weekId, dayId, taskId) {
  // atomic update of the task 'done' flag with arrayFilters
  await UserProgress.updateOne(
    { userId },
    { $set: { 'weeks.$[w].days.$[d].tasks.$[t].done': true } },
    {
      arrayFilters: [
        { 'w.weekId': weekId },
        { 'd.dayId': dayId },
        { 't.taskId': taskId }
      ]
    }
  );
  // return the updated computed week
  return getWeek(userId, weekId);
}

module.exports = {
  getWeeksForUser,
  getWeek,
  markTaskComplete
};
