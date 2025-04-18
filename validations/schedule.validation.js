const Joi = require('joi');

const scheduleSchema = Joi.object({
  bus_id: Joi.number().integer().required(),
  route_id: Joi.number().integer().required(),
  date: Joi.date().iso().required(),
  departure_time: Joi.string()
    .pattern(/^([0-1][0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/)
    .required()
});

module.exports = { scheduleSchema };
