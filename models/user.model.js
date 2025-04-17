const { DataTypes,Model } = require('sequelize');
const sequelize = require('../config/db');

class User extends Model {}

User.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        name:{
            type: DataTypes.STRING, 
            allowNull: false 
        },
        email: { 
            type: DataTypes.STRING, 
            unique: true, 
            allowNull: false 
          },
          password: { 
            type: DataTypes.STRING, 
            allowNull: false 
          },
          role: { 
            type: DataTypes.ENUM('user', 'admin'), 
            defaultValue: 'user' 
          }
    },
    {
        tableName:"users",
        sequelize
    }
)

module.exports = User