@echo off
chcp 65001 >nul
title 日語語法學習網站

echo.
echo ========================================
echo           日語語法學習網站
echo ========================================
echo.

REM 檢查是否在正確的目錄
if not exist "grammer.md" (
    echo 錯誤: 找不到 grammer.md 檔案
    echo 請確保在正確的專案目錄中運行此腳本
    echo.
    pause
    exit /b 1
)

REM 檢查 Python 是否可用
python --version >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON_CMD=python
    goto :python_found
)

python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON_CMD=python3
    goto :python_found
)

py --version >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON_CMD=py
    goto :python_found
)

echo 錯誤: 找不到 Python 安裝
echo 請先安裝 Python 或確保 Python 在 PATH 中
echo 下載地址: https://www.python.org/downloads/
echo.
pause
exit /b 1

:python_found
echo 找到 Python，正在啟動伺服器...
echo.
echo 伺服器地址: http://localhost:8000
echo 瀏覽器將自動開啟
echo 按 Ctrl+C 停止伺服器
echo.
echo ========================================
echo.

REM 延遲 3 秒後開啟瀏覽器
start "" /min cmd /c "timeout /t 3 >nul && start http://localhost:8000"

REM 啟動 Python HTTP 伺服器
%PYTHON_CMD% -m http.server 8000

echo.
echo 伺服器已停止
pause
