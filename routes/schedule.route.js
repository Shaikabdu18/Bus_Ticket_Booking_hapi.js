const scheduleController = require('../controllers/schedule.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const { scheduleSchema } = require("../validations/schedule.validation")

module.exports = [
  {
    method: 'POST',
    path: '/schedules',
    options: {
      pre: [verifyToken, isAdmin],
      handler: scheduleController.createSchedule,
    }
  },
  {
    method: 'GET',
    path: '/schedules',
    options: {
      handler: scheduleController.getAllSchedules
    }
  },
  {
    method: 'GET',
    path: '/schedules/{id}',
    options: {
      handler: scheduleController.getScheduleById
    }
  },
  {
    method: 'PUT',
    path: '/schedules/{id}',
    options: {
      pre: [verifyToken, isAdmin],
      handler: scheduleController.updateSchedule
    }
  },
  {
    method: 'DELETE',
    path: '/schedules/{id}',
    options: {
      pre: [verifyToken, isAdmin],
      handler: scheduleController.deleteSchedule
    }
  }
];
