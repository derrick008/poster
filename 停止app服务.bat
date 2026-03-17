@echo off
chcp 65001 >nul
echo 正在查找占用 8080 端口的进程...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    echo 关闭进程 PID: %%a
    taskkill /F /PID %%a 2>nul
)
echo 若上面无输出，说明 8080 未被占用；否则服务已停止。
pause
