const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const OrderItem = sequelize.define('OrderItem', {
  orderId: DataTypes.INTEGER,
  bookId: DataTypes.INTEGER,
  titre: DataTypes.STRING,
  prix: DataTypes.FLOAT,
  quantity: DataTypes.INTEGER
}, {
  timestamps: false,
  tableName: 'order_items'
});

module.exports = OrderItem;