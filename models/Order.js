const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {

  numero: {
    type: DataTypes.STRING,
    allowNull: false
  },

  client: {
    type: DataTypes.STRING
  },

  status: {
    type: DataTypes.STRING,
    defaultValue: 'En cours de préparation'
  },

  total: {
    type: DataTypes.FLOAT,
    allowNull: false
  },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }

}, {
  timestamps: true
});

module.exports = Order;