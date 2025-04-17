const routeController = require('../controllers/route.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const { createRouteSchema, updateRouteSchema } = require('../validations/route.validation');

module.exports = [
  {
    method: 'POST',
    path: '/routes',
    options: {
      pre: [verifyToken, isAdmin],
      handler: routeController.createRoute,
      validate:{
        payload:createRouteSchema
      }
    }
  },
  {
    method: 'GET',
    path: '/routes',
    options: {
      handler: routeController.getAllRoutes
    }
  },
  {
    method: 'GET',
    path: '/routes/{id}',
    options: {
      handler: routeController.getRouteById
    }
  },
  {
    method: 'PUT',
    path: '/routes/{id}',
    options: {
      pre: [verifyToken, isAdmin],
      handler: routeController.updateRoute,
      validate:{
        payload:updateRouteSchema
      }
    }
  },
  {
    method: 'DELETE',
    path: '/routes/{id}',
    options: {
      pre: [verifyToken, isAdmin],
      handler: routeController.deleteRoute
    }
  }
];
