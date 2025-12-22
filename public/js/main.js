// === 1. 確保 HTML 可以呼叫這些函式 ===
window.startRNG = startRNG;
window.setFilter = setFilter;
window.toggleModal = toggleModal;
window.handleLogin = handleLogin;
window.handleResultFeedback = handleResultFeedback;
window.handleAiFeedback = handleAiFeedback;
window.setStoreView = setStoreView;
window.setStoreCategory = setStoreCategory;
window.filterStores = filterStores;
window.panToStore = panToStore;
window.selectTheme = selectTheme;

// === 2. 全域變數 ===
const THEMES = [
  { id: 'default', bg: 'bg-black', text: 'text-white' },
  { id: 'light', bg: 'bg-zinc-50', text: 'text-zinc-900' },
  { id: 'midnight', bg: 'bg-slate-950', text: 'text-slate-100' },
  { id: 'forest', bg: 'bg-emerald-950', text: 'text-emerald-50' }
];

let filterState = { time: 'all', category: 'all' };
let currentResult = null;
let storeViewMode = 'map';
let mapInstance = null;
let mapMarkers = {};

// === 3. 初始化 ===
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadStats();
    
    // 首頁邏輯
    if(document.getElementById('rng-btn')) {
        renderHistory();
        fetchAiTip();
        initHomeLoader(); // 啟動載入動畫邏輯
    }
    
    // 店家頁邏輯
    if(document.getElementById('map') || document.getElementById('view-table')) {
        initMap();
        setStoreCategory('all');
    }

    // 歡迎頁動畫
    const welcomeScreen = document.getElementById('welcome-screen');
    if(welcomeScreen) {
        setTimeout(() => welcomeScreen.classList.replace('opacity-0', 'opacity-100'), 100);
    }
});

// === 4. 載入動畫 (修復點擊問題的關鍵) ===
function initHomeLoader() {
    const loader = document.getElementById('home-loader');
    const hasVisited = sessionStorage.getItem('visited');

    if (loader) {
        if (hasVisited) {
            // 如果已經看過，直接隱藏並允許穿透
            loader.style.display = 'none';
            loader.style.pointerEvents = 'none';
        } else {
            // 第一次看：顯示 1.5 秒後淡出
            setTimeout(() => {
                loader.classList.add('opacity-0');
                loader.style.pointerEvents = 'none'; // ★關鍵：讓滑鼠可以穿透透明層點擊按鈕
                
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 1000); // 等待淡出動畫結束
                
                sessionStorage.setItem('visited', 'true');
            }, 1500);
        }
    }
}

// === 5. RNG 核心功能 (您原本的邏輯) ===
function startRNG(instant = false) {
    console.log("按鈕已點擊！模式:", instant ? "快速" : "動畫");

    // 防呆：確保資料已載入
    const foods = (typeof FOOD_DATA !== 'undefined') ? FOOD_DATA : [];
    
    const validFoods = foods.filter(f => {
        const tMatch = filterState.time === 'all' || (f.time && f.time.includes(filterState.time));
        const cMatch = filterState.category === 'all' || f.category === filterState.category;
        return tMatch && cMatch;
    });

    if(validFoods.length === 0) { 
        alert('沒有符合條件的店家！請放寬篩選。'); 
        return; 
    }

    // UI 切換
    const btn = document.getElementById('rng-btn');
    const txt = document.getElementById('rng-btn-text');
    
    if(!instant) {
        if(btn) btn.disabled = true;
        if(txt) txt.textContent = "抽選中...";
        
        // 模擬轉動 2 秒
        setTimeout(() => {
            const picked = validFoods[Math.floor(Math.random() * validFoods.length)];
            currentResult = picked;
            updateStats(picked, 2); // 記錄時間
            showResult(picked);
            
            // 還原按鈕
            if(btn) btn.disabled = false;
            if(txt) txt.textContent = "開始隨機抽選";
        }, 800); // 這裡改回您原本的 0.8 秒或 2 秒皆可
    } else {
        const picked = validFoods[Math.floor(Math.random() * validFoods.length)];
        currentResult = picked;
        updateStats(picked, 0.5);
        showResult(picked);
    }
}

// === 6. 顯示結果 ===
function showResult(food) {
    document.getElementById('res-name').textContent = food.name;
    document.getElementById('res-loc').textContent = food.location;
    document.getElementById('res-price').textContent = food.price;
    
    const starContainer = document.getElementById('res-stars');
    if(starContainer) {
        starContainer.innerHTML = Array.from({length: 5}).map((_, i) => 
            `<span class="material-symbols-rounded text-2xl">${i < food.stars ? 'star' : 'star_outline'}</span>`
        ).join('');
    }
    
    // 重置回饋 UI
    const feedbackArea = document.getElementById('result-feedback-area');
    if(feedbackArea) {
        feedbackArea.innerHTML = `
            <div class="flex flex-col items-center gap-3">
                <span class="text-sm tracking-[0.2em] uppercase font-bold opacity-40">這個選擇合您的胃口嗎？</span>
                <div class="flex gap-4">
                    <button onclick="handleResultFeedback('up')" class="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all group active:scale-90">
                        <span class="material-symbols-rounded text-xl group-hover:scale-110">sentiment_satisfied</span>
                    </button>
                    <button onclick="handleResultFeedback('down')" class="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all group active:scale-90">
                        <span class="material-symbols-rounded text-xl group-hover:scale-110">sentiment_dissatisfied</span>
                    </button>
                </div>
            </div>`;
    }
    
    toggleModal('result-modal');
    saveHistory(food);
}

// === 7. 歷史紀錄與統計 ===
function renderHistory() {
    const list = document.getElementById('history-list');
    if(!list) return;

    const history = JSON.parse(localStorage.getItem('foodHistory')) || [];
    
    if(history.length === 0) {
        list.innerHTML = '<div class="col-span-full text-center py-20 glass rounded-[2rem] opacity-30 italic font-light">尚無任何搜尋記錄</div>';
        return;
    }
    
    list.innerHTML = history.slice(0, 4).map(h => `
        <div class="glass p-6 rounded-[2rem] flex justify-between items-center group hover:bg-white/5 transition-all">
            <div class="flex items-center gap-5">
                <div class="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
                    <span class="material-symbols-rounded text-xl opacity-40">restaurant</span>
                </div>
                <div>
                    <div class="font-medium">${h.name}</div>
                    <div class="text-sm opacity-40 uppercase tracking-widest mt-0.5">${h.location}</div>
                </div>
            </div>
            <div class="text-sm font-mono opacity-80">${h.price}</div>
        </div>
    `).join('');
}

function updateStats(food, timeTaken) {
    const stats = getStats();
    stats.totalDecisions++;
    stats.totalDecisionTime += timeTaken;
    stats.categories[food.category] = (stats.categories[food.category] || 0) + 1;
    localStorage.setItem('decisionStats', JSON.stringify(stats));
}

function saveHistory(food) {
    let history = JSON.parse(localStorage.getItem('foodHistory')) || [];
    history.unshift(food);
    if(history.length > 20) history.pop();
    localStorage.setItem('foodHistory', JSON.stringify(history));
    renderHistory();
}

function getStats() {
    return JSON.parse(localStorage.getItem('decisionStats')) || { totalDecisions: 0, categories: {}, feedback: { ai: [], items: [] }, totalDecisionTime: 0 };
}

function loadStats() {} // 預留

// === 8. 篩選與 UI ===
function setFilter(type, val) {
    filterState[type] = val;
    if(type === 'time') {
        document.querySelectorAll('.filter-btn-time').forEach(btn => {
            const active = btn.dataset.val === val;
            btn.className = `filter-btn-time px-4 py-2 rounded-full text-sm transition-all border ${active ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/30'}`;
        });
    }
}

function toggleModal(id) {
    const el = document.getElementById(id);
    if(!el) return;
    if(el.classList.contains('hidden')) {
        el.classList.remove('hidden');
        el.classList.add('flex');
        if(id === 'dashboard-modal') updateDashboardUI();
    } else {
        el.classList.add('hidden');
        el.classList.remove('flex');
    }
}

function updateDashboardUI() {
    const stats = getStats();
    const decEl = document.getElementById('stat-decisions');
    if(decEl) decEl.textContent = stats.totalDecisions;
    
    const avgEl = document.getElementById('stat-avg');
    if(avgEl) avgEl.textContent = (stats.totalDecisions ? (stats.totalDecisionTime / stats.totalDecisions).toFixed(1) : 0) + 's';
    
    const catEl = document.getElementById('stat-categories');
    if(catEl) {
        catEl.innerHTML = Object.entries(stats.categories).map(([k,v]) => `
            <div class="p-4 rounded-2xl bg-white/5 flex justify-between items-center mb-2">
                <span class="text-sm capitalize font-light">${k}</span><span class="text-xs opacity-40">${v} 次</span>
            </div>`).join('') || '<p class="text-center opacity-30 text-xs">無數據</p>';
    }
}

// === 9. 主題系統 ===
function loadTheme() {
    const savedId = localStorage.getItem('rng_theme') || 'default';
    selectTheme(savedId);
}

function selectTheme(id) {
    const theme = THEMES.find(t => t.id === id) || THEMES[0];
    localStorage.setItem('rng_theme', id);
    applyTheme(theme);
}

function applyTheme(theme) {
    const body = document.getElementById('app-body');
    if(!body) return;
    THEMES.forEach(t => body.classList.remove(t.bg, t.text));
    body.classList.add(theme.bg, theme.text);
    
    document.querySelectorAll('.theme-btn').forEach(btn => {
        const isSel = btn.dataset.id === theme.id;
        btn.className = `theme-btn p-5 rounded-[1.5rem] border transition-all text-left ${isSel ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`;
    });
}

// === 10. 店家頁與其他 ===
function setStoreCategory(id) {
    let storeCat = id; // 區域變數即可
    // 這裡我們簡單處理，實際上若要跨函式共用需要放在全域
    // 但為求簡單，我們直接操作 DOM
    document.getElementById('store-search').dataset.cat = id; // 暫存到 DOM
    
    document.querySelectorAll('.store-cat-btn').forEach(btn => {
        const active = btn.dataset.id === id;
        btn.className = `store-cat-btn px-3 py-1.5 rounded-lg text-3sm font-bold tracking-[0.1em] uppercase transition-all border ${active ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/5 opacity-50'}`;
    });
    filterStores();
}

function filterStores() {
    const input = document.getElementById('store-search');
    if(!input) return;
    const term = input.value.toLowerCase();
    const cat = input.dataset.cat || 'all';
    
    const foods = (typeof FOOD_DATA !== 'undefined') ? FOOD_DATA : [];
    const filtered = foods.filter(f => {
        const matchesTerm = f.name.toLowerCase().includes(term) || f.location.includes(term);
        const matchesCat = cat === 'all' || f.category === cat;
        return matchesTerm && matchesCat;
    });

    // Sidebar
    const sidebar = document.getElementById('store-list-sidebar');
    if(sidebar) {
        sidebar.innerHTML = filtered.map(f => `
            <div onclick="panToStore('${f.id}')" class="p-5 rounded-2xl cursor-pointer border transition-all bg-white/5 border-white/5 hover:border-white/20 mb-3">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-medium">${f.name}</h3>
                    <span class="text-xs font-mono opacity-40">${f.price}</span>
                </div>
                <div class="flex items-center gap-1 text-sm opacity-40 uppercase tracking-tighter">
                    <span class="material-symbols-rounded text-sm">location_on</span>
                    ${f.location}
                </div>
            </div>`).join('');
    }
    
    // Table
    const tbody = document.getElementById('store-table-body');
    if(tbody) {
        tbody.innerHTML = filtered.map(f => `
            <tr class="hover:bg-white/[0.02] transition-colors group">
                <td class="px-8 py-6"><div class="font-medium group-hover:text-blue-400 transition-colors">${f.name}</div></td>
                <td class="px-6 py-6"><span class="px-2 py-1 bg-white/5 rounded text-sm opacity-60 uppercase">${f.category}</span></td>
                <td class="px-6 py-6 font-mono text-sm opacity-60">${f.price}</td>
                <td class="px-6 py-6 flex text-yellow-500/60">${Array(f.stars).fill('★').join('')}</td>
                <td class="px-8 py-6 text-right"><button onclick="setStoreView('map'); setTimeout(()=>panToStore('${f.id}'), 200)" class="p-2 rounded-full hover:bg-white/10 transition-colors opacity-40 hover:opacity-100"><span class="material-symbols-rounded text-lg">explore</span></button></td>
            </tr>`).join('');
    }
}

function setStoreView(mode) {
    const mapDiv = document.getElementById('view-map');
    const tableDiv = document.getElementById('view-table');
    const btnMap = document.getElementById('btn-view-map');
    const btnTable = document.getElementById('btn-view-table');

    if(mode === 'map') {
        mapDiv.classList.remove('hidden'); mapDiv.classList.add('flex');
        tableDiv.classList.add('hidden');
        btnMap.classList.replace('opacity-40', 'bg-white'); btnMap.classList.replace('hover:opacity-100', 'text-black');
        btnTable.classList.replace('bg-white', 'opacity-40'); btnTable.classList.replace('text-black', 'hover:opacity-100');
        if(mapInstance) setTimeout(() => mapInstance.invalidateSize(), 100);
    } else {
        mapDiv.classList.add('hidden'); mapDiv.classList.remove('flex');
        tableDiv.classList.remove('hidden');
        btnTable.classList.replace('opacity-40', 'bg-white'); btnTable.classList.replace('hover:opacity-100', 'text-black');
        btnMap.classList.replace('bg-white', 'opacity-40'); btnMap.classList.replace('text-black', 'hover:opacity-100');
    }
}

function initMap() {
    if(typeof L === 'undefined' || !document.getElementById('map')) return;
    mapInstance = L.map('map', { zoomControl: false }).setView([24.9959, 121.4527], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
    
    const foods = (typeof FOOD_DATA !== 'undefined') ? FOOD_DATA : [];
    foods.forEach(f => {
        if(f.lat && f.lng) {
            const m = L.marker([f.lat, f.lng])
                .bindPopup(`<b>${f.name}</b><br>${f.location}`)
                .addTo(mapInstance);
            mapMarkers[f.id] = m;
        }
    });
}

function panToStore(id) {
    const foods = (typeof FOOD_DATA !== 'undefined') ? FOOD_DATA : [];
    const f = foods.find(x => x.id === id);
    if(f && mapInstance) {
        mapInstance.flyTo([f.lat, f.lng], 18);
        if(mapMarkers[id]) mapMarkers[id].openPopup();
    }
}

async function fetchAiTip() {
    const el = document.getElementById('ai-tip');
    if(!el) return;
    try {
        const res = await fetch('/api/ai-suggestion', { method: 'POST' });
        const data = await res.json();
        el.textContent = data.text;
    } catch(e) { el.textContent = "AI 正在休息中..."; }
}

function handleLogin(e) {
    e.preventDefault();
    setTimeout(() => { window.location.href = '/home'; }, 1000);
}

function handleResultFeedback(rating) { console.log('Result feedback:', rating); }
function handleAiFeedback(rating) { console.log('AI feedback:', rating); }