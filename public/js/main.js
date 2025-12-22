// === 全域變數 ===
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

// === 初始化 ===
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadStats();
    
    // 首頁邏輯
    if(document.getElementById('rng-btn')) {
        renderHistory();
        fetchAiTip();
        initHomeLoader();
    }
    
    // 店家頁邏輯
    if(document.getElementById('map') || document.getElementById('view-table')) {
        initMap();
        setStoreCategory('all'); // 初始化列表
    }

    // 歡迎頁動畫
    const welcomeScreen = document.getElementById('welcome-screen');
    if(welcomeScreen) {
        setTimeout(() => welcomeScreen.classList.replace('opacity-0', 'opacity-100'), 100);
    }
});

// === 主題系統 ===
function loadTheme() {
    const savedId = localStorage.getItem('rng_theme') || 'default';
    const theme = THEMES.find(t => t.id === savedId) || THEMES[0];
    applyTheme(theme);
}

function selectTheme(id) {
    const theme = THEMES.find(t => t.id === id);
    if (theme) {
        localStorage.setItem('rng_theme', id);
        applyTheme(theme);
    }
}

function applyTheme(theme) {
    const body = document.getElementById('app-body');
    if(!body) return;
    
    // 清除舊主題 class
    THEMES.forEach(t => body.classList.remove(t.bg, t.text));
    body.classList.add(theme.bg, theme.text);

    // 更新設定 Modal 的按鈕狀態
    document.querySelectorAll('.theme-btn').forEach(btn => {
        const isSel = btn.dataset.id === theme.id;
        btn.className = `theme-btn p-5 rounded-[1.5rem] border transition-all text-left ${isSel ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`;
    });
}

// === 資料與狀態管理 (LocalStorage) ===
function getStats() {
    return JSON.parse(localStorage.getItem('decisionStats')) || { totalDecisions: 0, categories: {}, feedback: { ai: [], items: [] }, totalDecisionTime: 0 };
}

function loadStats() {
    // 這裡可以做一些初始化檢查
}

function updateStats(food, timeTaken) {
    const stats = getStats();
    stats.totalDecisions++;
    stats.totalDecisionTime += timeTaken;
    stats.categories[food.category] = (stats.categories[food.category] || 0) + 1;
    localStorage.setItem('decisionStats', JSON.stringify(stats));
    
    // 更新歷史紀錄
    let history = JSON.parse(localStorage.getItem('foodHistory')) || [];
    history.unshift(food);
    if(history.length > 20) history.pop();
    localStorage.setItem('foodHistory', JSON.stringify(history));
    
    renderHistory();
}

// === 首頁功能 ===
function setFilter(type, val) {
    filterState[type] = val;
    // 更新 UI
    if(type === 'time') {
        document.querySelectorAll('.filter-btn-time').forEach(btn => {
            const active = btn.dataset.val === val;
            btn.className = `filter-btn-time px-4 py-2 rounded-full text-sm transition-all border ${active ? 'bg-white text-black border-white' : 'border-white/10 hover:border-white/30'}`;
        });
    }
}

function startRNG(instant = false) {
    const validFoods = FOOD_DATA.filter(f => {
        const tMatch = filterState.time === 'all' || f.time.includes(filterState.time);
        const cMatch = filterState.category === 'all' || f.category === filterState.category;
        return tMatch && cMatch;
    });

    if(validFoods.length === 0) { alert('沒有符合條件的店家！請放寬篩選。'); return; }

    // UI 切換到抽選中狀態
    const controls = document.getElementById('controls-area');
    const anim = document.getElementById('rerolling-anim');
    
    if(!instant) {
        controls.classList.add('hidden');
        anim.classList.remove('hidden');
        anim.classList.add('flex');
        
        const startTime = Date.now();
        setTimeout(() => {
            const picked = validFoods[Math.floor(Math.random() * validFoods.length)];
            currentResult = picked;
            updateStats(picked, (Date.now() - startTime) / 1000);
            
            // 還原 UI
            anim.classList.add('hidden');
            anim.classList.remove('flex');
            controls.classList.remove('hidden');
            
            showResult(picked);
        }, 2000); // 2秒動畫
    } else {
        const picked = validFoods[Math.floor(Math.random() * validFoods.length)];
        currentResult = picked;
        updateStats(picked, 0.5);
        showResult(picked);
    }
}

function showResult(food) {
    document.getElementById('res-name').textContent = food.name;
    document.getElementById('res-loc').textContent = food.location;
    document.getElementById('res-price').textContent = food.price;
    document.getElementById('res-stars').innerHTML = Array.from({length: 5}).map((_, i) => 
        `<span class="material-symbols-rounded text-2xl">${i < food.stars ? 'star' : 'star_outline'}</span>`
    ).join('');
    
    // 重置回饋 UI
    document.getElementById('result-feedback-area').innerHTML = `
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
    
    toggleModal('result-modal');
}

function renderHistory() {
    const list = document.getElementById('history-list');
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

// === AI 與回饋 ===
async function fetchAiTip() {
    const el = document.getElementById('ai-tip');
    const history = JSON.parse(localStorage.getItem('foodHistory')) || [];
    const stats = getStats();
    const historyNames = history.map(h => h.name);
    
    try {
        const res = await fetch('/api/ai-suggestion', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history: historyNames, feedback: stats.feedback })
        });
        const data = await res.json();
        el.textContent = data.text;
    } catch(e) {
        el.textContent = "AI 正在休息中...";
    }
}

function handleAiFeedback(rating) {
    const tip = document.getElementById('ai-tip').textContent;
    const stats = getStats();
    if(!stats.feedback) stats.feedback = { ai: [], items: [] };
    stats.feedback.ai.push({ tip, rating });
    localStorage.setItem('decisionStats', JSON.stringify(stats));
    
    document.getElementById('ai-feedback-container').innerHTML = `
        <span class="text-[9px] uppercase tracking-[0.2em] opacity-30 font-bold flex items-center gap-1">
            <span class="material-symbols-rounded text-[12px]">done_all</span> 感謝意見
        </span>`;
}

function handleResultFeedback(rating) {
    if(!currentResult) return;
    const stats = getStats();
    if(!stats.feedback) stats.feedback = { ai: [], items: [] };
    stats.feedback.items.push({ itemId: currentResult.id, rating });
    localStorage.setItem('decisionStats', JSON.stringify(stats));
    
    document.getElementById('result-feedback-area').innerHTML = `
        <div class="animate-in fade-in zoom-in duration-500 text-center">
            <div class="text-sm uppercase tracking-[0.3em] text-blue-500 font-bold mb-1">回饋已記錄</div>
            <div class="text-xs opacity-40 font-light">這將幫助我們在未來提供更準確的推薦！</div>
        </div>`;
}

// === Store View & Map ===
let storeCat = 'all';

function setStoreView(mode) {
    storeViewMode = mode;
    const mapDiv = document.getElementById('view-map');
    const tableDiv = document.getElementById('view-table');
    const btnMap = document.getElementById('btn-view-map');
    const btnTable = document.getElementById('btn-view-table');

    if(mode === 'map') {
        mapDiv.classList.remove('hidden');
        mapDiv.classList.add('flex');
        tableDiv.classList.add('hidden');
        
        btnMap.className = "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold tracking-widest transition-all bg-white text-black";
        btnTable.className = "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold tracking-widest transition-all opacity-40 hover:opacity-100";
        
        // 重新調整地圖大小 (Leaflet bug fix)
        if(mapInstance) setTimeout(() => mapInstance.invalidateSize(), 100);
    } else {
        mapDiv.classList.add('hidden');
        mapDiv.classList.remove('flex');
        tableDiv.classList.remove('hidden');
        
        btnTable.className = "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold tracking-widest transition-all bg-white text-black";
        btnMap.className = "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-bold tracking-widest transition-all opacity-40 hover:opacity-100";
    }
}

function setStoreCategory(id) {
    storeCat = id;
    document.querySelectorAll('.store-cat-btn').forEach(btn => {
        const active = btn.dataset.id === id;
        btn.className = `store-cat-btn px-3 py-1.5 rounded-lg text-3sm font-bold tracking-[0.1em] uppercase transition-all border ${active ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-white/5 border-white/5 opacity-50'}`;
    });
    filterStores();
}

function filterStores() {
    const term = document.getElementById('store-search').value.toLowerCase();
    
    const filtered = FOOD_DATA.filter(f => {
        const matchesTerm = f.name.toLowerCase().includes(term) || f.location.includes(term);
        const matchesCat = storeCat === 'all' || f.category === storeCat;
        return matchesTerm && matchesCat;
    });

    // Render Sidebar List (for Map View)
    const sidebar = document.getElementById('store-list-sidebar');
    if(sidebar) {
        sidebar.innerHTML = filtered.map(f => `
            <div onclick="panToStore('${f.id}')" class="p-5 rounded-2xl cursor-pointer border transition-all bg-white/5 border-white/5 hover:border-white/20 mb-3">
                <div class="flex justify-between items-start mb-2">
                    <h3 class="font-medium">${f.name}</h3>
                    <span class="text-xs font-mono opacity-40">${f.price}</span>
                </div>
                <div class="flex items-center gap-1 text-sm opacity-40 uppercase tracking-tighter">
                    <span class="material-symbols-rounded text-[14px]">location_on</span>
                    ${f.location}
                </div>
            </div>
        `).join('') || '<div class="text-center py-20 opacity-30 text-sm italic">尚無店家數據</div>';
    }

    // Render Table (for Table View)
    const tbody = document.getElementById('store-table-body');
    if(tbody) {
        tbody.innerHTML = filtered.map(f => `
            <tr class="hover:bg-white/[0.02] transition-colors group">
                <td class="px-8 py-6">
                    <div class="font-medium group-hover:text-blue-400 transition-colors">${f.name}</div>
                </td>
                <td class="px-6 py-6"><span class="px-2 py-1 bg-white/5 rounded text-sm opacity-60 uppercase">${f.category}</span></td>
                <td class="px-6 py-6 font-mono text-sm opacity-60">${f.price}</td>
                <td class="px-6 py-6 flex text-yellow-500/60">${Array(f.stars).fill('★').join('')}</td>
                <td class="px-8 py-6 text-right">
                    <button onclick="setStoreView('map'); setTimeout(()=>panToStore('${f.id}'), 200)" class="p-2 rounded-full hover:bg-white/10 transition-colors opacity-40 hover:opacity-100">
                        <span class="material-symbols-rounded text-lg">explore</span>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function initMap() {
    if(typeof L === 'undefined' || !document.getElementById('map')) return;
    mapInstance = L.map('map', { zoomControl: false }).setView([24.9959, 121.4527], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(mapInstance);
    
    FOOD_DATA.forEach(f => {
        if(f.lat && f.lng) {
            const m = L.marker([f.lat, f.lng])
                .bindPopup(`<div class="text-black p-1"><b>${f.name}</b><br>${f.location}</div>`)
                .addTo(mapInstance);
            mapMarkers[f.id] = m;
        }
    });
}

function panToStore(id) {
    const f = FOOD_DATA.find(x => x.id === id);
    if(f && mapInstance) {
        mapInstance.flyTo([f.lat, f.lng], 18);
        mapMarkers[id].openPopup();
    }
}

function initHomeLoader() {
    const loader = document.getElementById('home-loader');
    if(loader && !sessionStorage.getItem('visited')) {
        setTimeout(() => {
            loader.classList.add('opacity-0');
            setTimeout(() => loader.style.display = 'none', 1000);
            sessionStorage.setItem('visited', 'true');
        }, 1500);
    } else if(loader) {
        loader.style.display = 'none';
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
    document.getElementById('stat-decisions').textContent = stats.totalDecisions;
    document.getElementById('stat-avg').textContent = (stats.totalDecisions ? (stats.totalDecisionTime / stats.totalDecisions).toFixed(1) : 0) + 's';
    
    document.getElementById('stat-categories').innerHTML = Object.entries(stats.categories).map(([k,v]) => `
        <div class="p-4 rounded-2xl bg-white/5 flex justify-between items-center mb-2">
            <span class="text-sm capitalize font-light">${k}</span><span class="text-xs opacity-40">${v} 次</span>
        </div>`).join('') || '<p class="text-center opacity-30 text-xs">無數據</p>';
}