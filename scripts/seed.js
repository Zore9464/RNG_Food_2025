require('dotenv').config({ path: '../.env' });
const sequelize = require('../config/db');
const Food = require('../models/Food');

const foods = [
  { customId: '1', name: "燒餅油條配豆漿", rating: "傳統滋味，酥脆口感，豆香濃郁", description: "傳統手工燒餅、現炸油條、醇厚冰豆漿", location: "豆漿大王", price: "NT$ 45", stars: 4, category: "light", time: ["breakfast"], tags: ["budget", "traditional"], lat: 24.9961, lng: 121.4530 },
  { customId: '2', name: "起司蛋餅", rating: "餅皮酥脆，起司牽絲，喚醒早晨", description: "手工蛋餅皮、切達起司、雞蛋", location: "巷口早餐店", price: "NT$ 40", stars: 5, category: "light", time: ["breakfast", "lunch"], tags: ["budget", "quick", "popular"], lat: 24.9955, lng: 121.4525 },
  { customId: '3', name: "紅燒牛肉麵", rating: "湯頭濃郁，牛肉軟嫩，麵條Q彈", description: "半筋半肉牛肉、手工刀削麵、酸菜、蔥花", location: "老王牛肉麵", price: "NT$ 150", stars: 4, category: "noodle", time: ["lunch", "dinner"], tags: ["spicy", "popular"], lat: 24.9965, lng: 121.4535 },
  { customId: '4', name: "古早味滷肉飯", rating: "滷汁香濃，米飯飽滿，肥瘦適中", description: "秘製滷肉、一等米、滷蛋、醃黃瓜", location: "小吃名店", price: "NT$ 50", stars: 5, category: "rice", time: ["lunch", "dinner"], tags: ["budget", "quick", "popular"], lat: 24.9950, lng: 121.4520 },
  { customId: '5', name: "豚骨叉燒拉麵", rating: "湯頭醇厚，叉燒入口即化", description: "12小時熬製豚骨湯底、秘製叉燒、溏心蛋、黑木耳", location: "拉麵橫丁", price: "NT$ 220", stars: 4, category: "noodle", time: ["lunch", "dinner"], tags: ["popular"], lat: 24.9970, lng: 121.4540 },
  { customId: '6', name: "經典番茄肉醬義大利麵", rating: "醬汁濃郁，麵條彈牙，配料豐富", description: "全熟番茄熬煮肉醬、巴馬乾酪、新鮮羅勒", location: "帕斯塔屋", price: "NT$ 180", stars: 4, category: "western", time: ["lunch", "dinner"], tags: ["popular"], lat: 24.9945, lng: 121.4515 },
  { customId: '7', name: "舒肥雞肉沙拉", rating: "新鮮蔬菜，營養均衡，輕食首選", description: "低溫舒肥雞胸、有機生菜、堅果、特調油醋醬", location: "健康食研所", price: "NT$ 120", stars: 3, category: "light", time: ["breakfast", "lunch"], tags: ["healthy", "vegetarian"], lat: 24.9975, lng: 121.4545 },
  { customId: '8', name: "三寶燒臘飯", rating: "肉質鮮美，皮脆肉嫩，醬汁獨特", description: "脆皮燒鴨、蜜汁叉燒、蔥油雞", location: "廣式燒臘", price: "NT$ 110", stars: 4, category: "rice", time: ["lunch", "dinner"], tags: ["popular", "budget"], lat: 24.9940, lng: 121.4510 }
];

const importData = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL 連線成功...');

    // force: true 會刪除現有資料表並重建 (小心使用)
    await sequelize.sync({ force: true });
    console.log('資料表建立完成...');

    await Food.bulkCreate(foods);
    console.log('資料匯入成功！');

    process.exit();
  } catch (err) {
    console.error('匯入失敗:', err);
    process.exit(1);
  }
};

importData();