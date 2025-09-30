#!/usr/bin/env pwsh

# 日語語法學習網站啟動腳本
Write-Host "正在啟動日語語法學習網站..." -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan

# 檢查是否在正確的目錄
if (-not (Test-Path "grammer.md")) {
    Write-Host "錯誤: 找不到 grammer.md 檔案" -ForegroundColor Red
    Write-Host "請確保在正確的專案目錄中運行此腳本" -ForegroundColor Yellow
    Read-Host "按任意鍵退出"
    exit 1
}

# 檢查 Python 是否可用
$pythonCommand = $null
$pythonCommands = @("python", "python3", "py")

foreach ($cmd in $pythonCommands) {
    try {
        $result = & $cmd --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            $pythonCommand = $cmd
            Write-Host "找到 Python: $result" -ForegroundColor Green
            break
        }
    }
    catch {
        # 忽略錯誤，繼續嘗試下一個命令
    }
}

if (-not $pythonCommand) {
    Write-Host "錯誤: 找不到 Python 安裝" -ForegroundColor Red
    Write-Host "請先安裝 Python 或確保 Python 在 PATH 中" -ForegroundColor Yellow
    Write-Host "下載地址: https://www.python.org/downloads/" -ForegroundColor Cyan
    Read-Host "按任意鍵退出"
    exit 1
}

# 檢查端口是否可用
$port = 8000
$portInUse = $false

try {
    $connection = Test-NetConnection -ComputerName localhost -Port $port -InformationLevel Quiet -WarningAction SilentlyContinue
    if ($connection) {
        $portInUse = $true
    }
}
catch {
    # 端口可用
}

if ($portInUse) {
    Write-Host "警告: 端口 $port 已被使用" -ForegroundColor Yellow
    $newPort = 8001
    Write-Host "將使用端口 $newPort" -ForegroundColor Yellow
    $port = $newPort
}

# 啟動伺服器
$url = "http://localhost:$port"
Write-Host "正在啟動本地伺服器..." -ForegroundColor Green
Write-Host "伺服器地址: $url" -ForegroundColor Cyan
Write-Host "按 Ctrl+C 停止伺服器" -ForegroundColor Yellow
Write-Host "==================================" -ForegroundColor Cyan

# 延遲 2 秒後自動開啟瀏覽器
Start-Job -ScriptBlock {
    param($url)
    Start-Sleep -Seconds 2
    Start-Process $url
} -ArgumentList $url | Out-Null

# 啟動 Python HTTP 伺服器
try {
    & $pythonCommand -m http.server $port
}
catch {
    Write-Host "錯誤: 無法啟動 HTTP 伺服器" -ForegroundColor Red
    Write-Host "錯誤詳情: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "按任意鍵退出"
    exit 1
}

Write-Host "伺服器已停止" -ForegroundColor Yellow
