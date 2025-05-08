const Booking = require('../models/booking.model');
const Schedule = require('../models/schedule.model');
const { BUS, Route } = require('../models');
const { encrypt, decrypt, decryptPayload } = require("../utils/encyption&decryption");
const {Sequelize} = require("../config/db")


exports.totalBookingsReport = async (request, h) => {
  try {
    const bookings = await Booking.findAll({
      attributes: [
        'schedule_id',
        [Sequelize.fn('COUNT', Sequelize.col('Booking.id')), 'totalBookings']
      ],
      group: ['schedule_id', 'Schedule.id', 'Schedule->BUS.id', 'Schedule->Route.id'], 
      include: [
        {
          model: Schedule,
          include: [BUS, Route]
        }
      ]
    });

    return h.response({
    //   data: encrypt(JSON.stringify(bookings))
    bookings
    }).code(200);
  } catch (err) {
    console.log(err.message);

    return h.response({
      data: encrypt(JSON.stringify({ error: 'Failed to fetch bookings report' }))
    }).code(500);
  }
};


  exports.revenueReport = async (request, h) => {
    try {
      const report = await Booking.findAll({
        attributes: [
          'schedule_id',
          [Sequelize.fn('SUM', Sequelize.col('price')), 'totalRevenue']
        ],
        group: ['schedule_id'],
        include: [{ model: Schedule, include: [BUS, Route] }]
      });
  
      return h.response({
        // data: encrypt(JSON.stringify(report))
        report
      }).code(200);
    } catch (err) {
        console.log(err.message);
        
      return h.response({
        data: encrypt(JSON.stringify({ error: 'Failed to fetch revenue report' }))
      }).code(500);
    }
  };

  exports.mostBookedRoutes = async (request, h) => {
    try {
        const report = await Booking.findAll({
            attributes: [
              [Sequelize.col('Schedule.route_id'), 'routeId'],
              [Sequelize.fn('COUNT', Sequelize.col('Booking.id')), 'bookingCount']
            ],
            include: [
              {
                model: Schedule,
                attributes: [],
                include: [
                  {
                    model: Route,
                    attributes: ['from', 'to']
                  }
                ]
              }
            ],
            group: ['Schedule.route_id', 'Schedule.Route.id', 'Schedule.Route.from', 'Schedule.Route.to'],
            order: [[Sequelize.fn('COUNT', Sequelize.col('Booking.id')), 'DESC']],
            limit: 5
          });
          
  
      return h.response({
        // data: encrypt(JSON.stringify(report))
        report
      }).code(200);
    } catch (err) {
      return h.response({
        data: encrypt(JSON.stringify({ error: 'Failed to fetch popular routes' }))
      }).code(500);
    }
  };

  exports.dailyBookings = async (request, h) => {
    try {
      const report = await Booking.findAll({
        attributes: [
          [Sequelize.fn('DATE', Sequelize.col('booking_date')), 'bookingDate'],
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalBookings']
        ],
        group: [Sequelize.fn('DATE', Sequelize.col('booking_date'))],
        order: [[Sequelize.fn('DATE', Sequelize.col('booking_date')), 'DESC']]
      });
  
      return h.response({
        // data: encrypt(JSON.stringify(report))
        report
      }).code(200);
    } catch (err) {
      return h.response({
        data: encrypt(JSON.stringify({ error: 'Failed to fetch daily bookings' }))
      }).code(500);
    }
  };

  exports.userBookingSummary = async (request, h) => {
    try {
      const report = await Booking.findAll({
        attributes: [
          'user_id',
          [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalBookings']
        ],
        group: ['user_id']
      });
  
      return h.response({
        // data: encrypt(JSON.stringify(report))
        report
      }).code(200);
    } catch (err) {
      return h.response({
        data: encrypt(JSON.stringify({ error: 'Failed to fetch user bookings summary' }))
      }).code(500);
    }
  };
  