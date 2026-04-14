const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Book = sequelize.define('Book', {
  titre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  auteur: {
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  },
  prix: {
    type: DataTypes.FLOAT
  },
  stock: {
    type: DataTypes.INTEGER
  },
  image: {
    type: DataTypes.STRING
  }
}, {
  timestamps: false // 🔥 TRÈS IMPORTANT
});

module.exports = Book;