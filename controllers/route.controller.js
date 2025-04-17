const Route = require('../models/route.model');

exports.createRoute = async (request, h) => {
  try {
    const { from, to } = request.payload;
    const newRoute = await Route.create({ from, to });
    return h.response(newRoute).code(201);
  } catch (error) {
    console.error('Error creating route:', error);
    return h.response({ error: 'Failed to create route' }).code(500);
  }
};

exports.getAllRoutes = async (request, h) => {
  try {
    const routes = await Route.findAll();
    return h.response(routes).code(200);
  } catch (error) {
    console.error('Error fetching routes:', error);
    return h.response({ error: 'Failed to retrieve routes' }).code(500);
  }
};

exports.getRouteById = async (request, h) => {
  try {
    const { id } = request.params;
    const route = await Route.findByPk(id);
    if (!route) {
      return h.response({ message: 'Route not found' }).code(404);
    }
    return h.response(route).code(200);
  } catch (error) {
    console.error('Error fetching route by ID:', error);
    return h.response({ error: 'Failed to retrieve route' }).code(500);
  }
};

exports.updateRoute = async (request, h) => {
  try {
    const { id } = request.params;
    const { from, to } = request.payload;
    const route = await Route.findByPk(id);
    if (!route) {
      return h.response({ message: 'Route not found' }).code(404);
    }
    await route.update({ from, to });
    return h.response(route).code(200);
  } catch (error) {
    console.error('Error updating route:', error);
    return h.response({ error: 'Failed to update route' }).code(500);
  }
};

exports.deleteRoute = async (request, h) => {
  try {
    const { id } = request.params;
    const route = await Route.findByPk(id);
    if (!route) {
      return h.response({ message: 'Route not found' }).code(404);
    }
    await route.destroy();
    return h.response({ message: 'Route deleted successfully' }).code(200);
  } catch (error) {
    console.error('Error deleting route:', error);
    return h.response({ error: 'Failed to delete route' }).code(500);
  }
};
