# 日語語法學習網站

這是一個基於您的 `grammer.md` 文件創建的靜態網站，用於展示日語語法學習內容。

## 功能特色

- 📚 **完整的語法展示**: 自動解析 Markdown 內容並以美觀的方式展示
- 🔍 **智能搜索**: 支援即時搜索和完整搜索功能
- 📱 **響應式設計**: 適配桌面和手機設備
- 🎨 **現代化 UI**: 採用現代設計風格，提供良好的閱讀體驗
- ⚡ **快速導航**: 側邊欄目錄可快速跳轉到任何語法點

## 檔案結構

```
/
├── index.html          # 主要 HTML 文件
├── styles.css          # 樣式表
├── script.js           # JavaScript 功能
├── grammer.md          # 原始語法資料（您的檔案）
└── README.md           # 說明文件
```

## 如何使用

### 方法 1: 本地開發伺服器（推薦）

1. 安裝 Python（如果尚未安裝）
2. 在專案目錄中打開命令提示字元或 PowerShell
3. 運行以下命令啟動本地伺服器：

```bash
# Python 3
python -m http.server 8000

# 或者 Python 2
python -m SimpleHTTPServer 8000
```

4. 在瀏覽器中訪問 `http://localhost:8000`

### 方法 2: 使用 Node.js 伺服器

1. 安裝 Node.js
2. 安裝 http-server：
```bash
npm install -g http-server
```
3. 在專案目錄中運行：
```bash
http-server -p 8000
```
4. 在瀏覽器中訪問 `http://localhost:8000`

### 方法 3: 直接開啟檔案

由於 CORS 限制，直接在瀏覽器中開啟 `index.html` 可能無法正常載入 Markdown 檔案。建議使用上述方法之一。

## 技術特點

- **前端技術**: HTML5, CSS3, JavaScript (ES6+)
- **Markdown 解析**: 使用 marked.js 庫
- **程式碼高亮**: 使用 Prism.js
- **字體**: Google Fonts (Noto Sans TC, Noto Sans JP)
- **響應式框架**: CSS Grid 和 Flexbox

## 自定義設定

### 修改樣式
編輯 `styles.css` 文件來調整網站外觀：
- 修改顏色配置
- 調整字體大小
- 更改布局設定

### 添加新功能
編輯 `script.js` 文件來添加新的 JavaScript 功能：
- 新增搜索過濾器
- 添加書籤功能
- 實現主題切換

### 更新內容
只需更新 `grammer.md` 文件，網站會自動載入新內容。

## 瀏覽器支援

- Chrome (推薦)
- Firefox
- Safari
- Edge
- 手機瀏覽器

## 注意事項

1. 確保所有檔案都在同一目錄中
2. 使用本地伺服器可避免 CORS 問題
3. 如果修改了 Markdown 檔案，刷新頁面即可看到更新

## 故障排除

### 問題：無法載入 Markdown 內容
**解決方案**: 確保使用本地伺服器而非直接開啟 HTML 檔案

### 問題：搜索功能不工作
**解決方案**: 檢查瀏覽器控制台是否有 JavaScript 錯誤

### 問題：手機版選單無法開啟
**解決方案**: 確保 JavaScript 已正確載入

## 版本資訊

- 版本: 1.0.0
- 建立日期: 2024年9月30日
- 最後更新: 2024年9月30日

## 授權

此專案僅供學習和個人使用。
