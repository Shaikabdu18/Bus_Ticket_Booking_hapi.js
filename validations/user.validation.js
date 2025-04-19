const Joi = require('joi');

const scheduleSearchSchema = Joi.object({
  source: Joi.string().required(),
  destination: Joi.string().required(),
  date: Joi.date().iso().required()
});

const bookingSchema = Joi.object({
  schedule_id: Joi.number().integer().required(),
  seat_number: Joi.number().integer().required()
});

module.exports = {
  scheduleSearchSchema,
  bookingSchema
};
