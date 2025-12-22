const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Food = sequelize.define('Food', {
  // id 欄位 Sequelize 會自動幫我們建立 (primary key auto increment)
  // 但為了相容您原本的前端邏輯 (用字串 ID)，我們保留自訂 id
  customId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rating: DataTypes.STRING,
  description: DataTypes.TEXT,
  location: DataTypes.STRING,
  price: DataTypes.STRING,
  stars: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: 'all'
  },
  // MySQL 5.7+ 支援 JSON 格式，可以讓我們像存陣列一樣存資料
  time: {
    type: DataTypes.JSON, 
    defaultValue: []
  },
  tags: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  lat: DataTypes.FLOAT,
  lng: DataTypes.FLOAT
}, {
  timestamps: true // 自動產生 createdAt, updatedAt
});

module.exports = Food;