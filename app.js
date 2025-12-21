const express = require('express');
const app = express();
const path = require('path');
const { teamMembers, foods } = require('./data');

// 設定 EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 設定靜態檔案
app.use(express.static(path.join(__dirname, 'public')));

// === 路由 ===
app.get('/cover', (req, res) => {
    res.render('cover', { title: 'Welcome - AEUST RNG', page: 'cover' });
});

app.get('/', (req, res) => {
    res.render('index', { 
        title: 'AEUST RNG', 
        page: 'index', 
        teamMembers,
        foodsData: JSON.stringify(foods) 
    });
});

app.get('/about', (req, res) => res.render('about', { title: '關於網站', page: 'about', teamMembers }));
app.get('/map', (req, res) => res.render('map', { title: '美食地圖', page: 'map', teamMembers }));
app.get('/stores', (req, res) => res.render('stores', { title: '店家總覽', page: 'stores', teamMembers, foods }));
app.get('/transport', (req, res) => res.render('transport', { title: '交通資訊', page: 'transport', teamMembers }));
app.get('/login', (req, res) => res.render('login', { title: '會員登入', page: 'login', teamMembers }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});