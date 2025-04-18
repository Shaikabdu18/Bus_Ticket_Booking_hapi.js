const BUS = require('./bus.model');
const Route = require('./route.model');
const SCHEDULE = require('./schedule.model');

BUS.hasMany(SCHEDULE, { foreignKey: 'bus_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
SCHEDULE.belongsTo(BUS, { foreignKey: 'bus_id' });

Route.hasMany(SCHEDULE, { foreignKey: 'route_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
SCHEDULE.belongsTo(Route, { foreignKey: 'route_id' });

module.exports = { BUS, Route, SCHEDULE };
