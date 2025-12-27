const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Store = sequelize.define('Store', {
  store_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Name: {
    type: DataTypes.STRING(45),
    allowNull: false
  },
  address: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  rating: {
    type: DataTypes.DECIMAL(3, 1),
    allowNull: true
  }
}, {
  tableName: 'store',
  timestamps: false // 資料表沒有 createdAt, updatedAt
});

module.exports = Store;