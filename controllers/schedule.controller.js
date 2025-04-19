const { BUS, Route } = require('../models');
const Schedule = require('../models/schedule.model');
const { getPagination, formatPaginationData } = require('../utils/pagination');

exports.createSchedule = async (request, h) => {
  try {
    const schedule = await Schedule.create(request.payload);
    return h.response(schedule).code(201);
  } catch (err) {
    console.error(err);
    return h.response({ error: 'Failed to create schedule' }).code(500);
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
        {
          model: BUS,
          attributes: ['id', 'number', 'type','capacity','operator'], 
        },
        {
          model: Route,
          attributes: ['id', 'from', 'to'], 
        },
      ],
    });
    const paginatedResponse = formatPaginationData(schedules, currentPage, pageSize);

    return h.response(paginatedResponse).code(200);
  } catch (err) {
    console.error(err);
    return h.response({ error: 'Failed to fetch schedules',err:err.message }).code(500);
  }
};

exports.getScheduleById = async (request, h) => {
  const schedule = await Schedule.findByPk(request.params.id,{
    include: [
      {
        model: BUS,
        attributes: ['id', 'number', 'type','capacity','operator'], 
      },
      {
        model: Route,
        attributes: ['id', 'from', 'to'], 
      },
    ],
  });
  return schedule ? h.response(schedule).code(200) : h.response({ error: 'Not found' }).code(404);
};

exports.updateSchedule = async (request, h) => {
  try {
    const schedule = await Schedule.findByPk(request.params.id);
    if (!schedule) return h.response({ error: 'Schedule not found' }).code(404);

    await schedule.update(request.payload);
    return h.response(schedule).code(200);
  } catch (err) {
    return h.response({ error: 'Failed to update schedule' }).code(500);
  }
};

exports.deleteSchedule = async (request, h) => {
  try {
    const schedule = await Schedule.findByPk(request.params.id);
    if (!schedule) return h.response({ error: 'Schedule not found' }).code(404);

    await schedule.destroy();
    return h.response({ message: 'Schedule deleted' }).code(200);
  } catch (err) {
    return h.response({ error: 'Failed to delete schedule' }).code(500);
  }
};

exports.searchSchedules = async (request, h) => {
  const { source, destination, date } = request.query;
  
  const route = await Route.findOne({ where: { from: source, to: destination } });
  if (!route) return h.response({ error: 'Route not found' }).code(404);

  const schedules = await Schedule.findAll({
    where: {
      route_id: route.id,
      date
    },
    include: [{ model: BUS }]
  });

  return h.response(schedules).code(200);
};
