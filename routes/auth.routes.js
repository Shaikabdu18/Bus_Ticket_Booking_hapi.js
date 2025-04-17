const AuthController = require('../controllers/auth.controller');
const { userValidationSchema, loginValidationSchema } = require('../validations/auth.validation');

const authRoutes = [
    {
      method: 'POST',
      path: '/register',
      handler: AuthController.register,
      options: {
        validate: {
          payload: userValidationSchema
        }
      }
    },
    {
      method: 'POST',
      path: '/login',
      handler: AuthController.login,
      options: {
        validate: {
          payload: loginValidationSchema
        }
      }
    },
  ];

module.exports = authRoutes;
