require('dotenv').config();
const express = require('express');
const { Store, Style } = require('./models'); // 引入模型
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// === 核心功能：從資料庫獲取資料 (含除錯訊息) ===
async function getFoodsFromDB() {
    try {
        console.log("正在嘗試連線至資料庫...");

        const stores = await Store.findAll({
            include: [{
                model: Style,
                attributes: ['style_id', 'style_name'],
                through: { attributes: [] }
            }]
        });

        console.log(`成功從資料庫撈取 ${stores.length} 筆店家資料`);

        if (stores.length === 0) return [];

        return stores.map(store => {
            const stylesData = store.Styles || [];

            // ★ 關鍵修改：將 ID 與 Name 結合成物件陣列，方便前端直接使用
            // 結果範例：[ { id: 1, name: '早餐' }, { id: 11, name: '麵食' } ]
            const formattedStyles = stylesData.map(s => ({
                id: s.style_id,
                name: s.style_name
            }));

            // 為了相容舊邏輯，我們還是保留純文字的 styleNames 來做分類判斷
            const styleNames = formattedStyles.map(s => s.name);

            let category = 'other';
            let time = [];
            let tags = ['popular'];

            // 時段判斷
            if (styleNames.includes('早餐')) time.push('早餐');
            if (styleNames.includes('午餐')) time.push('午餐');
            if (styleNames.includes('晚餐') || styleNames.includes('宵夜')) time.push('晚餐');
            if (time.length === 0) time = ['午餐', '晚餐'];

            // 分類判斷
            if (styleNames.some(s => ['麵食', '日式'].includes(s))) category = 'noodle';
            else if (styleNames.some(s => ['飯食', '便當', '中式', '韓式', '丼飯'].includes(s))) category = 'rice';
            else if (styleNames.some(s => ['異國料理', '餐酒館', '速食', '義式'].includes(s))) category = 'western';
            else if (styleNames.some(s => ['早餐', '小吃', '飲品', '健康餐盒'].includes(s))) category = 'light';

            const description = styleNames.length > 0
                ? `提供${styleNames.slice(0, 3).join('、')}等美味選擇。`
                : "亞東科大周邊人氣美食。";

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

                // ★ 新增：回傳完整的樣式物件陣列
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
    next();
});

// Routes
app.get('/', (req, res) => res.render('index', { title: 'Welcome' }));
app.get('/home', async (req, res) => {
    const foods = await getFoodsFromDB();
    const allStyles = await Style.findAll();

    // ★ 修改：過濾掉時段相關的標籤 (ID 1~4)，只保留真正的"種類"給下拉選單用
    // 1=早餐, 2=午餐, 3=晚餐, 4=宵夜
    const categoryStyles = allStyles.filter(s => ![1, 2, 3, 4].includes(s.style_id));

    res.render('home', { title: '首頁', foods: foods, styles: categoryStyles });
});

app.get('/stores', async (req, res) => {
    const foods = await getFoodsFromDB();
    const allStyles = await Style.findAll();

    // ★ 修改：同樣過濾掉時段標籤
    const categoryStyles = allStyles.filter(s => ![1, 2, 3, 4].includes(s.style_id));

    res.render('stores', { title: '探索店家', foods: foods, styles: categoryStyles });
});

app.get('/about', (req, res) => res.render('about', { title: '團隊與理念', team: TEAM }));
app.get('/login', (req, res) => res.render('login', { title: '登入' }));

// 模擬 AI 建議 API
app.post('/api/ai-suggestion', (req, res) => {
    const tips = [
        "今天感覺很適合來點重口味的，試試牛肉麵吧！",
        "天氣不錯，吃點清爽的沙拉如何？",
        "根據大數據分析，亞東周邊的麵食最受好評。",
        "別想了，直接吃評價最高的那間！",
        "攝取一點澱粉會讓心情變好喔，吃飯吧！"
    ];
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setTimeout(() => {
        res.json({ text: randomTip });
    }, 600);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});