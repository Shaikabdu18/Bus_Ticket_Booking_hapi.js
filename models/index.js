const BUS = require('./bus.model');
const Route = require('./route.model');
const SCHEDULE = require('./schedule.model');
const BOOKING = require("../models/booking.model")
const USER = require("../models/user.model")


BUS.hasMany(SCHEDULE, { foreignKey: 'bus_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
SCHEDULE.belongsTo(BUS, { foreignKey: 'bus_id' });

Route.hasMany(SCHEDULE, { foreignKey: 'route_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
SCHEDULE.belongsTo(Route, { foreignKey: 'route_id' });

BOOKING.belongsTo(USER, { foreignKey: 'user_id' });
BOOKING.belongsTo(SCHEDULE, { foreignKey: 'schedule_id' });
SCHEDULE.hasMany(BOOKING, { foreignKey: 'schedule_id' });

module.exports = { BUS, Route, SCHEDULE,BOOKING };
