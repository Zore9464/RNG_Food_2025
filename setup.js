const fs = require('fs');
const path = require('path');

const createDir = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(`📂 建立目錄: ${dirPath}`);
    }
};

const writeFile = (filePath, content) => {
    fs.writeFileSync(filePath, content.trim(), 'utf8');
    console.log(`📄 建立檔案: ${filePath}`);
};

const dirs = ['public/css', 'public/js', 'public/images', 'views/partials'];
dirs.forEach(createDir);

const files = {
    // ---------------- Package.json ----------------
    'package.json': `{
  "name": "aeust-rng-food",
  "version": "1.0.0",
  "description": "AEUST RNG Food Project",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "ejs": "^3.1.9",
    "express": "^4.18.2"
  }
}`,

    // ---------------- Data.js ----------------
    'data.js': `const teamMembers = [
    {
        id: 1, name: "林品承", studentId: "112111113",
        role: "前端開發、UI設計師", avatar: "person",
        email: "11211113@mail.aeust.edu.tw", github: "PINCHENG612",
        description: "負責UI/UX設計與前端互動功能等"
    },
    {
        id: 2, name: "林劭瑋", studentId: "112111125",
        role: "前端開發、UI設計師", avatar: "person",
        email: "aka0903912930@gmail.com", github: "Zore9464",
        description: "負責UI/UX設計與前端互動功能等"
    },
    {
        id: 3, name: "呂佩衫", studentId: "11211121",
        role: "後端開發、UI設計師", avatar: "person",
        email: "peishenlu@gmail.com", github: "peishenlu",
        description: "負責視覺設計與使用者體驗，負責資料庫設計與API開發"
    }
];

const foods = [
    { name: "燒餅油條配豆漿", rating: "傳統滋味，酥脆口感", description: "燒餅、油條、冰豆漿", location: "豆漿大王", price: "NT$ 45", stars: 4, category: "light", time: ["breakfast"], tags: ["budget", "traditional"] },
    { name: "起司蛋餅", rating: "餅皮酥脆，起司牽絲", description: "手工蛋餅皮、切達起司、雞蛋", location: "巷口早餐店", price: "NT$ 40", stars: 5, category: "light", time: ["breakfast", "lunch"], tags: ["budget", "quick", "popular"] },
    { name: "牛肉麵", rating: "湯頭濃郁，牛肉軟嫩", description: "半筋半肉牛肉、手工麵條", location: "台北市大安區", price: "NT$ 150", stars: 4, category: "noodle", time: ["lunch", "dinner"], tags: ["spicy", "popular"] },
    { name: "滷肉飯", rating: "滷汁香濃，米飯飽滿", description: "滷肉、米飯、滷蛋", location: "台北市中正區", price: "NT$ 50", stars: 5, category: "rice", time: ["lunch", "dinner"], tags: ["budget", "quick", "popular"] },
    { name: "日式拉麵", rating: "湯頭醇厚", description: "豚骨湯底、叉燒", location: "台北市信義區", price: "NT$ 220", stars: 4, category: "noodle", time: ["lunch", "dinner"], tags: ["popular"] },
    { name: "義大利麵", rating: "醬汁濃郁", description: "義大利麵、番茄肉醬", location: "台北市中山區", price: "NT$ 180", stars: 4, category: "western", time: ["lunch", "dinner"], tags: ["popular"] },
    { name: "健康沙拉", rating: "新鮮蔬菜", description: "生菜、番茄、雞胸肉", location: "台北市大安區", price: "NT$ 120", stars: 3, category: "light", time: ["breakfast", "lunch"], tags: ["healthy", "vegetarian"] },
    { name: "港式燒臘", rating: "肉質鮮美", description: "燒鴨、叉燒、油雞", location: "台北市萬華區", price: "NT$ 110", stars: 4, category: "rice", time: ["lunch", "dinner"], tags: ["popular", "budget"] },
    { name: "韓式拌飯", rating: "辣醬夠味", description: "米飯、牛肉、蔬菜", location: "台北市松山區", price: "NT$ 160", stars: 4, category: "rice", time: ["lunch", "dinner"], tags: ["spicy", "popular"] },
    { name: "素食餐盒", rating: "清爽不油膩", description: "五穀飯、時蔬", location: "台北市文山區", price: "NT$ 90", stars: 3, category: "light", time: ["lunch", "dinner"], tags: ["vegetarian", "healthy", "budget"] }
];

module.exports = { teamMembers, foods };`,

    // ---------------- App.js ----------------
    'app.js': `const express = require('express');
const app = express();
const path = require('path');
const { teamMembers, foods } = require('./data');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('cover', { title: 'Welcome - AEUST RNG', page: 'cover' });
});

app.get('/index', (req, res) => {
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
    console.log(\`Server running at http://localhost:\${PORT}\`);
});`,

    // ---------------- Style.css (補上載入動畫 CSS + Logo 置中) ----------------
    'public/css/style.css': `/* 全局變數 */
:root {
    --bg-color: #000000;
    --text-color: #ffffff;
    --text-sub: #bdbdbd;
    --accent-color: #ffffff;
    --surface: rgba(255, 255, 255, 0.08);
    --surface-light: rgba(255, 255, 255, 0.12);
    --border-light: rgba(255, 255, 255, 0.15);
    --border-medium: rgba(255, 255, 255, 0.25);
    --option-bg: rgba(0, 0, 0, 0.3);
    --option-bg-hover: rgba(0, 0, 0, 0.4);
    --tag-color: #4a9eff;
    --tag-bg: rgba(74, 158, 255, 0.1);
    --history-bg: rgba(255, 255, 255, 0.05);
    --achievement-gold: #FFD700;
    --achievement-silver: #C0C0C0;
    --achievement-bronze: #CD7F32;
    --timer-warning: #ff4444;
    --timer-normal: #4CAF50;
    --roulette-color: #ff3366;
    --shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
    --map-filter: grayscale(100%) invert(100%) contrast(90%);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    min-height: 100vh;
    line-height: 1.6;
    transition: background-color 0.5s ease, color 0.5s ease;
    overflow-x: hidden;
    padding-top: 80px;
}

/* === 載入動畫樣式 (新增) === */
.loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: var(--bg-color);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    transition: opacity 0.5s ease, visibility 0.5s ease;
}

.loading-screen.hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
}

.loading-animation {
    position: relative;
    width: 100px;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}

.loading-circle {
    width: 80px;
    height: 80px;
    border: 4px solid var(--surface-light);
    border-top: 4px solid var(--accent-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

.loading-text {
    font-size: 1.2rem;
    letter-spacing: 5px;
    color: var(--text-color);
    font-weight: 300;
    animation: pulse 1.5s ease-in-out infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

@keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
}

/* 導覽列 */
.navbar {
    position: fixed; top: 0; left: 0; width: 100%; height: 70px;
    background-color: var(--surface);
    backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--border-light);
    display: flex; justify-content: space-between; align-items: center;
    padding: 0 20px; z-index: 1000;
}

.nav-side { display: flex; gap: 10px; align-items: center; flex: 1; }
.nav-left { justify-content: flex-start; }
.nav-right { justify-content: flex-end; }

/* Logo 絕對置中 */
.nav-logo { 
    font-size: 1.8rem; font-weight: 300; color: var(--text-color); 
    text-decoration: none; letter-spacing: 15px; position: absolute;
    left: 50%; transform: translateX(-50%);
    text-align: center; margin-right: -15px; white-space: nowrap; 
}
.nav-logo::after { content: ''; position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%); width: 180px; height: 1px; background-color: var(--text-color); opacity: 0.8; }

.nav-btn { display: flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: 8px; color: var(--text-color); text-decoration: none; background: transparent; border: none; font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease; }
.nav-btn:hover { background-color: var(--surface-light); }
.nav-btn.active { background-color: var(--accent-color); color: var(--bg-color); }

/* Modal */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px); z-index: 2000; display: flex; justify-content: center; align-items: center; opacity: 0; visibility: hidden; transition: all 0.3s ease; }
.modal-overlay.active { opacity: 1; visibility: visible; }
.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; border-bottom: 1px solid var(--border-light); padding-bottom: 15px; }
.modal-title { font-size: 1.4rem; font-weight: 300; letter-spacing: 1px; color: var(--text-color); }
.close-modal-btn { background: none; border: none; color: var(--text-color); cursor: pointer; transition: transform 0.2s; }
.close-modal-btn:hover { transform: rotate(90deg); }

/* 成員卡片 */
.team-intro { text-align: center; color: var(--text-sub); margin-bottom: 30px; font-size: 0.95rem; }
.team-members { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; }
.member-card { background-color: var(--surface); border: 1px solid var(--border-light); border-radius: 16px; padding: 25px; display: flex; flex-direction: column; align-items: center; text-align: center; transition: all 0.3s ease; }
.member-card:hover { transform: translateY(-5px); border-color: var(--accent-color); background-color: var(--surface-light); }
.member-avatar { width: 70px; height: 70px; border-radius: 50%; background-color: var(--surface-light); border: 2px solid var(--border-medium); display: flex; align-items: center; justify-content: center; margin-bottom: 15px; color: var(--text-color); }
.member-name { font-size: 1.2rem; font-weight: 600; color: var(--text-color); margin-bottom: 5px; }
.member-role { color: var(--accent-color); font-size: 0.9rem; font-weight: 500; margin-bottom: 10px; }
.member-desc { font-size: 0.9rem; color: var(--text-sub); margin-bottom: 15px; flex-grow: 1; }
.member-links { display: flex; gap: 15px; margin-top: auto; }
.link-btn { color: var(--text-sub); transition: color 0.2s; text-decoration: none; }
.link-btn:hover { color: var(--accent-color); }

/* 背景裝飾 */
.bg-lines { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; opacity: 0.05; pointer-events: none; }
.line { position: absolute; background-color: var(--text-color); }
.v-line { width: 1px; height: 100%; left: 20%; }
.v-line:nth-child(2) { left: 80%; }

/* RWD */
@media (max-width: 900px) {
    .navbar { height: auto; flex-direction: column; padding: 10px; }
    .nav-side { width: 100%; justify-content: center; margin: 5px 0; flex-wrap: wrap; }
    .nav-logo { position: static; transform: none; order: -1; margin-bottom: 5px; }
    body { padding-top: 140px; }
    .nav-btn span:last-child { display: none; }
    .nav-btn { padding: 8px; }
}`,

    // ---------------- Views Partials ----------------
    'views/partials/head.ejs': `<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= title %></title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0" />
    <link rel="stylesheet" href="/css/style.css">
    <% if (typeof customCss !== 'undefined') { %><style><%- customCss %></style><% } %>
</head>`,

    'views/partials/navbar.ejs': `<nav class="navbar" id="navbar">
    <div class="nav-side nav-left">
        <button class="nav-btn" id="teamBtn">
            <span class="material-symbols-rounded">groups</span>
            <span>關於開發者團隊</span>
        </button>
        <a href="/about" class="nav-btn <%= page === 'about' ? 'active' : '' %>">
            <span class="material-symbols-rounded">info</span>
            <span>關於網站</span>
        </a>
        <a href="/map" class="nav-btn <%= page === 'map' ? 'active' : '' %>">
            <span class="material-symbols-rounded">map</span>
            <span>美食地圖搜尋</span>
        </a>
    </div>
    <a href="/index" class="nav-logo">AEUST RNG</a>
    <div class="nav-side nav-right">
        <% if (page === 'index') { %>
        <button class="nav-btn" id="dashboardBtn">
            <span class="material-symbols-rounded">bar_chart</span><span>儀錶板</span>
        </button>
        <% } %>
        <a href="/stores" class="nav-btn <%= page === 'stores' ? 'active' : '' %>">
            <span class="material-symbols-rounded">store</span><span>店家總覽</span>
        </a>
        <a href="/transport" class="nav-btn <%= page === 'transport' ? 'active' : '' %>">
            <span class="material-symbols-rounded">commute</span><span>交通資訊</span>
        </a>
        <a href="/login" class="nav-btn <%= page === 'login' ? 'active' : '' %>">
            <span class="material-symbols-rounded">login</span><span>會員登入</span>
        </a>
        <button class="nav-btn" id="settingsBtn">
            <span class="material-symbols-rounded">settings</span><span>背景設定</span>
        </button>
    </div>
</nav>`,

    'views/partials/modals.ejs': `<div class="modal-overlay" id="settingsModalOverlay">
    <div class="settings-modal" style="background-color: var(--bg-color); border: 1px solid var(--border-medium); border-radius: 16px; padding: 30px; width: 90%; max-width: 400px; transform: scale(0.9); transition: all 0.3s;">
        <div class="modal-header">
            <span class="modal-title">網站設定</span>
            <button class="close-modal-btn" id="closeSettingsBtn"><span class="material-symbols-rounded">close</span></button>
        </div>
        <div class="setting-item" style="margin-bottom: 20px;">
            <label style="display:block; margin-bottom:10px; color:var(--text-sub);">色彩主題風格</label>
            <select id="themeSelector" style="width: 100%; padding: 12px; background-color: var(--surface); border: 1px solid var(--border-light); border-radius: 8px; color: var(--text-color);">
                <option value="default">經典黑白</option>
                <option value="light">極簡亮白</option>
                <option value="midnight">午夜深藍</option>
                <option value="forest">森林墨綠</option>
                <option value="latte">暖色拿鐵</option>
                <option value="lavender">薰衣草紫</option>
                <option value="sakura">櫻花淺粉</option>
            </select>
        </div>
    </div>
</div>

<div class="modal-overlay" id="teamModalOverlay">
    <div class="team-modal" style="background-color: var(--bg-color); border: 1px solid var(--border-medium); border-radius: 20px; padding: 30px; width: 90%; max-width: 900px;">
        <div class="modal-header">
            <span class="modal-title">開發團隊</span>
            <button class="close-modal-btn" id="closeTeamBtn"><span class="material-symbols-rounded">close</span></button>
        </div>
        <p class="team-intro">AEUST RNG美食網站由一群熱愛美食與程式設計的高質量人類共同打造！</p>
        <div class="team-members">
            <% if (typeof teamMembers !== 'undefined') { %>
                <% teamMembers.forEach(member => { %>
                    <div class="member-card">
                        <div class="member-avatar"><span class="material-symbols-rounded"><%= member.avatar %></span></div>
                        <h3 class="member-name"><%= member.name %></h3>
                        <div style="font-size: 0.85rem; font-family: monospace; color: var(--text-sub); background: var(--surface-light); padding: 2px 8px; border-radius: 4px; margin-bottom: 10px;"><%= member.studentId %></div>
                        <div class="member-role"><%= member.role %></div>
                        <p class="member-desc"><%= member.description %></p>
                        <div class="member-links">
                            <a href="mailto:<%= member.email %>" class="link-btn"><span class="material-symbols-rounded">mail</span></a>
                            <a href="https://github.com/<%= member.github %>" target="_blank" class="link-btn"><span class="material-symbols-rounded">code</span></a>
                        </div>
                    </div>
                <% }); %>
            <% } %>
        </div>
    </div>
</div>`,

    'views/partials/scripts.ejs': `<script>
    const themes = {
        default: { '--bg-color': '#000000', '--text-color': '#ffffff', '--text-sub': '#bdbdbd', '--accent-color': '#ffffff', '--surface': 'rgba(255, 255, 255, 0.08)', '--surface-light': 'rgba(255, 255, 255, 0.12)', '--border-light': 'rgba(255, 255, 255, 0.15)', '--border-medium': 'rgba(255, 255, 255, 0.25)', '--option-bg': 'rgba(0, 0, 0, 0.3)', '--map-filter': 'grayscale(100%) invert(100%) contrast(90%)' },
        light: { '--bg-color': '#f2f2f7', '--text-color': '#1c1c1e', '--text-sub': '#636366', '--accent-color': '#000000', '--surface': 'rgba(255, 255, 255, 0.8)', '--surface-light': 'rgba(255, 255, 255, 0.6)', '--border-light': 'rgba(0, 0, 0, 0.1)', '--border-medium': 'rgba(0, 0, 0, 0.2)', '--option-bg': 'rgba(255, 255, 255, 0.5)', '--map-filter': 'none' },
        midnight: { '--bg-color': '#0f172a', '--text-color': '#e2e8f0', '--text-sub': '#94a3b8', '--accent-color': '#38bdf8', '--surface': 'rgba(30, 41, 59, 0.7)', '--surface-light': 'rgba(51, 65, 85, 0.6)', '--border-light': 'rgba(148, 163, 184, 0.2)', '--border-medium': 'rgba(148, 163, 184, 0.4)', '--option-bg': 'rgba(15, 23, 42, 0.5)', '--map-filter': 'none' },
        forest: { '--bg-color': '#051910', '--text-color': '#e8f5e9', '--text-sub': '#a5d6a7', '--accent-color': '#66bb6a', '--surface': 'rgba(255, 255, 255, 0.05)', '--surface-light': 'rgba(255, 255, 255, 0.1)', '--border-light': 'rgba(165, 214, 167, 0.2)', '--border-medium': 'rgba(165, 214, 167, 0.3)', '--option-bg': 'rgba(0, 20, 10, 0.4)', '--map-filter': 'none' },
        latte: { '--bg-color': '#2c241b', '--text-color': '#ede0d4', '--text-sub': '#bcaaa4', '--accent-color': '#d7ccc8', '--surface': 'rgba(255, 255, 255, 0.06)', '--surface-light': 'rgba(255, 255, 255, 0.1)', '--border-light': 'rgba(215, 204, 200, 0.2)', '--border-medium': 'rgba(215, 204, 200, 0.3)', '--option-bg': 'rgba(62, 39, 35, 0.4)', '--map-filter': 'none' },
        lavender: { '--bg-color': '#f3e8ff', '--text-color': '#4c1d95', '--text-sub': '#7c3aed', '--accent-color': '#8b5cf6', '--surface': 'rgba(255, 255, 255, 0.6)', '--surface-light': 'rgba(255, 255, 255, 0.8)', '--border-light': 'rgba(139, 92, 246, 0.2)', '--border-medium': 'rgba(139, 92, 246, 0.3)', '--option-bg': 'rgba(139, 92, 246, 0.1)', '--map-filter': 'none' },
        sakura: { '--bg-color': '#fff0f5', '--text-color': '#9d174d', '--text-sub': '#db2777', '--accent-color': '#f472b6', '--surface': 'rgba(255, 255, 255, 0.6)', '--surface-light': 'rgba(255, 255, 255, 0.8)', '--border-light': 'rgba(236, 72, 153, 0.2)', '--border-medium': 'rgba(236, 72, 153, 0.3)', '--option-bg': 'rgba(236, 72, 153, 0.1)', '--map-filter': 'none' }
    };

    function applyTheme(themeName) {
        const theme = themes[themeName] || themes['default'];
        const root = document.documentElement;
        for (const [key, value] of Object.entries(theme)) {
            root.style.setProperty(key, value);
        }
        localStorage.setItem('rng_theme', themeName);
    }

    document.addEventListener('DOMContentLoaded', () => {
        const savedTheme = localStorage.getItem('rng_theme') || 'default';
        const themeSelector = document.getElementById('themeSelector');
        if(themeSelector) {
            themeSelector.value = savedTheme;
            themeSelector.addEventListener('change', (e) => applyTheme(e.target.value));
        }
        applyTheme(savedTheme);

        const setupModal = (btnId, modalId, closeId) => {
            const btn = document.getElementById(btnId);
            const modal = document.getElementById(modalId);
            const close = document.getElementById(closeId);
            if(btn && modal && close) {
                btn.addEventListener('click', (e) => { e.preventDefault(); modal.classList.add('active'); });
                close.addEventListener('click', () => modal.classList.remove('active'));
                modal.addEventListener('click', (e) => { if(e.target === modal) modal.classList.remove('active'); });
            }
        };

        setupModal('settingsBtn', 'settingsModalOverlay', 'closeSettingsBtn');
        setupModal('teamBtn', 'teamModalOverlay', 'closeTeamBtn');
    });
</script>`,

    // ---------------- Views Pages ----------------
    'views/index.ejs': `<!DOCTYPE html>
<html lang="zh-TW">
<%- include('partials/head', { title: 'AEUST RNG', customCss: \`
    .dashboard-modal { background-color: var(--bg-color); border: 1px solid var(--border-medium); border-radius: 20px; padding: 30px; width: 90%; max-width: 800px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); transform: scale(0.9); transition: all 0.3s; max-height: 90vh; overflow-y: auto; }
    .dashboard-content { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .dashboard-content .indecision-panel { grid-column: 1 / -1; }
    .container { margin-top: 100px; max-width: 1000px; margin-left: auto; margin-right: auto; padding: 0 30px 40px; display: grid; grid-template-columns: 1fr; grid-template-areas: "header" "ai" "buttons" "filter" "history" "result"; gap: 25px; opacity: 0; transition: opacity 0.5s; }
    .container.loaded { opacity: 1; }
    .filter-section { padding: 25px; background: var(--surface-light); border-radius: 16px; border: 1px solid var(--border-light); overflow: hidden; height: fit-content; transition: max-height 0.3s; }
    .filter-section.collapsed .filter-content { max-height: 0; opacity: 0; margin: 0; padding: 0; }
    .filter-header { display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding-bottom: 15px; border-bottom: 1px solid var(--border-light); margin-bottom: 15px; }
    .filter-content { max-height: 1000px; transition: all 0.5s; opacity: 1; }
    .option-group { margin-bottom: 25px; padding: 15px; background: var(--option-bg); border-radius: 8px; border: 1px solid var(--border-light); }
    .tag-label { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; background: var(--tag-bg); border: 1px solid var(--border-light); border-radius: 20px; font-size: 0.85rem; cursor: pointer; margin: 5px; }
    .tag-label input { margin-right: 5px; }
    .button-section { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
    .random-btn, .quick-decision-btn { width: 100%; padding: 20px; font-size: 1.1rem; border-radius: 12px; cursor: pointer; border: 1px solid var(--text-color); background: transparent; color: var(--text-color); display: flex; align-items: center; justify-content: center; gap: 10px; }
    .quick-decision-btn { background: linear-gradient(135deg, #667eea, #764ba2); border: none; color: white; }
    .result-section { display: none; background: var(--surface-light); padding: 30px; border-radius: 16px; margin-top: 30px; }
    .result-section.show { display: block; animation: fadeIn 0.5s; }
    @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
\` }) %>
<body>
    <%- include('partials/modals') %>
    
    <div class="modal-overlay" id="dashboardModalOverlay">
        <div class="dashboard-modal">
            <div class="modal-header">
                <span class="modal-title">個人美食儀錶板</span>
                <button class="close-modal-btn" id="closeDashboardBtn"><span class="material-symbols-rounded">close</span></button>
            </div>
            <div class="dashboard-content">
                <div class="indecision-panel" style="background: var(--surface); border: none; padding: 20px; text-align: center;">
                    <h3>選擇困難指數</h3>
                    <div id="indecisionScore" style="font-size: 2rem; font-weight: bold; margin: 10px 0;">0%</div>
                    <div style="height: 20px; background: linear-gradient(90deg, #4CAF50, #FF9800, #ff4444); border-radius: 10px; position: relative; overflow: hidden;">
                        <div id="indecisionMeterFill" style="height: 100%; background: var(--surface-light); position: absolute; right: 0; width: 100%; transition: width 1s;"></div>
                    </div>
                </div>
                <div class="stats-panel" style="background: var(--surface); padding: 20px;">
                    <h3>統計數據</h3>
                    <div id="statsGrid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 10px;"></div>
                </div>
                <div class="achievements-panel" style="background: var(--surface); padding: 20px;">
                    <h3>成就</h3>
                    <div id="achievementsGrid" style="display: grid; gap: 10px; margin-top: 10px;"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="loading-screen" id="loadingScreen">
        <div class="loading-animation">
            <div class="loading-circle"></div>
            <div class="loading-text" style="margin-left: 20px;">AEUST RNG</div>
        </div>
    </div>

    <%- include('partials/navbar', { page: 'index' }) %>

    <div class="container" id="mainContainer">
        <header class="page-header" style="text-align: center;">
            <h1 style="font-size: 3rem; margin-bottom: 10px;">今天吃什麼？</h1>
            <p class="subtitle">解決你的選擇困難症</p>
        </header>

        <div class="ai-section" style="grid-area: ai; background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1)); padding: 20px; border-radius: 16px; border: 1px solid rgba(102,126,234,0.3);">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; font-size: 1.1rem;">
                <span class="material-symbols-rounded">psychology</span> AI決策小幫手建議
            </div>
            <div id="aiContent" style="color: var(--text-sub);">根據你的歷史記錄，AI會在這裡提供個性化建議！</div>
        </div>

        <div class="button-section">
            <button class="random-btn" id="randomFoodBtn"><span class="material-symbols-rounded">casino</span> 開始隨機抽選</button>
            <button class="quick-decision-btn" id="quickDecisionBtn"><span class="material-symbols-rounded">bolt</span> 立即決定模式</button>
        </div>

        <div class="filter-section collapsed" id="filterSection">
            <div class="filter-header" id="filterToggleBtn">
                <div style="display:flex; align-items:center; gap:10px;">
                    <span class="material-symbols-rounded">tune</span> <span>進階篩選選項</span>
                </div>
                <span class="material-symbols-rounded filter-toggle-icon">expand_more</span>
            </div>
            <div class="filter-content">
                <div class="option-group">
                    <label>時段選擇</label>
                    <div class="radio-group">
                        <label><input type="radio" name="mealTime" value="all" checked> 不限時段</label>
                        <label><input type="radio" name="mealTime" value="breakfast"> 早餐</label>
                        <label><input type="radio" name="mealTime" value="lunch"> 午餐</label>
                        <label><input type="radio" name="mealTime" value="dinner"> 晚餐</label>
                    </div>
                </div>
                <div class="option-group">
                    <label>食物種類</label>
                    <select id="foodCategory">
                        <option value="all">全部顯示</option>
                        <option value="noodle">麵食愛好</option>
                        <option value="rice">米飯主義</option>
                        <option value="western">西式/異國</option>
                        <option value="light">輕食/早點</option>
                    </select>
                </div>
                <div class="option-group">
                    <label>特色標籤</label>
                    <div style="display: flex; flex-wrap: wrap;">
                        <label class="tag-label"><input type="checkbox" name="foodTags" value="spicy"> 辣味</label>
                        <label class="tag-label"><input type="checkbox" name="foodTags" value="vegetarian"> 素食</label>
                        <label class="tag-label"><input type="checkbox" name="foodTags" value="budget"> 平價</label>
                    </div>
                </div>
            </div>
        </div>

        <div class="result-section" id="resultContainer">
            <div style="text-align: center; margin-bottom: 20px;">
                <button onclick="document.querySelector('.button-section').style.display='grid'; document.getElementById('resultContainer').classList.remove('show');" style="background:none; border:none; color:var(--text-sub); cursor:pointer;">← 返回</button>
                <h2 id="foodName" style="font-size: 2.2rem; margin: 10px 0;"></h2>
                <div id="foodStars" style="color: var(--text-color); font-size: 1.5rem; letter-spacing: 5px;"></div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div style="background: var(--option-bg); padding: 15px; border-radius: 8px;">評價: <span id="foodRating"></span></div>
                <div style="background: var(--option-bg); padding: 15px; border-radius: 8px;">內容: <span id="foodDescription"></span></div>
                <div style="background: var(--option-bg); padding: 15px; border-radius: 8px;">地點: <span id="foodLocation"></span></div>
                <div style="background: var(--option-bg); padding: 15px; border-radius: 8px;">價格: <span id="foodPrice"></span></div>
            </div>
        </div>
    </div>

    <%- include('partials/scripts') %>
    <script>
        const foods = <%- foodsData %>;
        let decisionStats = JSON.parse(localStorage.getItem('decisionStats')) || { totalDecisions: 0, categories: {}, tags: {}, timeSlots: {}, avgDecisionTime: 0, totalDecisionTime: 0 };
        
        const dashboardBtn = document.getElementById('dashboardBtn');
        const dashboardModal = document.getElementById('dashboardModalOverlay');
        const closeDashboardBtn = document.getElementById('closeDashboardBtn');
        if(dashboardBtn) dashboardBtn.addEventListener('click', (e) => { e.preventDefault(); dashboardModal.classList.add('active'); updateStatsDisplay(); });
        if(closeDashboardBtn) closeDashboardBtn.addEventListener('click', () => dashboardModal.classList.remove('active'));

        document.getElementById('filterToggleBtn').addEventListener('click', function() {
            document.getElementById('filterSection').classList.toggle('collapsed');
            this.querySelector('.filter-toggle-icon').style.transform = document.getElementById('filterSection').classList.contains('collapsed') ? 'rotate(-90deg)' : 'rotate(0deg)';
        });

        function randomFood() {
            const selectedTime = document.querySelector('input[name="mealTime"]:checked').value;
            const selectedCategory = document.getElementById('foodCategory').value;
            const filtered = foods.filter(f => 
                (selectedTime === 'all' || f.time.includes(selectedTime)) &&
                (selectedCategory === 'all' || f.category === selectedCategory)
            );
            
            if(filtered.length === 0) { alert('無符合條件的食物'); return; }
            const food = filtered[Math.floor(Math.random() * filtered.length)];
            
            document.querySelector('.button-section').style.display = 'none';
            const res = document.getElementById('resultContainer');
            res.classList.add('show');
            document.getElementById('foodName').innerText = food.name;
            document.getElementById('foodRating').innerText = food.rating;
            document.getElementById('foodDescription').innerText = food.description;
            document.getElementById('foodLocation').innerText = food.location;
            document.getElementById('foodPrice').innerText = food.price;
            document.getElementById('foodStars').innerHTML = '★'.repeat(food.stars) + '☆'.repeat(5-food.stars);
            
            decisionStats.totalDecisions++;
            localStorage.setItem('decisionStats', JSON.stringify(decisionStats));
            
            document.getElementById('indecisionScore').innerText = Math.min(100, decisionStats.totalDecisions * 2) + "%";
            document.getElementById('indecisionMeterFill').style.width = (100 - Math.min(100, decisionStats.totalDecisions * 2)) + "%";
        }

        document.getElementById('randomFoodBtn').addEventListener('click', randomFood);
        document.getElementById('quickDecisionBtn').addEventListener('click', randomFood);

        function updateStatsDisplay() {
            document.getElementById('statsGrid').innerHTML = \`
                <div class="stat-item" style="text-align:center; padding:10px; background:var(--surface); border-radius:8px;">
                    <div style="font-size:1.5rem; font-weight:bold;">\${decisionStats.totalDecisions}</div><div>總決策數</div>
                </div>\`;
        }

        if(sessionStorage.getItem('visited')) {
            document.getElementById('loadingScreen').style.display = 'none';
            document.getElementById('mainContainer').classList.add('loaded');
        } else {
            setTimeout(() => {
                document.getElementById('loadingScreen').classList.add('hidden');
                document.getElementById('mainContainer').classList.add('loaded');
                sessionStorage.setItem('visited', 'true');
            }, 1500);
        }
    </script>
</body>
</html>`,

    'views/about.ejs': `<!DOCTYPE html>
<html lang="zh-TW">
<%- include('partials/head', { title: '關於網站', customCss: \`.section-card { background: var(--surface); border: 1px solid var(--border-light); border-radius: 16px; padding: 40px; margin-bottom: 30px; backdrop-filter: blur(10px); }\` }) %>
<body>
    <%- include('partials/modals') %>
    <div class="bg-lines"><div class="line v-line"></div><div class="line v-line"></div></div>
    <%- include('partials/navbar', { page: 'about' }) %>
    
    <div class="container" style="max-width: 800px; margin: 100px auto; padding: 0 20px;">
        <header style="text-align: center; margin-bottom: 60px;">
            <h1 style="font-size: 2.5rem; margin-bottom: 10px;">關於 AEUST RNG</h1>
            <div class="subtitle" style="color: var(--text-sub);">解決人類歷史上最困難的決定</div>
        </header>
        <article class="section-card">
            <h2 style="font-size: 1.5rem; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                <span class="material-symbols-rounded" style="color: var(--accent-color);">lightbulb</span> 設計初衷
            </h2>
            <p style="color: var(--text-sub); margin-bottom: 20px;">「今天午餐吃什麼？」這大概是上班族和學生每天最常問、也最難回答的問題。</p>
        </article>
        <article class="section-card">
            <h2 style="font-size: 1.5rem; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                <span class="material-symbols-rounded" style="color: var(--accent-color);">code</span> 開發技術
            </h2>
            <p style="color: var(--text-sub);">本網站採用純粹的 HTML5、CSS3 與 JavaScript 構建 (現已升級為 Node.js + EJS)，確保輕量化與極致的載入速度。</p>
        </article>
    </div>
    <%- include('partials/scripts') %>
</body>
</html>`,

    'views/map.ejs': `<!DOCTYPE html>
<html lang="zh-TW">
<%- include('partials/head', { title: '美食地圖', customCss: \`#map { width: 100%; height: calc(100vh - 70px); margin-top: 70px; background: var(--bg-color); } .leaflet-tile-pane { filter: var(--map-filter); }\` }) %>
<head>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.min.css" />
</head>
<body>
    <%- include('partials/modals') %>
    <%- include('partials/navbar', { page: 'map' }) %>
    <div id="map"></div>
    <%- include('partials/scripts') %>
    <script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.min.js"></script>
    <script>
        const map = L.map('map').setView([25.0478, 121.5170], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map);
        // 範例標記
        L.marker([25.0488, 121.5180]).addTo(map).bindPopup('老王牛肉麵');
    </script>
</body>
</html>`,

    'views/stores.ejs': `<!DOCTYPE html>
<html lang="zh-TW">
<%- include('partials/head', { title: '店家總覽', customCss: \`.store-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; } .store-card { background: var(--surface); border: 1px solid var(--border-light); border-radius: 16px; padding: 25px; transition: transform 0.3s; } .store-card:hover { transform: translateY(-5px); border-color: var(--accent-color); }\` }) %>
<body>
    <%- include('partials/modals') %>
    <div class="bg-lines"><div class="line v-line"></div><div class="line v-line"></div></div>
    <%- include('partials/navbar', { page: 'stores' }) %>
    
    <div class="container" style="max-width: 1000px; margin: 100px auto; padding: 0 20px;">
        <header style="text-align: center; margin-bottom: 50px;">
            <h1 style="font-size: 2.5rem; margin-bottom: 10px;">所有店家資訊</h1>
            <div class="subtitle" style="color: var(--text-sub);">探索收錄在資料庫中的美味名單</div>
        </header>
        <div class="store-grid">
            <% foods.forEach(food => { %>
                <div class="store-card">
                    <div style="display:flex; justify-content:space-between; margin-bottom:15px;">
                        <h3 style="font-size:1.4rem; color:var(--text-color);"><%= food.location %></h3>
                        <span style="color:var(--accent-color); border:1px solid var(--border-light); padding:4px 10px; border-radius:20px;"><%= food.price %></span>
                    </div>
                    <div style="color:var(--text-color); margin-bottom:15px;">
                        <% for(let i=0; i<5; i++) { %><%= i < food.stars ? '★' : '☆' %><% } %>
                    </div>
                    <p style="font-weight:500; margin-bottom:5px;"><%= food.name %></p>
                    <p style="color:var(--text-sub); font-size:0.95rem;"><%= food.description %></p>
                </div>
            <% }); %>
        </div>
    </div>
    <%- include('partials/scripts') %>
</body>
</html>`,

    'views/transport.ejs': `<!DOCTYPE html>
<html lang="zh-TW">
<%- include('partials/head', { title: '交通資訊', customCss: \`.info-card { background: var(--surface); border: 1px solid var(--border-light); border-radius: 16px; padding: 30px; margin-bottom: 25px; backdrop-filter: blur(10px); } h2 { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid var(--border-light); padding-bottom: 10px; } .map-frame { width: 100%; height: 350px; border-radius: 12px; border: 0; filter: var(--map-filter); }\` }) %>
<body>
    <%- include('partials/modals') %>
    <div class="bg-lines"><div class="line v-line"></div><div class="line v-line"></div></div>
    <%- include('partials/navbar', { page: 'transport' }) %>
    
    <div class="container" style="max-width: 900px; margin: 100px auto; padding: 0 20px;">
        <header style="text-align: center; margin-bottom: 40px;">
            <h1 style="font-size: 2.2rem; margin-bottom: 10px;">交通資訊</h1>
            <p class="subtitle" style="color: var(--text-sub);">如何抵達 AEUST 周邊美食圈</p>
        </header>
        <div class="info-card">
            <h2><span class="material-symbols-rounded" style="color: var(--accent-color);">map</span>地理位置</h2>
            <iframe class="map-frame" src="https://maps.google.com/maps?q=AEUST&t=&z=15&ie=UTF8&iwloc=&output=embed"></iframe>
        </div>
        <div class="info-card">
            <h2><span class="material-symbols-rounded" style="color: var(--accent-color);">directions_bus</span>大眾運輸</h2>
            <p style="color: var(--text-color);">捷運：中和新蘆線【輔大站】1號出口。</p>
        </div>
    </div>
    <%- include('partials/scripts') %>
</body>
</html>`,

    'views/login.ejs': `<!DOCTYPE html>
<html lang="zh-TW">
<%- include('partials/head', { title: '會員登入', customCss: \`.login-card { background: var(--surface); border: 1px solid var(--border-light); border-radius: 24px; padding: 40px; width: 100%; max-width: 400px; margin: 100px auto; text-align: center; } .input-field { width: 100%; padding: 14px 16px; background: var(--option-bg); border: 1px solid var(--border-light); border-radius: 12px; color: var(--text-color); margin-bottom: 20px; } .login-btn { width: 100%; padding: 14px; background: var(--text-color); color: var(--bg-color); border: none; border-radius: 12px; font-weight: 600; cursor: pointer; }\` }) %>
<body>
    <%- include('partials/modals') %>
    <div class="bg-lines"><div class="line v-line"></div><div class="line v-line"></div></div>
    <%- include('partials/navbar', { page: 'login' }) %>
    
    <div class="container" style="display:flex; justify-content:center; align-items:center; min-height:80vh;">
        <div class="login-card">
            <div style="width: 80px; height: 80px; background: var(--surface-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; border: 2px solid var(--border-medium);">
                <span class="material-symbols-rounded" style="font-size: 40px;">person</span>
            </div>
            <h2 style="font-size: 1.8rem; font-weight: 300; margin-bottom: 5px;">會員登入</h2>
            <p style="color: var(--text-sub); margin-bottom: 30px;">歡迎回到 AEUST RNG</p>
            <form onsubmit="event.preventDefault(); alert('測試登入成功！'); window.location.href='/index';">
                <input type="text" class="input-field" placeholder="學號" required>
                <input type="password" class="input-field" placeholder="密碼" required>
                <button type="submit" class="login-btn">登入</button>
            </form>
        </div>
    </div>
    <%- include('partials/scripts') %>
</body>
</html>`,

    'views/cover.ejs': `<!DOCTYPE html>
<html lang="zh-TW">
<%- include('partials/head', { title: 'Welcome - AEUST RNG', customCss: \`body { display: flex; justify-content: center; align-items: center; min-height: 100vh; overflow: hidden; } .cover-container { text-align: center; z-index: 1; } h1 { font-size: 5rem; font-weight: 300; margin-bottom: 80px; letter-spacing: 8px; } button { background: transparent; color: var(--text-color); border: 1px solid var(--border-medium); padding: 20px 60px; font-size: 1.3rem; letter-spacing: 3px; cursor: pointer; transition: all 0.4s; } button:hover { border-color: var(--accent-color); letter-spacing: 5px; box-shadow: 0 0 15px var(--border-light); }\` }) %>
<body>
    <div class="bg-lines" style="opacity: 0.05;"><div class="line" style="top:10%; width:100%; height:1px;"></div></div>
    <div class="cover-container">
        <h1>AEUST_RNG</h1>
        <div style="margin: 50px 0;">
            <button onclick="document.body.style.opacity='0'; setTimeout(() => window.location.href='/index', 500);">點我進入</button>
        </div>
        <div style="font-size: 1.1rem; color: var(--text-sub); margin-top: 80px;">不再為吃甚麼煩惱！</div>
    </div>
    <%- include('partials/scripts') %>
</body>
</html>`
};

for (const [filepath, content] of Object.entries(files)) {
    createDir(path.dirname(filepath));
    writeFile(filepath, content);
}

console.log("\n✅ 終極修復完成！請執行 npm install 與 node app.js 開始運行。");