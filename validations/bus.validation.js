const Joi = require('joi');

const createBusSchema = Joi.object({
  number: Joi.string().required(),
  type: Joi.string().required(),
  capacity: Joi.number().integer().min(10).max(150).required(),
  operator: Joi.string().required()
});

const updateBusSchema = Joi.object({
  number: Joi.string(),
  type: Joi.string(),
  capacity: Joi.number().integer().min(10).max(150),
  operator: Joi.string()
});

module.exports = {
  createBusSchema,
  updateBusSchema
};
