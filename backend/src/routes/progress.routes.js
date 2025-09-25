const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/progress.controller');

router.get('/users/:userId/weeks', ctrl.getWeeks);
router.get('/users/:userId/weeks/:weekId', ctrl.getWeek);
router.post('/users/:userId/weeks/:weekId/days/:dayId/tasks/:taskId/complete', ctrl.completeTask);

module.exports = router;
