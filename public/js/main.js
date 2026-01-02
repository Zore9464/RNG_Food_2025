// public/js/main.js

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
// ★ 修改：與 server.js 同步，將 sky 替換為 grey
const THEMES = [
  { 
      id: 'default', 
      bg: 'bg-black', text: 'text-white', 
      btn: 'bg-white text-black',
      surface: 'bg-white/10', border: 'border-white/20' 
  },
  { 
      id: 'light', 
      bg: 'bg-zinc-50', text: 'text-zinc-900', 
      btn: 'bg-zinc-900 text-white',
      surface: 'bg-white', border: 'border-zinc-300' 
  },
  { 
      id: 'midnight', 
      bg: 'bg-slate-950', text: 'text-slate-100', 
      btn: 'bg-blue-600 text-white',
      surface: 'bg-slate-900/80', border: 'border-slate-800'
  },
  { 
      id: 'forest', 
      bg: 'bg-emerald-950', text: 'text-emerald-50', 
      btn: 'bg-emerald-600 text-white',
      surface: 'bg-emerald-900/60', border: 'border-emerald-800'
  },
  // ★ 修改：灰色主題
  { 
      id: 'grey', 
      bg: 'bg-gray-200', text: 'text-gray-950', 
      btn: 'bg-gray-600 text-white', 
      surface: 'bg-white/70', border: 'border-gray-300'
  },
  // 其他淺色主題保持不變
  { 
      id: 'cream', 
      bg: 'bg-orange-200', text: 'text-orange-950', 
      btn: 'bg-orange-600 text-white', 
      surface: 'bg-white/70', border: 'border-orange-300'
  },
  { 
      id: 'lilac', 
      bg: 'bg-purple-200', text: 'text-purple-950', 
      btn: 'bg-purple-600 text-white', 
      surface: 'bg-white/70', border: 'border-purple-300'
  }
];

let filterState = { time: 'all', category: 'all' };
let currentResult = null;
let mapInstance = null;
let mapMarkers = {};

// === 3. 初始化 ===
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    
    if(document.getElementById('rng-btn')) {
        renderHistory();
        fetchAiTip();
        initHomeLoader();
    }
    
    if(document.getElementById('map') || document.getElementById('view-table')) {
        initMap();
        setStoreCategory('all');
    }

    const welcomeScreen = document.getElementById('welcome-screen');
    if(welcomeScreen) {
        setTimeout(() => welcomeScreen.classList.replace('opacity-0', 'opacity-100'), 100);
    }
});

// === 4. 主題切換邏輯 (完整版) ===

function loadTheme() {
    const savedId = localStorage.getItem('rng_theme') || 'default';
    selectTheme(savedId);
}

function selectTheme(id) {
    const theme = THEMES.find(t => t.id === id) || THEMES[0];
    localStorage.setItem('rng_theme', id);
    applyTheme(theme);

    const select = document.getElementById('theme-select');
    if (select) select.value = theme.id;
}

function applyTheme(theme) {
    const body = document.getElementById('app-body');
    if(!body) return;
    
    // 1. 處理 Body 背景與文字顏色
    THEMES.forEach(t => body.classList.remove(...t.bg.split(' '), ...t.text.split(' ')));
    body.classList.add(...theme.bg.split(' '), ...theme.text.split(' '));

    // 2. 處理登入按鈕顏色 (id="login-btn")
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        THEMES.forEach(t => { if(t.btn) loginBtn.classList.remove(...t.btn.split(' ')); });
        if(theme.btn) loginBtn.classList.add(...theme.btn.split(' '));
    }

    // 3. ★ 新增：處理彈跳視窗與卡片顏色 (class="theme-surface")
    // 這會改變 modal 的背景色與邊框
    document.querySelectorAll('.theme-surface').forEach(el => {
        // 移除舊樣式
        THEMES.forEach(t => {
            if(t.surface) el.classList.remove(...t.surface.split(' '));
            if(t.border) el.classList.remove(...t.border.split(' '));
        });
        // 加入新樣式
        if(theme.surface) el.classList.add(...theme.surface.split(' '));
        if(theme.border) el.classList.add(...theme.border.split(' '));
        
        // 如果是亮色主題，確保視窗內的文字顏色也正確跟隨 Body
        // 因為 modal 內容通常會繼承 body 的文字顏色，但如果 surface 顏色特殊，可以這裡強制加 text class
        // 目前我們先依賴繼承 (因為 body 已經設了 text color)
    });
}

// === 5. 隨機抽選與其他功能 (保持不變) ===
function startRNG(instant = false) {
    const foods = window.FOOD_DATA || [];
    const validFoods = foods.filter(f => {
        const fTime = Array.isArray(f.time) ? f.time : []; 
        const tMatch = filterState.time === 'all' || fTime.includes(filterState.time);
        const cMatch = filterState.category === 'all' || 
                       (f.styles && f.styles.some(s => s.id == filterState.category));
        return tMatch && cMatch;
    });

    if(validFoods.length === 0) { 
        alert(`沒有符合條件的店家！請嘗試切換條件試試看。`); 
        return; 
    }

    const btn = document.getElementById('rng-btn');
    const txt = document.getElementById('rng-btn-text');
    const controls = document.getElementById('controls-area');
    const anim = document.getElementById('rerolling-anim');
    
    if(!instant) {
        if(btn) btn.disabled = true;
        if(controls && anim) {
            controls.classList.add('hidden');
            anim.classList.remove('hidden');
            anim.classList.add('flex');
        } else if(txt) txt.textContent = "抽選中...";
        
        setTimeout(() => {
            const picked = validFoods[Math.floor(Math.random() * validFoods.length)];
            if(controls && anim) {
                anim.classList.add('hidden');
                anim.classList.remove('flex');
                controls.classList.remove('hidden');
            }
            if(btn) btn.disabled = false;
            if(txt) txt.textContent = "開始隨機抽選";
            showResult(picked);
        }, 1500);
    } else {
        const picked = validFoods[Math.floor(Math.random() * validFoods.length)];
        showResult(picked);
    }
}

function showResult(food) {
    // 1. 顯示文字分數
    const ratingText = document.getElementById('res-rating-text');
    if(ratingText) {
        const scoreVal = food.score || 0;
        ratingText.textContent = `綜合評分：${scoreVal} / 5.0`;
    }

    // 2. 填入店家資訊
    document.getElementById('res-name').textContent = food.name;
    document.getElementById('res-loc').textContent = food.location;
    document.getElementById('res-price').textContent = food.price;
    
    // 3. 顯示星星 (改用文字符號，保證能顯示！)
    const starContainer = document.getElementById('res-stars');
    
    if(starContainer) {
        const score = Number(food.score) || 0; 

        starContainer.innerHTML = Array.from({length: 5}).map((_, i) => {
            const diff = score - i;
            let icon = '☆'; // 預設：空心星星 (文字)

            if (diff >= 1) {
                icon = '★'; // 滿分：實心星星 (文字)
            } else if (diff >= 0.5) {
                // 如果想要半星，文字符號比較難完美呈現，
                // 為了排版整齊，這裡我們讓它顯示實心，或者您可以維持空心
                // 這裡建議：超過 0.5 就給它一顆星，看起來比較大方
                icon = '★'; 
            }
            
            // 注意：這裡拿掉了 class="material-symbols-rounded"
            // 改成 text-3xl 讓星星大一點
            return `<span class="text-3xl">${icon}</span>`;
        }).join('');
    }

    // 4. 更新回饋區塊
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

function setFilter(type, val) {
    filterState[type] = val;
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
            loader.style.pointerEvents = 'none';
            setTimeout(() => loader.style.display = 'none', 1000);
            sessionStorage.setItem('visited', 'true');
        }, 1500);
    } else if(loader) {
        loader.style.display = 'none';
        loader.style.pointerEvents = 'none';
    }
}

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

function setStoreCategory(id) {
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
        const matchesCat = cat === 'all' || (f.styles && f.styles.some(s => s.id == cat));
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
                <div class="flex flex-wrap gap-1 mt-2">
                    ${f.styles.map(s => `<span class="text-[10px] px-1.5 py-0.5 bg-white/10 rounded text-blue-300">#${s.name}</span>`).join('')}
                </div>
            </div>`).join('') || '<div class="text-center py-20 opacity-30 text-sm italic">尚無店家數據</div>';
    }
    
    const tbody = document.getElementById('store-table-body');
    if(tbody) {
        tbody.innerHTML = filtered.map(f => `
            <tr class="hover:bg-white/[0.02] transition-colors group">
                <td class="px-8 py-6"><div class="font-medium group-hover:text-blue-400 transition-colors">${f.name}</div></td>
                <td class="px-6 py-6">
                    <div class="flex flex-wrap gap-1">
                        ${f.styles.map(s => `<span class="px-2 py-1 bg-white/5 rounded text-sm opacity-60 hover:opacity-100 transition-opacity">#${s.name}</span>`).join('')}
                    </div>
                </td>
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

function toggleModal(id) {
    const el = document.getElementById(id);
    if(!el) return;
    if(el.classList.contains('hidden')) {
        el.classList.remove('hidden');
        el.classList.add('flex');
        if(id === 'dashboard-modal') updateDashboardUI();
        if(id === 'settings-modal') {
             const savedId = localStorage.getItem('rng_theme') || 'default';
             const select = document.getElementById('theme-select');
             if(select) select.value = savedId;
        }
    } else {
        el.classList.add('hidden');
        el.classList.remove('flex');
    }
}

function updateDashboardUI() {
    const saved = localStorage.getItem('decisionStats');
    const stats = saved ? JSON.parse(saved) : { totalDecisions: 0, categories: {} };
    document.getElementById('stat-decisions').textContent = stats.totalDecisions;
    document.getElementById('stat-avg').textContent = '0.0s'; 
    document.getElementById('stat-categories').innerHTML = Object.entries(stats.categories).map(([k,v]) => `
        <div class="p-4 rounded-2xl bg-white/5 flex justify-between items-center mb-2">
            <span class="text-sm capitalize font-light">${k}</span><span class="text-xs opacity-40">${v} 次</span>
        </div>`).join('') || '<p class="text-center opacity-30 text-xs">無數據</p>';
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