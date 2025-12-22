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
let mapInstance = null;
let mapMarkers = {};

// === 3. 初始化 ===
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    
    // 首頁初始化
    if(document.getElementById('rng-btn')) {
        renderHistory();
        fetchAiTip();
        initHomeLoader();
    }
    
    // 店家頁初始化
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

// === 4. 核心功能：隨機抽選 (含詳細除錯) ===
function startRNG(instant = false) {
    // 1. 取得資料 (優先從 window 讀取)
    const foods = window.FOOD_DATA || [];
    
    console.log("=== 開始篩選 ===");
    console.log("目前篩選條件:", filterState);
    console.log("資料總數:", foods.length);

    // 2. 執行篩選
    const validFoods = foods.filter(f => {
        // 時段篩選
        // 邏輯：如果是 'all' 則通過，否則檢查 f.time 陣列是否包含目前的 time
        // 防呆：如果 f.time 是 undefined，視為空陣列
        const fTime = Array.isArray(f.time) ? f.time : []; 
        const tMatch = filterState.time === 'all' || fTime.includes(filterState.time);

        // 類別篩選
        const cMatch = filterState.category === 'all' || f.category === filterState.category;

        // 除錯：如果您發現某筆資料該出現卻沒出現，可以在這裡把 return log 出來
        // if (!tMatch || !cMatch) console.log("過濾掉:", f.name, "原因:", !tMatch ? "時段不符" : "類別不符");

        return tMatch && cMatch;
    });

    console.log("符合條件的店家數:", validFoods.length);

    // 3. 檢查結果
    if(validFoods.length === 0) { 
        alert(`沒有符合條件的店家！\n目前篩選條件：\n時段: ${filterState.time}\n分類: ${filterState.category}\n\n請嘗試切換為「全部」試試看。`); 
        return; 
    }

    // 4. UI 互動與結果顯示
    const btn = document.getElementById('rng-btn');
    const txt = document.getElementById('rng-btn-text');
    
    if(!instant) {
        if(btn) btn.disabled = true;
        if(txt) txt.textContent = "抽選中...";
        
        // 動畫延遲效果
        setTimeout(() => {
            const picked = validFoods[Math.floor(Math.random() * validFoods.length)];
            showResult(picked);
            
            if(btn) btn.disabled = false;
            if(txt) txt.textContent = "開始隨機抽選";
        }, 800);
    } else {
        // 快速模式
        const picked = validFoods[Math.floor(Math.random() * validFoods.length)];
        showResult(picked);
    }
}

function showResult(food) {
    console.log("抽選結果:", food.name);
    document.getElementById('res-name').textContent = food.name;
    document.getElementById('res-loc').textContent = food.location;
    document.getElementById('res-price').textContent = food.price;
    
    const starContainer = document.getElementById('res-stars');
    if(starContainer) {
        starContainer.innerHTML = Array.from({length: 5}).map((_, i) => 
            `<span class="material-symbols-rounded text-2xl">${i < food.stars ? 'star' : 'star_outline'}</span>`
        ).join('');
    }
    
    // 重置回饋按鈕
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
    currentResult = food;
    saveStats(food);
    saveHistory(food);
}

// === 5. 篩選與 UI 控制 ===
function setFilter(type, val) {
    filterState[type] = val;
    console.log(`篩選條件更新: ${type} = ${val}`);
    
    if(type === 'time') {
        document.querySelectorAll('.filter-btn-time').forEach(btn => {
            const active = btn.dataset.val === val;
            btn.className = `filter-btn-time px-4 py-2 rounded-full text-sm transition-all border ${active ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/30'}`;
        });
    }
}

function initHomeLoader() {
    const loader = document.getElementById('home-loader');
    if(loader && !sessionStorage.getItem('visited')) {
        setTimeout(() => {
            loader.classList.add('opacity-0');
            loader.style.pointerEvents = 'none'; // 讓滑鼠穿透
            setTimeout(() => loader.style.display = 'none', 1000);
            sessionStorage.setItem('visited', 'true');
        }, 1500);
    } else if(loader) {
        loader.style.display = 'none';
        loader.style.pointerEvents = 'none';
    }
}

// === 6. 其他輔助函式 (歷史紀錄、地圖、主題) ===
function renderHistory() {
    const list = document.getElementById('history-list');
    if(!list) return;
    const history = JSON.parse(localStorage.getItem('foodHistory')) || [];
    
    if(history.length === 0) {
        list.innerHTML = '<div class="col-span-full text-center py-20 glass rounded-[2rem] opacity-30 italic font-light">尚無任何搜尋記錄</div>';
    } else {
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
}

function saveStats(food) {
    const saved = localStorage.getItem('decisionStats');
    const stats = saved ? JSON.parse(saved) : { totalDecisions: 0, categories: {} };
    stats.totalDecisions++;
    stats.categories[food.category] = (stats.categories[food.category] || 0) + 1;
    localStorage.setItem('decisionStats', JSON.stringify(stats));
}

function saveHistory(food) {
    const saved = localStorage.getItem('foodHistory');
    let history = saved ? JSON.parse(saved) : [];
    history.unshift(food);
    if(history.length > 20) history.pop();
    localStorage.setItem('foodHistory', JSON.stringify(history));
    renderHistory();
}

// === 店家頁面與地圖 ===
function setStoreCategory(id) {
    // 將選擇的分類儲存到搜尋框的 data-cat 屬性中，方便 filterStores 讀取
    const searchInput = document.getElementById('store-search');
    if(searchInput) searchInput.dataset.cat = id;
    
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
    
    const foods = window.FOOD_DATA || [];
    const filtered = foods.filter(f => {
        const matchesTerm = f.name.toLowerCase().includes(term) || f.location.includes(term);
        const matchesCat = cat === 'all' || f.category === cat;
        return matchesTerm && matchesCat;
    });

    const sidebar = document.getElementById('store-list-sidebar');
    if(sidebar) {
        sidebar.innerHTML = filtered.map(f => `
            <div onclick="panToStore('${f.id}')" class="p-5 rounded-2xl cursor-pointer border transition-all bg-white/5 border-white/5 hover:border-white/20 mb-3">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-medium">${f.name}</h3>
                    <span class="text-xs font-mono opacity-60">${f.price}</span>
                </div>
                <div class="flex items-center gap-1 text-sm opacity-40 uppercase tracking-tighter">
                    <span class="material-symbols-rounded text-sm">location_on</span>
                    ${f.location}
                </div>
            </div>`).join('') || '<div class="text-center py-20 opacity-30 text-sm italic">尚無店家數據</div>';
    }
    
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

function initMap() {
    if(typeof L === 'undefined' || !document.getElementById('map')) return;
    mapInstance = L.map('map', { zoomControl: false }).setView([24.9959, 121.4527], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
    
    const foods = window.FOOD_DATA || [];
    foods.forEach(f => {
        if(f.lat && f.lng) {
            const m = L.marker([f.lat, f.lng]).bindPopup(`<b>${f.name}</b><br>${f.location}`).addTo(mapInstance);
            mapMarkers[f.id] = m;
        }
    });
}

function panToStore(id) {
    const f = (window.FOOD_DATA || []).find(x => x.id === id);
    if(f && mapInstance) {
        mapInstance.flyTo([f.lat, f.lng], 18);
        if(mapMarkers[id]) mapMarkers[id].openPopup();
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
        btnMap.className = "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold tracking-widest transition-all bg-white text-black";
        btnTable.className = "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold tracking-widest transition-all opacity-40 hover:opacity-100";
        if(mapInstance) setTimeout(() => mapInstance.invalidateSize(), 100);
    } else {
        mapDiv.classList.add('hidden'); mapDiv.classList.remove('flex');
        tableDiv.classList.remove('hidden');
        btnTable.className = "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold tracking-widest transition-all bg-white text-black";
        btnMap.className = "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold tracking-widest transition-all opacity-40 hover:opacity-100";
    }
}

// === 其他 ===
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
    const saved = localStorage.getItem('decisionStats');
    const stats = saved ? JSON.parse(saved) : { totalDecisions: 0, categories: {} };
    document.getElementById('stat-decisions').textContent = stats.totalDecisions;
    document.getElementById('stat-avg').textContent = '0s'; // 簡化處理
    
    document.getElementById('stat-categories').innerHTML = Object.entries(stats.categories).map(([k,v]) => `
        <div class="p-4 rounded-2xl bg-white/5 flex justify-between items-center mb-2">
            <span class="text-sm capitalize font-light">${k}</span><span class="text-xs opacity-40">${v} 次</span>
        </div>`).join('') || '<p class="text-center opacity-30 text-xs">無數據</p>';
}

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