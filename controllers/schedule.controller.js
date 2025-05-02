const { BUS, Route } = require('../models');
const Schedule = require('../models/schedule.model');
const { getPagination, formatPaginationData } = require('../utils/pagination');
const { encrypt, decryptPayload } = require('../utils/encyption&decryption');

exports.createSchedule = async (request, h) => {
  try {
    const decryptedData = decryptPayload(request.payload);
    const schedule = await Schedule.create(decryptedData);

    return h.response({
      data: encrypt(JSON.stringify({ message: 'Schedule created', schedule }))
    }).code(201);
  } catch (err) {
    console.error(err);
    return h.response({
      data: encrypt(JSON.stringify({ error: 'Failed to create schedule' }))
    }).code(500);
  }
};

exports.getAllSchedules = async (request, h) => {
  try {
    const { page, limit } = request.query;
    const { offset, limit: pageSize, page: currentPage } = getPagination(page, limit);

    const schedules = await Schedule.findAndCountAll({
      offset,
      limit: pageSize,
      include: [
        { model: BUS, attributes: ['id', 'number', 'type', 'capacity', 'operator'] },
        { model: Route, attributes: ['id', 'from', 'to'] },
      ],
    });

    const paginatedResponse = formatPaginationData(schedules, currentPage, pageSize);

    return h.response({
      data: encrypt(JSON.stringify(paginatedResponse))
    }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({
      data: encrypt(JSON.stringify({ error: 'Failed to fetch schedules' }))
    }).code(500);
  }
};

exports.getScheduleById = async (request, h) => {
  try {
    const schedule = await Schedule.findByPk(request.params.id, {
      include: [
        { model: BUS, attributes: ['id', 'number', 'type', 'capacity', 'operator'] },
        { model: Route, attributes: ['id', 'from', 'to'] },
      ],
    });

    return schedule
      ? h.response({ data: encrypt(JSON.stringify(schedule)) }).code(200)
      : h.response({ data: encrypt(JSON.stringify({ error: 'Not found' })) }).code(404);
  } catch (err) {
    return h.response({
      data: encrypt(JSON.stringify({ error: 'Error fetching schedule' }))
    }).code(500);
  }
};

exports.updateSchedule = async (request, h) => {
  try {
    const decryptedData = decryptPayload(request.payload);
    const schedule = await Schedule.findByPk(request.params.id);

    if (!schedule) {
      return h.response({
        data: encrypt(JSON.stringify({ error: 'Schedule not found' }))
      }).code(404);
    }

    await schedule.update(decryptedData);
    return h.response({
      data: encrypt(JSON.stringify({ message: 'Schedule updated', schedule }))
    }).code(200);
  } catch (err) {
    return h.response({
      data: encrypt(JSON.stringify({ error: 'Failed to update schedule' }))
    }).code(500);
  }
};

exports.deleteSchedule = async (request, h) => {
  try {
    const schedule = await Schedule.findByPk(request.params.id);
    if (!schedule) {
      return h.response({
        data: encrypt(JSON.stringify({ error: 'Schedule not found' }))
      }).code(404);
    }

    await schedule.destroy();
    return h.response({
      data: encrypt(JSON.stringify({ message: 'Schedule deleted' }))
    }).code(200);
  } catch (err) {
    return h.response({
      data: encrypt(JSON.stringify({ error: 'Failed to delete schedule' }))
    }).code(500);
  }
};

exports.searchSchedules = async (request, h) => {
  try {
    const decryptedQuery = decryptPayload(request.query);
    const { source, destination, date } = decryptedQuery;

    const route = await Route.findOne({ where: { from: source, to: destination } });
    if (!route) {
      return h.response({
        data: encrypt(JSON.stringify({ error: 'Route not found' }))
      }).code(404);
    }

    const schedules = await Schedule.findAll({
      where: {
        route_id: route.id,
        date
      },
      include: [{ model: BUS }]
    });

    return h.response({
      data: encrypt(JSON.stringify(schedules))
    }).code(200);
  } catch (err) {
    console.error(err);
    return h.response({
      data: encrypt(JSON.stringify({ error: 'Failed to search schedules' }))
    }).code(500);
  }
};
