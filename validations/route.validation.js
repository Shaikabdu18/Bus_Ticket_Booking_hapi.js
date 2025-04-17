const Joi = require('joi');

exports.createRouteSchema = Joi.object({
  from: Joi.string().min(2).max(50).required(),
  to: Joi.string().min(2).max(50).required().invalid(Joi.ref('from'))
});

exports.updateRouteSchema = Joi.object({
  from: Joi.string().min(2).max(50).optional(),
  to: Joi.string().min(2).max(50).optional().invalid(Joi.ref('from'))
});
