# ========================================
# DOCKER SERVICE VERIFICATION GUIDE
# ========================================

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  🐳 DOCKER SERVICES STATUS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if containers are running
wsl bash -c "cd '/mnt/c/Users/Upeka/Documents/Project 2/tour_blog_info_final2'; docker compose ps"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  ✅ TESTING SERVICES" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test Backend
Write-Host "1. BACKEND API (Port 5000):" -ForegroundColor Yellow
try {
    $districts = Invoke-RestMethod -Uri "http://localhost:5000/api/districts" -ErrorAction Stop
    $destinations = Invoke-RestMethod -Uri "http://localhost:5000/api/destinations" -ErrorAction Stop
    Write-Host "   ✅ Districts: $($districts.Count) records" -ForegroundColor Green
    Write-Host "   ✅ Destinations: $($destinations.Count) records" -ForegroundColor Green
    Write-Host "   ✅ Backend API is WORKING PERFECTLY!" -ForegroundColor Green
}
catch {
    Write-Host "   ❌ Backend Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Frontend
Write-Host "`n2. FRONTEND (Port 5173):" -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    Write-Host "   ✅ Status: $($frontend.StatusCode)" -ForegroundColor Green
    Write-Host "   ✅ Frontend is WORKING!" -ForegroundColor Green
}
catch {
    Write-Host "   ⚠️  Frontend not responding (may still be starting)" -ForegroundColor Yellow
    Write-Host "   Wait 10-20 seconds and try: Start-Process http://localhost:5173" -ForegroundColor Gray
}

# Test phpMyAdmin
Write-Host "`n3. PHPMYADMIN (Port 8081):" -ForegroundColor Yellow
try {
    $phpmyadmin = Invoke-WebRequest -Uri "http://localhost:8081" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    Write-Host "   ✅ Status: $($phpmyadmin.StatusCode)" -ForegroundColor Green
    Write-Host "   ✅ phpMyAdmin is WORKING!" -ForegroundColor Green
}
catch {
    Write-Host "   ⚠️  phpMyAdmin not responding (may still be starting)" -ForegroundColor Yellow
    Write-Host "   Wait 10-20 seconds and try: Start-Process http://localhost:8081" -ForegroundColor Gray
}

# Test MySQL
Write-Host "`n4. MYSQL DATABASE (Port 3306):" -ForegroundColor Yellow
$mysqlCmd = "cd '/mnt/c/Users/Upeka/Documents/Project 2/tour_blog_info_final2'; docker compose exec -T mysql mysql -uroot -proot -e 'SELECT VERSION(); SHOW DATABASES;' 2>&1 | grep -v Warning | head -10"
$mysqlCheck = wsl bash -c $mysqlCmd
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ MySQL is WORKING!" -ForegroundColor Green
    Write-Host "   📊 Details:" -ForegroundColor Gray
    Write-Host $mysqlCheck -ForegroundColor Gray
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  📋 QUICK ACCESS URLS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Frontend:   http://localhost:5173" -ForegroundColor White
Write-Host "  Backend:    http://localhost:5000/api" -ForegroundColor White
Write-Host "  phpMyAdmin: http://localhost:8081" -ForegroundColor White
Write-Host "  MySQL:      localhost:3306 (root/root)" -ForegroundColor White

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  🔧 USEFUL COMMANDS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Open Frontend:  Start-Process http://localhost:5173" -ForegroundColor Gray
Write-Host "  Open phpMyAdmin: Start-Process http://localhost:8081" -ForegroundColor Gray
Write-Host "  View Logs:      wsl bash -c `"cd '/mnt/c/Users/Upeka/Documents/Project 2/tour_blog_info_final2'; docker compose logs -f`"" -ForegroundColor Gray
Write-Host "  Stop All:       wsl bash -c `"cd '/mnt/c/Users/Upeka/Documents/Project 2/tour_blog_info_final2'; docker compose down`"" -ForegroundColor Gray
Write-Host "  Restart All:    wsl bash -c `"cd '/mnt/c/Users/Upeka/Documents/Project 2/tour_blog_info_final2'; docker compose restart`"" -ForegroundColor Gray
Write-Host "========================================`n" -ForegroundColor Cyan
