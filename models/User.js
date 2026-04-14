const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {

  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },

  role: { 
    type: DataTypes.ENUM('admin', 'client'), 
    allowNull: false, 
    defaultValue: 'client' 
  },

  status: { 
    type: DataTypes.ENUM('active', 'inactive', 'banned'), 
    defaultValue: 'active' 
  },

  nom: { type: DataTypes.STRING },
  prenom: { type: DataTypes.STRING },

  phone: { type: DataTypes.STRING },
  adresse: { type: DataTypes.STRING },

  lastLogin: { type: DataTypes.DATE },
  resetPasswordToken: { type: DataTypes.STRING },
  resetPasswordExpires: { type: DataTypes.DATE }

}, {
  tableName: 'users',
  timestamps: true
});

module.exports = User;