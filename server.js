require('dotenv').config();
const express = require('express');
const session = require('express-session'); // ★ 新增：引入 Session 管理
const { Store, Style } = require('./models');
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

// === 靜態設定資料 ===
const THEMES = [
    { id: 'default', name: '經典黑白', bg: 'bg-black', text: 'text-white', accent: 'text-white', surface: 'bg-white/10', border: 'border-white/20' },
    { id: 'light', name: '極簡亮白', bg: 'bg-zinc-50', text: 'text-zinc-900', accent: 'text-zinc-900', surface: 'bg-white', border: 'border-zinc-300' },
    { id: 'midnight', name: '午夜深藍', bg: 'bg-slate-950', text: 'text-slate-100', accent: 'text-blue-400', surface: 'bg-slate-900/80', border: 'border-slate-800' },
    { id: 'forest', name: '森林墨綠', bg: 'bg-emerald-950', text: 'text-emerald-50', accent: 'text-emerald-400', surface: 'bg-emerald-900/60', border: 'border-emerald-800' }
];

const TEAM = [
    { id: 1, name: "林品承", studentId: "112111113", role: "前端開發、UI設計師", description: "專注於極簡主義介面與流暢互動體驗。" },
    { id: 2, name: "林劭瑋", studentId: "112111125", role: "前端開發、UI設計師", description: "擅長視覺平衡與色彩心理學應用。" },
    { id: 3, name: "呂佩衫", studentId: "11211121", role: "後端開發、UI設計師", description: "致力於資料流優化與後端架構穩定性。" }
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

app.get('/about', (req, res) => res.render('about', { title: '團隊與理念', team: TEAM }));

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

// ★ 後台儀表板 (Dashboard)
app.get('/admin/dashboard', checkAuth, async (req, res) => {
    try {
        // 抓取原始資料以便編輯 (不經過 getFoodsFromDB 的格式化，方便直接對應欄位)
        const stores = await Store.findAll({ order: [['store_id', 'ASC']] });
        res.render('admin', { title: '後台管理', stores, user: req.session.user });
    } catch (error) {
        res.status(500).send("資料庫錯誤");
    }
});

// ★ API: 更新店家資料
app.post('/admin/update-shop', checkAuth, async (req, res) => {
    const { id, name, rating, address } = req.body;
    try {
        await Store.update(
            { Name: name, rating: rating, address: address },
            { where: { store_id: id } }
        );
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: '更新失敗' });
    }
});

// ★ API: 刪除店家
app.post('/admin/delete-shop', checkAuth, async (req, res) => {
    const { id } = req.body;
    try {
        await Store.destroy({ where: { store_id: id } });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: '刪除失敗' });
    }
});

// ★ 新增：建立新店家的 API
app.post('/admin/create-shop', checkAuth, async (req, res) => {
    const { name, rating, address } = req.body;
    
    // 簡易驗證
    if (!name) return res.json({ success: false, message: '店名為必填' });

    try {
        await Store.create({
            Name: name,
            rating: rating || 4.0, // 若未填寫則預設 4.0
            address: address || '暫無地址',
            // 如果你的資料庫有 lat/lng 欄位且設為 not null，請加上預設值
            latitude: 0, 
            longitude: 0
        });
        res.json({ success: true });
    } catch (error) {
        console.error("Create Error:", error);
        res.json({ success: false, message: '新增店家失敗，請檢查資料庫格式' });
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