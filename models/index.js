const sequelize = require('../config/db');
const Store = require('./Store');
const Style = require('./Style');

// 設定多對多關聯
// store_style_map 資料表沒有定義主鍵ID，Sequelize 預設需要透過 through 指定 table name
Store.belongsToMany(Style, { 
  through: 'store_style_map', 
  foreignKey: 'store_id', 
  otherKey: 'style_id',
  timestamps: false 
});

Style.belongsToMany(Store, { 
  through: 'store_style_map', 
  foreignKey: 'style_id', 
  otherKey: 'store_id',
  timestamps: false 
});

module.exports = {
  sequelize,
  Store,
  Style
};