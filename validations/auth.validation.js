const Joi = require('joi');

const userValidationSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'admin').default('user')  
});

const loginValidationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
})

module.exports = {userValidationSchema,loginValidationSchema};