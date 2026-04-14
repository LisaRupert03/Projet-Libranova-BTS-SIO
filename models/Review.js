const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Review = sequelize.define('Review', {
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  commentaire: { // 🔥 IMPORTANT (au lieu de comment)
    type: DataTypes.TEXT,
    allowNull: false
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'reviews', // 🔥 IMPORTANT
  timestamps: false // car tu as "date" et pas createdAt
});

module.exports = Review;