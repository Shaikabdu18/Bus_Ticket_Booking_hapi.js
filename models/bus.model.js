const { DataTypes,Model } = require('sequelize');
const sequelize = require('../config/db');

class BUS extends Model {}

BUS.init(
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        number: {
            type: DataTypes.STRING,
            allowNull: false
          },
          type: {
            type: DataTypes.STRING,
            allowNull: false
          },
          capacity: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          operator: {
            type: DataTypes.STRING,
            allowNull: false
          }
    },
    {
        tableName:"bus",
        sequelize
    }
)

module.exports = BUS;