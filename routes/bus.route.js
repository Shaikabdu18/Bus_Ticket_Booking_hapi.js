const busController = require('../controllers/bus.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');
const {createBusSchema,updateBusSchema}=require("../validations/bus.validation")

module.exports = [
  {
    method: 'POST',
    path: '/buses',
    options: {
      pre: [verifyToken, isAdmin],
      handler: busController.createBus,
      validate:{
        payload:createBusSchema
      }
    }
  },
  {
    method: 'POST',
    path: '/buses/bulk',
    options: {
      pre: [verifyToken, isAdmin],
      payload: {
        output: 'stream',
        parse: true,
        allow: 'multipart/form-data',
        multipart: true,
        maxBytes: 1048576 * 5 // 5MB
      },
      handler: busController.importBulkBuses
    }
  },
  {
    method: 'GET',
    path: '/buses',
    options: {
      handler: busController.getAllBuses
    }
  },
  {
    method: 'GET',
    path: '/buses/{id}',
    options: {
      handler: busController.getBusById
    }
  },
  {
    method: 'PUT',
    path: '/buses/{id}',
    options: {
      pre: [verifyToken, isAdmin],
      handler: busController.updateBus,
      validate:{
        payload:updateBusSchema
      }
    }
  },
  {
    method: 'DELETE',
    path: '/buses/{id}',
    options: {
      pre: [verifyToken, isAdmin],
      handler: busController.deleteBus
    }
  }
];
