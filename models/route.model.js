const { DataTypes,Model } = require('sequelize');
const sequelize = require('../config/db');

class Route extends Model {}

Route.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
          },
          from: {
            type: DataTypes.STRING,
            allowNull: false
          },
          to: {
            type: DataTypes.STRING,
            allowNull: false
          }
    },
    {
        tableName:"route",
        sequelize
    }
    
)

module.exports = Route;
