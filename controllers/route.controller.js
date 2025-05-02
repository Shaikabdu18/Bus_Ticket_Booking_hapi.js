const Route = require('../models/route.model');
const { getPagination, formatPaginationData } = require('../utils/pagination');
const { encrypt, decryptPayload } = require('../utils/encyption&decryption');

exports.createRoute = async (request, h) => {
  try {
    const { from, to } = decryptPayload(request.payload);
    const newRoute = await Route.create({ from, to });

    return h.response({
      data: encrypt(JSON.stringify({ message: 'Route created', route: newRoute }))
    }).code(201);
  } catch (error) {
    console.error('Error creating route:', error);
    return h.response({
      data: encrypt(JSON.stringify({ error: 'Failed to create route' }))
    }).code(500);
  }
};

exports.getAllRoutes = async (request, h) => {
  try {
    const { page, limit } = request.query;
    const { offset, limit: pageSize, page: currentPage } = getPagination(page, limit);
    const data = await Route.findAndCountAll({
      offset,
      limit: pageSize,
    });

    const paginatedResponse = formatPaginationData(data, currentPage, pageSize);
    return h.response({
      data: encrypt(JSON.stringify(paginatedResponse))
    }).code(200);
  } catch (error) {
    console.error('Error fetching routes:', error);
    return h.response({
      data: encrypt(JSON.stringify({ error: 'Failed to retrieve routes' }))
    }).code(500);
  }
};

exports.getRouteById = async (request, h) => {
  try {
    const { id } = request.params;
    const route = await Route.findByPk(id);
    if (!route) {
      return h.response({
        data: encrypt(JSON.stringify({ message: 'Route not found' }))
      }).code(404);
    }
    return h.response({
      data: encrypt(JSON.stringify(route))
    }).code(200);
  } catch (error) {
    console.error('Error fetching route by ID:', error);
    return h.response({
      data: encrypt(JSON.stringify({ error: 'Failed to retrieve route' }))
    }).code(500);
  }
};

exports.updateRoute = async (request, h) => {
  try {
    const { id } = request.params;
    const { from, to } = decryptPayload(request.payload);
    const route = await Route.findByPk(id);

    if (!route) {
      return h.response({
        data: encrypt(JSON.stringify({ message: 'Route not found' }))
      }).code(404);
    }

    await route.update({ from, to });
    return h.response({
      data: encrypt(JSON.stringify({ message: 'Route updated', route }))
    }).code(200);
  } catch (error) {
    console.error('Error updating route:', error);
    return h.response({
      data: encrypt(JSON.stringify({ error: 'Failed to update route' }))
    }).code(500);
  }
};

exports.deleteRoute = async (request, h) => {
  try {
    const { id } = request.params;
    const route = await Route.findByPk(id);
    if (!route) {
      return h.response({
        data: encrypt(JSON.stringify({ message: 'Route not found' }))
      }).code(404);
    }

    await route.destroy();
    return h.response({
      data: encrypt(JSON.stringify({ message: 'Route deleted successfully' }))
    }).code(200);
  } catch (error) {
    console.error('Error deleting route:', error);
    return h.response({
      data: encrypt(JSON.stringify({ error: 'Failed to delete route' }))
    }).code(500);
  }
};
