require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// === 資料來源 (靜態資料) ===
const THEMES = [
  { id: 'default', name: '經典黑白', bg: 'bg-black', text: 'text-white', accent: 'text-white', surface: 'bg-white/10', border: 'border-white/20' },
  { id: 'light', name: '極簡亮白', bg: 'bg-zinc-50', text: 'text-zinc-900', accent: 'text-zinc-900', surface: 'bg-white', border: 'border-zinc-300' },
  { id: 'midnight', name: '午夜深藍', bg: 'bg-slate-950', text: 'text-slate-100', accent: 'text-blue-400', surface: 'bg-slate-900/80', border: 'border-slate-800' },
  { id: 'forest', name: '森林墨綠', bg: 'bg-emerald-950', text: 'text-emerald-50', accent: 'text-emerald-400', surface: 'bg-emerald-900/60', border: 'border-emerald-800' }
];

const FOODS = [
  {
    id: '1', name: "燒餅油條配豆漿", rating: "傳統滋味，酥脆口感，豆香濃郁",
    description: "傳統手工燒餅、現炸油條、醇厚冰豆漿", location: "豆漿大王",
    price: "NT$ 45", stars: 4, category: "light", time: ["breakfast"],
    tags: ["budget", "traditional"], lat: 24.9961, lng: 121.4530
  },
  {
    id: '2', name: "起司蛋餅", rating: "餅皮酥脆，起司牽絲，喚醒早晨",
    description: "手工蛋餅皮、切達起司、雞蛋", location: "巷口早餐店",
    price: "NT$ 40", stars: 5, category: "light", time: ["breakfast", "lunch"],
    tags: ["budget", "quick", "popular"], lat: 24.9955, lng: 121.4525
  },
  {
    id: '3', name: "紅燒牛肉麵", rating: "湯頭濃郁，牛肉軟嫩，麵條Q彈",
    description: "半筋半肉牛肉、手工刀削麵、酸菜、蔥花", location: "老王牛肉麵",
    price: "NT$ 150", stars: 4, category: "noodle", time: ["lunch", "dinner"],
    tags: ["spicy", "popular"], lat: 24.9965, lng: 121.4535
  },
  {
    id: '4', name: "古早味滷肉飯", rating: "滷汁香濃，米飯飽滿，肥瘦適中",
    description: "秘製滷肉、一等米、滷蛋、醃黃瓜", location: "小吃名店",
    price: "NT$ 50", stars: 5, category: "rice", time: ["lunch", "dinner"],
    tags: ["budget", "quick", "popular"], lat: 24.9950, lng: 121.4520
  },
  {
    id: '5', name: "豚骨叉燒拉麵", rating: "湯頭醇厚，叉燒入口即化",
    description: "12小時熬製豚骨湯底、秘製叉燒、溏心蛋、黑木耳", location: "拉麵橫丁",
    price: "NT$ 220", stars: 4, category: "noodle", time: ["lunch", "dinner"],
    tags: ["popular"], lat: 24.9970, lng: 121.4540
  },
  {
    id: '6', name: "經典番茄肉醬義大利麵", rating: "醬汁濃郁，麵條彈牙，配料豐富",
    description: "全熟番茄熬煮肉醬、巴馬乾酪、新鮮羅勒", location: "帕斯塔屋",
    price: "NT$ 180", stars: 4, category: "western", time: ["lunch", "dinner"],
    tags: ["popular"], lat: 24.9945, lng: 121.4515
  },
  {
    id: '7', name: "舒肥雞肉沙拉", rating: "新鮮蔬菜，營養均衡，輕食首選",
    description: "低溫舒肥雞胸、有機生菜、堅果、特調油醋醬", location: "健康食研所",
    price: "NT$ 120", stars: 3, category: "light", time: ["breakfast", "lunch"],
    tags: ["healthy", "vegetarian"], lat: 24.9975, lng: 121.4545
  },
  {
    id: '8', name: "三寶燒臘飯", rating: "肉質鮮美，皮脆肉嫩，醬汁獨特",
    description: "脆皮燒鴨、蜜汁叉燒、蔥油雞", location: "廣式燒臘",
    price: "NT$ 110", stars: 4, category: "rice", time: ["lunch", "dinner"],
    tags: ["popular", "budget"], lat: 24.9940, lng: 121.4510
  }
];

const TEAM = [
  { id: 1, name: "林品承", studentId: "112111113", role: "前端開發、UI設計師", avatar: "person", email: "11211113@mail.aeust.edu.tw", github: "PINCHENG612", description: "專注於極簡主義介面與流暢互動體驗。" },
  { id: 2, name: "林劭瑋", studentId: "112111125", role: "前端開發、UI設計師", avatar: "person", email: "aka0903912930@gmail.com", github: "Zore9464", description: "擅長視覺平衡與色彩心理學應用。" },
  { id: 3, name: "呂佩衫", studentId: "11211121", role: "後端開發、UI設計師", avatar: "person", email: "peishenlu@gmail.com", github: "peishenlu", description: "致力於資料流優化與後端架構穩定性。" }
];

// Middleware
app.use((req, res, next) => {
    res.locals.themes = THEMES;
    res.locals.path = req.path;
    next();
});

// Routes
app.get('/', (req, res) => res.render('index', { title: 'Welcome' }));
app.get('/home', (req, res) => res.render('home', { title: '首頁', foods: FOODS }));
app.get('/stores', (req, res) => res.render('stores', { title: '探索店家', foods: FOODS }));
app.get('/about', (req, res) => res.render('about', { title: '團隊與理念', team: TEAM }));
app.get('/login', (req, res) => res.render('login', { title: '登入' }));

// 模擬 AI 建議 API (不需要 API Key，也不需要資料庫)
app.post('/api/ai-suggestion', (req, res) => {
    const tips = [
        "今天感覺很適合來點重口味的，試試牛肉麵吧！",
        "天氣不錯，吃點清爽的沙拉如何？",
        "辛苦了一天，來點炸物慰勞自己吧！",
        "根據你的歷史紀錄，今天適合嘗試沒吃過的店家！",
        "直覺告訴我，巷口那家店在呼喚你。",
        "別想了，直接吃評價最高的那間！",
        "攝取一點澱粉會讓心情變好喔，吃飯吧！",
        "今天適合來點異國風情，義大利麵是個好選擇。"
    ];
    
    // 隨機選一句
    const randomTip = tips[Math.floor(Math.random() * tips.length)];

    // 模擬一點點延遲，讓使用者感覺「AI 正在思考」
    setTimeout(() => {
        res.json({ text: randomTip });
    }, 600);
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});