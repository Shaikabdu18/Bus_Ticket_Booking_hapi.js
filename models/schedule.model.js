const { DataTypes,Model } = require('sequelize');
const sequelize = require('../config/db');
const BUS = require('./bus.model');
const Route = require('./route.model');

class SCHEDULE extends Model {}

SCHEDULE.init(
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        bus_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
          },
        route_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
          },
        date: {
            type: DataTypes.DATEONLY,
            allowNull: false
          },
        departure_time: {
            type: DataTypes.TIME,
            allowNull: false
          }
    },
    {
        tableName:"schedule",
        sequelize
    }
)



module.exports = SCHEDULE;

