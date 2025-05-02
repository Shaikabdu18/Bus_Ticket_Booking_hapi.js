const AuthController = require('../controllers/auth.controller');

const authRoutes = [
    {
      method: 'POST',
      path: '/register',
      handler: AuthController.register,
    },
    {
      method: 'POST',
      path: '/login',
      handler: AuthController.login,
    },
];

module.exports = authRoutes;
