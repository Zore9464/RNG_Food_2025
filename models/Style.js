const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Style = sequelize.define('Style', {
  style_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  style_name: {
    type: DataTypes.STRING(45),
    allowNull: false
  }
}, {
  tableName: 'style',
  timestamps: false
});

module.exports = Style;