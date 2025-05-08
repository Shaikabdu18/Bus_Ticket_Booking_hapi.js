const reportController = require('../controllers/admin_report.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

module.exports = [
  {
    method: 'GET',
    path: '/reports/total-bookings',
    options: {
      pre: [verifyToken, isAdmin],
      handler: reportController.totalBookingsReport
    }
  },
  {
    method: 'GET',
    path: '/reports/revenue',
    options: {
      pre: [verifyToken, isAdmin],
      handler: reportController.revenueReport
    }
  },
  {
    method: 'GET',
    path: '/reports/most-booked-routes',
    options: {
      pre: [verifyToken, isAdmin],
      handler: reportController.mostBookedRoutes
    }
  },
  {
    method: 'GET',
    path: '/reports/daily-bookings',
    options: {
      pre: [verifyToken, isAdmin],
      handler: reportController.dailyBookings
    }
  },
  {
    method: 'GET',
    path: '/reports/user-booking-summary',
    options: {
      pre: [verifyToken, isAdmin],
      handler: reportController.userBookingSummary
    }
  }
];
