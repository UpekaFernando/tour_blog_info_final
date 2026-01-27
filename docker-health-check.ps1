# Docker Health Check Script for Tour Blog Application
# Run this script to verify all Docker containers are working correctly

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   DOCKER HEALTH CHECK REPORT" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Container Status
Write-Host "1. CONTAINER STATUS:" -ForegroundColor Yellow
wsl bash -c "cd '/mnt/c/Users/Upeka/Documents/Project 2/tour_blog_info_final2' && docker compose ps"

# 2. MySQL Database Check
Write-Host "`n2. MYSQL DATABASE:" -ForegroundColor Yellow
wsl bash -c "cd '/mnt/c/Users/Upeka/Documents/Project 2/tour_blog_info_final2' && docker compose exec -T mysql mysql -uroot -proot -e 'SELECT VERSION() as MySQL_Version; SHOW DATABASES;' 2>&1 | grep -v Warning"

Write-Host "`n   Database Tables:" -ForegroundColor Green
wsl bash -c "cd '/mnt/c/Users/Upeka/Documents/Project 2/tour_blog_info_final2' && docker compose exec -T mysql mysql -uroot -proot -e 'USE sri_lanka_travel; SHOW TABLES;' 2>&1 | grep -v Warning"

# 3. Backend API Tests
Write-Host "`n3. BACKEND API ENDPOINTS:" -ForegroundColor Yellow

Write-Host "   Testing /api/districts..." -ForegroundColor Gray
$districts = wsl bash -c "curl -s -o /dev/null -w '%{http_code}' http://localhost:5000/api/districts"
if ($districts -eq "200") {
    Write-Host "   ✅ Districts: Status $districts" -ForegroundColor Green
} else {
    Write-Host "   ❌ Districts: Status $districts" -ForegroundColor Red
}

Write-Host "   Testing /api/destinations..." -ForegroundColor Gray
$destinations = wsl bash -c "curl -s -o /dev/null -w '%{http_code}' http://localhost:5000/api/destinations"
if ($destinations -eq "200") {
    Write-Host "   ✅ Destinations: Status $destinations" -ForegroundColor Green
} else {
    Write-Host "   ❌ Destinations: Status $destinations" -ForegroundColor Red
}

Write-Host "   Testing /api/users..." -ForegroundColor Gray
$users = wsl bash -c "curl -s -o /dev/null -w '%{http_code}' http://localhost:5000/api/users"
if ($users -eq "200") {
    Write-Host "   ✅ Users: Status $users" -ForegroundColor Green
} else {
    Write-Host "   ❌ Users: Status $users" -ForegroundColor Red
}

# 4. Frontend Check
Write-Host "`n4. FRONTEND:" -ForegroundColor Yellow
$frontend = wsl bash -c "curl -s -o /dev/null -w '%{http_code}' http://localhost:5173"
if ($frontend -eq "200") {
    Write-Host "   ✅ Frontend: Status $frontend (http://localhost:5173)" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend: Status $frontend" -ForegroundColor Red
}

# 5. phpMyAdmin Check
Write-Host "`n5. PHPMYADMIN:" -ForegroundColor Yellow
$phpmyadmin = wsl bash -c "curl -s -o /dev/null -w '%{http_code}' http://localhost:8081"
if ($phpmyadmin -eq "200") {
    Write-Host "   ✅ phpMyAdmin: Status $phpmyadmin (http://localhost:8081)" -ForegroundColor Green
} else {
    Write-Host "   ❌ phpMyAdmin: Status $phpmyadmin" -ForegroundColor Red
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   SERVICE URLS:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Frontend:    http://localhost:5173" -ForegroundColor White
Write-Host "   Backend API: http://localhost:5000/api" -ForegroundColor White
Write-Host "   phpMyAdmin:  http://localhost:8081" -ForegroundColor White
Write-Host "   MySQL:       localhost:3306" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan
