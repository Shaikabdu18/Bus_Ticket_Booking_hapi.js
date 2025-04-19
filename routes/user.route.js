const bookingController = require('../controllers/booking.controller');
const scheduleController = require('../controllers/schedule.controller');
const { verifyToken } = require('../middleware/auth.middleware');
const { scheduleSearchSchema, bookingSchema } = require('../validations/user.validation');

module.exports = [
  {
    method: 'GET',
    path: '/schedules/search',
    options: {
      handler: scheduleController.searchSchedules,
      validate: { query: scheduleSearchSchema }
    }
  },
  {
    method: 'GET',
    path: '/seats/{scheduleId}',
    options: {
      handler: bookingController.getAvailableSeats
    }
  },
  {
    method: 'POST',
    path: '/bookings',
    options: {
      pre: [verifyToken],
      handler: bookingController.bookSeat,
      validate: { payload: bookingSchema }
    }
  },
  {
    method: 'GET',
    path: '/my-bookings',
    options: {
      pre: [verifyToken],
      handler: bookingController.getUserBookings
    }
  },
  {
    method: 'DELETE',
    path: '/bookings/{id}',
    options: {
      pre: [verifyToken],
      handler: bookingController.cancelBooking
    }
  }
];
