const { Sequelize } = require('sequelize');
require('dotenv').config();

// 建立連線池
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false, // 關閉連線紀錄，讓終端機乾淨一點
    }
);

module.exports = sequelize;