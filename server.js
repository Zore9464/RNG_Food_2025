require('dotenv').config();
const express = require('express');
const session = require('express-session'); // ★ 新增：引入 Session 管理
const { sequelize, Store, Style } = require('./models');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ★ 新增：Session 設定
app.use(session({
    secret: 'secret_key_rng_food_2025', // 建議改為隨機長字串
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 } // 登入有效期 1 小時
}));

// server.js

// === 靜態設定資料 ===
const THEMES = [
    // 1. 基礎主題
    { 
        id: 'default', name: '經典黑白', 
        bg: 'bg-black', text: 'text-white', 
        btn: 'bg-white text-black', 
        surface: 'bg-white/10', border: 'border-white/20' 
    },
    { 
        id: 'light', name: '極簡亮白', 
        bg: 'bg-zinc-50', text: 'text-zinc-900', 
        btn: 'bg-zinc-900 text-white', 
        surface: 'bg-white', border: 'border-zinc-300' 
    },
    
    // 2. 深色主題
    { 
        id: 'midnight', name: '午夜深藍', 
        bg: 'bg-slate-950', text: 'text-slate-100', 
        btn: 'bg-blue-600 text-white', 
        surface: 'bg-slate-900/80', border: 'border-slate-800' 
    },
    { 
        id: 'forest', name: '森林墨綠', 
        bg: 'bg-emerald-950', text: 'text-emerald-50', 
        btn: 'bg-emerald-600 text-white', 
        surface: 'bg-emerald-900/60', border: 'border-emerald-800' 
    },

    // 3. 淺色主題 (★ 修改：將藍色改為灰色，其他保持加深版)
    { 
        id: 'grey', name: '雅緻灰調', // ID 改為 grey
        bg: 'bg-gray-200',  // 使用中灰色背景
        text: 'text-gray-950', // 深灰文字
        btn: 'bg-gray-600 text-white', // 深灰按鈕
        surface: 'bg-white/70', 
        border: 'border-gray-300' 
    },
    { 
        id: 'cream', name: '焦糖暖橘', 
        bg: 'bg-orange-200', 
        text: 'text-orange-950', 
        btn: 'bg-orange-600 text-white', 
        surface: 'bg-white/70', 
        border: 'border-orange-300' 
    },
    { 
        id: 'lilac', name: '薰衣草紫', 
        bg: 'bg-purple-200', 
        text: 'text-purple-950', 
        btn: 'bg-purple-600 text-white', 
        surface: 'bg-white/70', 
        border: 'border-purple-300' 
    }
];

const TEAM = [
    { id: 1, name: "林品承", studentId: "112111113", role: "前/後端開發、UI設計", description: "負責前端與後端的網頁程式碼設計，以及後端與資料庫的連接" },
    { id: 2, name: "林劭瑋", studentId: "112111125", role: "前/後端開發、UI設計", description: "負責前端與後端的網頁程式碼設計，以及後端與資料庫的連接" },
    { id: 3, name: "呂佩衫", studentId: "112111121", role: "後端/資料庫架設", description: "負責 MYSQL 資料庫的建立與後端網頁的連接" }
];

// ★ 新增：管理者帳號設定 (三個帳號)
const ADMINS = [
    { user: '112111113', pass: '112111113' },
    { user: '112111121', pass: '112111121' },
    { user: '112111125', pass: '112111125' }
];

// === 核心功能：從資料庫獲取資料 ===
async function getFoodsFromDB() {
    try {
        const stores = await Store.findAll({
            include: [{
                model: Style,
                attributes: ['style_id', 'style_name'],
                through: { attributes: [] }
            }]
        });

        if (stores.length === 0) return [];

        return stores.map(store => {
            const stylesData = store.Styles || [];
            const formattedStyles = stylesData.map(s => ({ id: s.style_id, name: s.style_name }));
            const styleNames = formattedStyles.map(s => s.name);

            let category = 'other';
            let time = [];
            let tags = ['popular'];

            if (styleNames.includes('早餐')) time.push('早餐');
            if (styleNames.includes('午餐')) time.push('午餐');
            if (styleNames.includes('晚餐') || styleNames.includes('宵夜')) time.push('晚餐');
            if (time.length === 0) time = ['午餐', '晚餐'];

            if (styleNames.some(s => ['麵食', '日式'].includes(s))) category = 'noodle';
            else if (styleNames.some(s => ['飯食', '便當', '中式', '韓式', '丼飯'].includes(s))) category = 'rice';
            else if (styleNames.some(s => ['異國料理', '餐酒館', '速食', '義式'].includes(s))) category = 'western';
            else if (styleNames.some(s => ['早餐', '小吃', '飲品', '健康餐盒'].includes(s))) category = 'light';

            const description = styleNames.length > 0 ? `提供${styleNames.slice(0, 3).join('、')}等美味選擇。` : "亞東科大周邊人氣美食。";

            return {
                id: store.store_id.toString(),
                name: store.Name,
                rating: `評分 ${store.rating}，${styleNames[0] || '在地'}推薦`,
                description: description,
                location: store.address,
                price: "價格詳見菜單",
                score: store.rating,
                stars: Math.round(store.rating || 4),
                category: category,
                time: time,
                tags: [...tags, ...styleNames],
                styles: formattedStyles,
                lat: store.latitude ? parseFloat(store.latitude) : 0,
                lng: store.longitude ? parseFloat(store.longitude) : 0
            };
        });
    } catch (error) {
        console.error("資料庫讀取錯誤：", error.message);
        return [];
    }
}

// Middleware
app.use((req, res, next) => {
    res.locals.themes = THEMES;
    res.locals.path = req.path;
    res.locals.user = req.session.user || null; // 讓前端知道使用者是否登入
    next();
});

// ★ 新增：權限檢查 Middleware
const checkAuth = (req, res, next) => {
    if (req.session.user) return next();
    res.redirect('/login');
};

// Routes
app.get('/', (req, res) => res.render('index', { title: 'Welcome' }));
app.get('/home', async (req, res) => {
    const foods = await getFoodsFromDB();
    const allStyles = await Style.findAll();
    const categoryStyles = allStyles.filter(s => ![1, 2, 3, 4].includes(s.style_id));
    res.render('home', { title: '首頁', foods: foods, styles: categoryStyles });
});

app.get('/stores', async (req, res) => {
    const foods = await getFoodsFromDB();
    const allStyles = await Style.findAll();
    const categoryStyles = allStyles.filter(s => ![1, 2, 3, 4].includes(s.style_id));
    res.render('stores', { title: '探索店家', foods: foods, styles: categoryStyles });
});

app.get('/about', (req, res) => res.render('about', { title: '關於我們', team: TEAM }));

// === 登入與後台管理路由 ===

// 顯示登入頁
app.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/admin/dashboard');
    res.render('login', { title: '登入' });
});

// 處理登入請求
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const admin = ADMINS.find(a => a.user === username && a.pass === password);

    if (admin) {
        req.session.user = admin.user;
        return res.json({ success: true });
    }
    return res.json({ success: false, message: '帳號或密碼錯誤' });
});

// 登出
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// ★ 後台儀表板 (Dashboard) - 修改版
app.get('/admin/dashboard', checkAuth, async (req, res) => {
    try {
        // 1. 抓取所有店家，並包含 Style 資訊
        const stores = await Store.findAll({
            include: [{
                model: Style,
                as: 'Styles', // 確保你的 Model 關聯設定正確，若無 alias 可拿掉 as
                through: { attributes: [] } // 不顯示中間表資訊
            }],
            order: [['store_id', 'ASC']]
        });

        // 2. 抓取所有分類樣式 (供下拉選單用)
        const styles = await Style.findAll();

        res.render('admin', {
            title: '後台管理',
            stores: stores,
            styles: styles, // 傳遞分類清單給前端
            user: req.session.user
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("後台資料載入失敗");
    }
});

// ★ API: 更新店家資料 (支援多重分類)
app.post('/admin/update-shop', checkAuth, async (req, res) => {
    // styleIds 預期是一個陣列，例如 [1, 3, 5]
    const { id, name, rating, address, lat, lng, styleIds } = req.body;
    try {
        // 1. 更新基本資料
        await Store.update(
            {
                Name: name,
                rating: rating,
                address: address,
                latitude: lat || 0,
                longitude: lng || 0
            },
            { where: { store_id: id } }
        );

        // 2. 更新多重分類關聯
        // 確保 styleIds 是陣列 (前端若只選一個可能會傳字串，需轉陣列)
        if (styleIds) {
            const store = await Store.findByPk(id);
            const ids = Array.isArray(styleIds) ? styleIds : [styleIds];
            // setStyles 會自動移除舊的並加入新的，達成「同步」效果
            await store.setStyles(ids);
        } else {
            // 如果沒選任何分類，則清空關聯
            const store = await Store.findByPk(id);
            await store.setStyles([]);
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Update Error:", error);
        res.json({ success: false, message: '更新失敗' });
    }
});

// ★ API: 建立新店家 (支援多重分類)
app.post('/admin/create-shop', checkAuth, async (req, res) => {
    const { name, rating, address, lat, lng, styleIds } = req.body;

    if (!name) return res.json({ success: false, message: '店名為必填' });

    try {
        // 1. 建立店家
        const newStore = await Store.create({
            Name: name,
            rating: rating || 4.0,
            address: address || '暫無地址',
            latitude: lat || 0,
            longitude: lng || 0
        });

        // 2. 建立多重分類關聯
        if (styleIds) {
            const ids = Array.isArray(styleIds) ? styleIds : [styleIds];
            await newStore.addStyles(ids);
        }

        res.json({ success: true });
    } catch (error) {
        console.error("Create Error:", error);
        res.json({ success: false, message: '新增店家失敗' });
    }
});

// ★ API: 刪除店家
app.post('/admin/delete-shop', checkAuth, async (req, res) => {
    const { id } = req.body; // 取得前端傳來的店家 ID

    try {
        // 1. 先找出這家店
        const store = await Store.findByPk(id);

        if (!store) {
            return res.json({ success: false, message: '找不到該店家資料' });
        }

        // 2. 關鍵步驟：先移除所有關聯 (解決外鍵約束 ERROR 1451 問題)
        // 這會自動刪除 store_style_map 中該店家的所有紀錄
        await store.setStyles([]); 

        // 3. 關聯清空後，才能安全刪除店家本體
        await store.destroy();

        // 這行指令會告訴 MySQL：「請把下一個 ID 設為目前最大 ID + 1」
        await sequelize.query("ALTER TABLE store AUTO_INCREMENT = 1");
        
        res.json({ success: true });

    } catch (error) {
        console.error("Delete Error:", error);
        // 如果是外鍵錯誤，通常會包含 'foreign key constraint fails'
        if (error.message.includes('foreign key constraint fails')) {
            return res.json({ success: false, message: '刪除失敗：請先確認是否已清除相關聯的分類設定' });
        }
        res.json({ success: false, message: '系統錯誤：刪除失敗' });
    }
});

// 模擬 AI 建議 API
app.post('/api/ai-suggestion', (req, res) => {
    const tips = [
        "今天感覺很適合來點重口味的，試試牛肉麵吧！",
        "天氣不錯，吃點清爽的沙拉如何？",
        "根據大數據分析，亞東周邊的麵食最受好評。",
        "別想了，直接吃評價最高的那間！",
        "攝取一點澱粉會讓心情變好喔，吃飯吧！"
    ];
    setTimeout(() => res.json({ text: tips[Math.floor(Math.random() * tips.length)] }), 600);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});