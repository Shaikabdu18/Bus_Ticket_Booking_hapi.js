const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/db');

class BOOKING extends Model {}

BOOKING.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  schedule_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  seat_number: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  booking_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  tableName: 'booking'
});

module.exports = BOOKING;
