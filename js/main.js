// ===== 進度管理系統 =====

// 讀取進度
function loadProgress() {
    const progress = JSON.parse(localStorage.getItem('scienceProgress') || '{}');
    
    // 更新首頁星星
    document.querySelectorAll('.unit-star').forEach(star => {
        const unitId = star.dataset.unit;
        if (progress[unitId]) {
            star.textContent = '⭐';
            star.classList.add('earned');
        }
    });
    
    // 更新徽章
    const categories = ['space', 'dino', 'body', 'earth', 'ocean'];
    categories.forEach(cat => {
        const catStars = categories.flatMap((_, i) => [`${cat}-${i+1}`]);
        const earned = catStars.filter(id => progress[id]).length;
        const badge = document.getElementById(`badge-${cat}`);
        if (badge && earned >= 3) {
            badge.textContent = '🏆';
            badge.classList.add('unlocked');
        }
    });
    
    return progress;
}

// 更新總星星數
function updateTotalStars() {
    const progress = JSON.parse(localStorage.getItem('scienceProgress') || '{}');
    const count = Object.values(progress).filter(Boolean).length;
    const counter = document.getElementById('totalStars');
    if (counter) {
        counter.textContent = count;
    }
    return count;
}

// 完成單元
function completeUnit(unitId, category) {
    const progress = JSON.parse(localStorage.getItem('scienceProgress') || '{}');
    progress[unitId] = true;
    localStorage.setItem('scienceProgress', JSON.stringify(progress));
    
    // 播放音效（如果沒静音）
    if (!isMuted()) {
        playSound('complete');
    }
    
    // 檢查是否解鎖徽章
    const categoryUnits = {
        'space': ['space-1', 'space-2', 'space-3'],
        'dino': ['dino-1', 'dino-2', 'dino-3'],
        'body': ['body-1', 'body-2', 'body-3'],
        'earth': ['earth-1', 'earth-2', 'earth-3'],
        'ocean': ['ocean-1', 'ocean-2', 'ocean-3']
    };
    
    const earned = categoryUnits[category].filter(id => progress[id]).length;
    if (earned >= 3) {
        showBadgePopup(category);
    }
    
    updateTotalStars();
    showStarAnimation(unitId);
}

// 顯示星星動畫
function showStarAnimation(unitId) {
    const star = document.querySelector(`[data-unit="${unitId}"]`);
    if (star && !star.classList.contains('earned')) {
        star.textContent = '⭐';
        star.classList.add('earned');
    }
}

// 顯示徽章彈窗
function showBadgePopup(category) {
    const badges = {
        'space': { icon: '🚀', name: '太空探險家' },
        'dino': { icon: '🦕', name: '恐龍專家' },
        'body': { icon: '🧬', name: '人體博士' },
        'earth': { icon: '🌍', name: '地球衛士' },
        'ocean': { icon: '🐚', name: '海洋達人' }
    };
    
    const badge = badges[category];
    if (badge) {
        document.getElementById('popupBadgeIcon').textContent = badge.icon;
        document.getElementById('popupBadgeName').textContent = badge.name;
        document.getElementById('badgePopup').classList.add('show');
    }
}

function closeBadgePopup() {
    document.getElementById('badgePopup').classList.remove('show');
}

// ===== 静音模式 =====
function isMuted() {
    return localStorage.getItem('scienceMuted') === 'true';
}

function toggleMute() {
    const muted = !isMuted();
    localStorage.setItem('scienceMuted', muted.toString());
    document.getElementById('muteBtn').textContent = muted ? '🔇' : '🔊';
}

function playSound(type) {
    // 音效功能預留（可添加 Web Audio API）
    console.log(`Playing sound: ${type}`);
}

// 初始化静音按鈕
document.addEventListener('DOMContentLoaded', () => {
    const muteBtn = document.getElementById('muteBtn');
    if (muteBtn) {
        muteBtn.textContent = isMuted() ? '🔇' : '🔊';
        muteBtn.addEventListener('click', toggleMute);
    }
});

// ===== 背景星空動畫 =====
function createStars() {
    const bg = document.getElementById('cosmicBg');
    if (!bg) return;
    
    bg.innerHTML = '';
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 2 + 's';
        bg.appendChild(star);
    }
}

createStars();

// ===== 通用遊戲功能 =====

// 計時器
class GameTimer {
    constructor(onUpdate) {
        this.startTime = null;
        this.interval = null;
        this.onUpdate = onUpdate;
    }
    
    start() {
        this.startTime = Date.now();
        this.interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            this.onUpdate(elapsed);
        }, 1000);
    }
    
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        return Math.floor((Date.now() - this.startTime) / 1000);
    }
}

// 拖曳功能
function enableDrag(element, onDrop) {
    let isDragging = false;
    let offsetX, offsetY;
    let currentPos = { left: element.offsetLeft, top: element.offsetTop };
    
    // 設置初始位置
    if (element.style.position !== 'absolute') {
        element.style.position = 'absolute';
        element.style.left = element.offsetLeft + 'px';
        element.style.top = element.offsetTop + 'px';
    }
    
    // 滑鼠事件
    element.addEventListener('mousedown', (e) => {
        isDragging = true;
        currentPos.left = element.offsetLeft;
        currentPos.top = element.offsetTop;
        offsetX = e.clientX - currentPos.left;
        offsetY = e.clientY - currentPos.top;
        element.style.cursor = 'grabbing';
        element.style.zIndex = '1000';
        e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            element.style.left = (e.clientX - offsetX) + 'px';
            element.style.top = (e.clientY - offsetY) + 'px';
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            element.style.cursor = 'grab';
            if (onDrop) onDrop(element);
        }
    });
    
    // 觸控事件
    element.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        isDragging = true;
        currentPos.left = element.offsetLeft;
        currentPos.top = element.offsetTop;
        offsetX = touch.clientX - currentPos.left;
        offsetY = touch.clientY - currentPos.top;
        element.style.cursor = 'grabbing';
        element.style.zIndex = '1000';
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const touch = e.touches[0];
            element.style.left = (touch.clientX - offsetX) + 'px';
            element.style.top = (touch.clientY - offsetY) + 'px';
            e.preventDefault();
        }
    }, { passive: false });
    
    document.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;
            element.style.cursor = 'grab';
            if (onDrop) onDrop(element);
        }
    });
}

// 亂數排列
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// 導出函數供子頁面使用
window.ScienceGame = {
    completeUnit,
    loadProgress,
    updateTotalStars,
    GameTimer,
    enableDrag,
    shuffle,
    isMuted,
    playSound
};
