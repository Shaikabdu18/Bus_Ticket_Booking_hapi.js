const Booking = require('../models/booking.model');
const Schedule = require('../models/schedule.model');
const Bus = require('../models/bus.model');

exports.getAvailableSeats = async (request, h) => {
  try {
    const { scheduleId } = request.params;

    const schedule = await Schedule.findByPk(scheduleId, { include: [Bus] });
    if (!schedule) return h.response({ error: 'Schedule not found' }).code(404);

    const capacity = schedule.BUS.capacity;

    const bookings = await Booking.findAll({ where: { schedule_id: scheduleId } });
    const booked = bookings.map(b => b.seat_number);

    const available = [];
    for (let i = 1; i <= capacity; i++) {
      if (!booked.includes(i)) available.push(i);
    }

    return h.response({ availableSeats: available }).code(200);
  } catch (error) {
    console.error('Error fetching available seats:', error);
    return h.response({ error: 'Internal Server Error' }).code(500);
  }
};

exports.bookSeat = async (request, h) => {
  try {
    const { schedule_id, seat_number,booking_date } = request.payload;
    const user_id = request.user.id;
    
    const schedule = await Schedule.findByPk(schedule_id, { include: [Bus] });
    
    if (!schedule) {
      return h.response({ error: 'Schedule not found' }).code(404);
    }

    const exists = await Booking.findOne({ where: { schedule_id, seat_number } });
    
    if (exists) {
      return h.response({ error: 'Seat already booked' }).code(400);
    }
    
    const booking = await Booking.create({ user_id, schedule_id, seat_number,booking_date });
    return h.response(booking).code(201);
  } catch (error) {
    console.error('Error booking seat:', error.message);
    return h.response({ error: 'Internal Server Error' }).code(500);
  }
};

exports.getUserBookings = async (request, h) => {
  try {
    const user_id = request.user.id;
    const bookings = await Booking.findAll({
      where: { user_id },
      include: [{ model: Schedule, include: [Bus] }]
    });

    return h.response(bookings).code(200);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return h.response({ error: 'Internal Server Error' }).code(500);
  }
};

exports.cancelBooking = async (request, h) => {
  try {
    const user_id = request.user.id;
    const { id } = request.params;

    const booking = await Booking.findByPk(id);
    if (!booking || booking.user_id !== user_id) {
      return h.response({ error: 'Booking not found or unauthorized' }).code(404);
    }

    await booking.destroy();
    return h.response({ message: 'Booking canceled' }).code(200);
  } catch (error) {
    console.error('Error canceling booking:', error);
    return h.response({ error: 'Internal Server Error' }).code(500);
  }
};
