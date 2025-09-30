// 全域變數
let markdownContent = '';
let grammarSections = [];
let currentSection = '';

// DOM 載入完成後執行
document.addEventListener('DOMContentLoaded', function() {
    loadMarkdownContent();
    setupEventListeners();
    setupMobileMenu();
});

// 載入 Markdown 內容
async function loadMarkdownContent() {
    try {
        const response = await fetch('grammer.md');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        markdownContent = await response.text();
        parseGrammarSections();
        generateTableOfContents();
        generateGrammarOverview();
        
        // 如果 URL 有 hash，顯示對應的章節
        const hash = window.location.hash.slice(1);
        if (hash) {
            showSection(decodeURIComponent(hash));
        }
    } catch (error) {
        console.error('載入 Markdown 檔案時發生錯誤:', error);
        document.getElementById('content').innerHTML = `
            <div class="error-message">
                <h2>載入錯誤</h2>
                <p>無法載入語法資料檔案。請確認 grammer.md 檔案存在於同一目錄中。</p>
                <p>錯誤詳情: ${error.message}</p>
            </div>
        `;
    }
}

// 解析語法章節
function parseGrammarSections() {
    const sections = markdownContent.split(/(?=^# )/gm).filter(section => section.trim());
    
    grammarSections = sections.map(section => {
        const lines = section.split('\n');
        const title = lines[0].replace(/^# /, '').trim();
        const content = section;
        
        return { title, content };
    });
}

// 生成目錄
function generateTableOfContents() {
    const grammarList = document.getElementById('grammarList');
    grammarList.innerHTML = '';
    
    grammarSections.forEach((section, index) => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${encodeURIComponent(section.title)}`;
        a.textContent = section.title;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            showSection(section.title);
            updateActiveLink(a);
            closeMobileMenu();
            
            // 如果是桌面版且側邊欄是收合狀態，點擊項目後自動展開
            if (window.innerWidth > 768) {
                const sidebar = document.querySelector('.sidebar');
                const container = document.querySelector('.container');
                if (sidebar.classList.contains('collapsed')) {
                    sidebar.classList.remove('collapsed');
                    container.classList.remove('sidebar-collapsed');
                    localStorage.setItem('sidebarCollapsed', 'false');
                }
            }
        });
        
        li.appendChild(a);
        grammarList.appendChild(li);
    });
}

// 顯示特定章節
function showSection(sectionTitle) {
    const section = grammarSections.find(s => s.title === sectionTitle);
    if (!section) {
        console.warn(`找不到章節: ${sectionTitle}`);
        return;
    }
    
    currentSection = sectionTitle;
    
    // 轉換 Markdown 為 HTML
    const htmlContent = marked.parse(section.content);
    
    // 更新內容
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = htmlContent;
    
    // 更新 URL hash
    window.history.pushState(null, null, `#${encodeURIComponent(sectionTitle)}`);
    
    // 滾動到頂部
    contentDiv.scrollTop = 0;
    
    // 應用語法高亮
    Prism.highlightAllUnder(contentDiv);
    
    // 處理日語文字樣式
    addJapaneseStyles();
}

// 為日語文字添加樣式
function addJapaneseStyles() {
    const content = document.getElementById('content');
    
    // 為包含日語的段落添加特殊樣式
    const paragraphs = content.querySelectorAll('p, li');
    paragraphs.forEach(p => {
        const text = p.textContent;
        // 檢測是否包含日語字符（平假名、片假名、漢字）
        if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) {
            p.classList.add('japanese-text');
        }
    });
}

// 設置事件監聽器
function setupEventListeners() {
    // 搜索功能
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 即時搜索
    searchInput.addEventListener('input', debounce(performLiveSearch, 300));
}

// 搜索功能
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!searchTerm) {
        return;
    }
    
    const results = grammarSections.filter(section => 
        section.title.toLowerCase().includes(searchTerm) ||
        section.content.toLowerCase().includes(searchTerm)
    );
    
    displaySearchResults(results, searchTerm);
}

// 即時搜索
function performLiveSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    if (!searchTerm) {
        generateTableOfContents();
        return;
    }
    
    // 過濾目錄項目
    const grammarList = document.getElementById('grammarList');
    const links = grammarList.querySelectorAll('a');
    
    links.forEach(link => {
        const text = link.textContent.toLowerCase();
        const li = link.parentElement;
        if (text.includes(searchTerm)) {
            li.style.display = 'block';
            // 高亮匹配的文字
            const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
            link.innerHTML = link.textContent.replace(regex, '<mark>$1</mark>');
        } else {
            li.style.display = 'none';
        }
    });
}

// 顯示搜索結果
function displaySearchResults(results, searchTerm) {
    let htmlContent = `<h2>搜索結果: "${searchTerm}"</h2>`;
    
    if (results.length === 0) {
        htmlContent += '<p>沒有找到相關的語法點。</p>';
    } else {
        htmlContent += `<p>找到 ${results.length} 個相關結果：</p>`;
        htmlContent += '<div class="search-results">';
        
        results.forEach(section => {
            const preview = getContentPreview(section.content, searchTerm);
            htmlContent += `
                <div class="search-result-item">
                    <h3><a href="#${encodeURIComponent(section.title)}" onclick="showSection('${section.title.replace(/'/g, "\\'")}'); return false;">${section.title}</a></h3>
                    <p>${preview}</p>
                </div>
            `;
        });
        
        htmlContent += '</div>';
    }
    
    document.getElementById('content').innerHTML = htmlContent;
}

// 獲取內容預覽
function getContentPreview(content, searchTerm) {
    const lines = content.split('\n');
    const matchingLines = lines.filter(line => 
        line.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (matchingLines.length > 0) {
        const preview = matchingLines[0].substring(0, 150);
        const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
        return preview.replace(regex, '<mark>$1</mark>') + '...';
    }
    
    return '...';
}

// 更新活動連結
function updateActiveLink(activeLink) {
    // 移除所有活動狀態
    document.querySelectorAll('.grammar-list a').forEach(link => {
        link.classList.remove('active');
    });
    
    // 添加活動狀態
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// 設置手機版選單和收合功能
function setupMobileMenu() {
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.querySelector('.sidebar');
    const container = document.querySelector('.container');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => {
            // 檢查是否為手機版
            if (window.innerWidth <= 768) {
                // 手機版：切換顯示/隱藏
                sidebar.classList.toggle('active');
            } else {
                // 桌面版：切換收合/展開
                sidebar.classList.toggle('collapsed');
                container.classList.toggle('sidebar-collapsed');
                
                // 儲存收合狀態到 localStorage
                const isCollapsed = sidebar.classList.contains('collapsed');
                localStorage.setItem('sidebarCollapsed', isCollapsed);
            }
        });
        
        // 載入儲存的收合狀態
        const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
        if (savedCollapsedState === 'true' && window.innerWidth > 768) {
            sidebar.classList.add('collapsed');
            container.classList.add('sidebar-collapsed');
        }
        
        // 監聽視窗大小變化
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                // 切換到桌面版時，移除手機版的 active 類別
                sidebar.classList.remove('active');
                
                // 恢復桌面版的收合狀態
                const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
                if (savedCollapsedState === 'true') {
                    sidebar.classList.add('collapsed');
                    container.classList.add('sidebar-collapsed');
                }
            } else {
                // 切換到手機版時，移除桌面版的收合類別
                sidebar.classList.remove('collapsed');
                container.classList.remove('sidebar-collapsed');
            }
        });
        
        // 點擊內容區域關閉手機版選單
        document.querySelector('.main-content').addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    }
}

// 關閉手機版選單
function closeMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar && window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    }
}

// 生成首頁文法概覽
function generateGrammarOverview() {
    const overviewContainer = document.getElementById('grammarOverviewList');
    if (!overviewContainer) return;
    
    overviewContainer.innerHTML = '';
    
    grammarSections.forEach((section, index) => {
        const grammarItem = document.createElement('div');
        grammarItem.className = 'grammar-item';
        grammarItem.innerHTML = `<h4>${section.title}</h4>`;
        
        grammarItem.addEventListener('click', () => {
            showSection(section.title);
            updateActiveLink(document.querySelector(`a[href="#${encodeURIComponent(section.title)}"]`));
            
            // 如果是桌面版且側邊欄是收合狀態，點擊項目後自動展開
            if (window.innerWidth > 768) {
                const sidebar = document.querySelector('.sidebar');
                const container = document.querySelector('.container');
                if (sidebar.classList.contains('collapsed')) {
                    sidebar.classList.remove('collapsed');
                    container.classList.remove('sidebar-collapsed');
                    localStorage.setItem('sidebarCollapsed', 'false');
                }
            }
        });
        
        overviewContainer.appendChild(grammarItem);
    });
}

// 防抖函數
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// 轉義正則表達式特殊字符
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 處理瀏覽器前進/後退
window.addEventListener('popstate', () => {
    const hash = window.location.hash.slice(1);
    if (hash) {
        showSection(decodeURIComponent(hash));
        // 更新側邊欄活動狀態
        const activeLink = document.querySelector(`a[href="#${hash}"]`);
        updateActiveLink(activeLink);
    }
});

// 配置 marked.js
if (typeof marked !== 'undefined') {
    marked.setOptions({
        breaks: true,
        gfm: true,
        headerIds: true,
        mangle: false
    });
}

// 錯誤處理
window.addEventListener('error', (e) => {
    console.error('JavaScript 錯誤:', e.error);
});

// 導出函數供全域使用
window.showSection = showSection;
