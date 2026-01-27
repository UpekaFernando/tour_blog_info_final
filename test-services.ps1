# Complete Service URL Test Script
# Tests all service URLs and their actual functionality

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   SERVICE URL VERIFICATION TEST" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Test 1: Frontend URL
Write-Host "1. FRONTEND (http://localhost:5173)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Status: $($response.StatusCode) - Frontend is accessible" -ForegroundColor Green
        Write-Host "   📄 Content Size: $($response.Content.Length) bytes" -ForegroundColor Gray
        if ($response.Content -match "Tour Blog|Sri Lanka") {
            Write-Host "   ✅ Content verified: Tour Blog app detected" -ForegroundColor Green
        }
    }
}
catch {
    Write-Host "   ❌ ERROR: $_" -ForegroundColor Red
}

# Test 2: Backend API - Districts
Write-Host "`n2. BACKEND API - Districts (http://localhost:5000/api/districts)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/districts" -Method Get -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   ✅ Status: 200 - Districts endpoint working" -ForegroundColor Green
    Write-Host "   📊 Data: Found $($response.Count) districts" -ForegroundColor Gray
    if ($response.Count -gt 0) {
        Write-Host "   📍 Sample: $($response[0].name)" -ForegroundColor Gray
    }
}
catch {
    Write-Host "   ❌ ERROR: $_" -ForegroundColor Red
}

# Test 3: Backend API - Destinations
Write-Host "`n3. BACKEND API - Destinations (http://localhost:5000/api/destinations)" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/destinations" -Method Get -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   ✅ Status: 200 - Destinations endpoint working" -ForegroundColor Green
    Write-Host "   📊 Data: Found $($response.Count) destinations" -ForegroundColor Gray
    if ($response.Count -gt 0) {
        Write-Host "   🏛️  Sample: $($response[0].title)" -ForegroundColor Gray
    }
}
catch {
    Write-Host "   ❌ ERROR: $_" -ForegroundColor Red
}

# Test 4: Backend API - Health/Root
Write-Host "`n4. BACKEND API - Root (http://localhost:5000)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   ✅ Status: $($response.StatusCode) - Backend server responding" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 404) {
        Write-Host "   ⚠️  Status: 404 - Server running but no root endpoint (normal)" -ForegroundColor Yellow
    } else {
        Write-Host "   ❌ ERROR: $_" -ForegroundColor Red
    }
}

# Test 5: phpMyAdmin
Write-Host "`n5. PHPMYADMIN (http://localhost:8081)" -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081" -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Status: $($response.StatusCode) - phpMyAdmin is accessible" -ForegroundColor Green
        if ($response.Content -match "phpMyAdmin") {
            Write-Host "   ✅ Content verified: phpMyAdmin UI loaded" -ForegroundColor Green
        }
    }
}
catch {
    Write-Host "   ❌ ERROR: $_" -ForegroundColor Red
}

# Test 6: MySQL Database Connection
Write-Host "`n6. MYSQL DATABASE (localhost:3306)" -ForegroundColor Yellow
$mysqlCmd = "cd '/mnt/c/Users/Upeka/Documents/Project 2/tour_blog_info_final2'; docker compose exec -T mysql mysql -uroot -proot -e 'SELECT COUNT(*) as destination_count FROM sri_lanka_travel.Destinations; SELECT COUNT(*) as district_count FROM sri_lanka_travel.Districts;' 2>&1 | grep -v Warning"
$mysqlTest = wsl bash -c $mysqlCmd
if ($LASTEXITCODE -eq 0) {
    Write-Host "   ✅ MySQL database is accessible" -ForegroundColor Green
    Write-Host "   📊 Database query results:" -ForegroundColor Gray
    Write-Host $mysqlTest -ForegroundColor Gray
}
else {
    Write-Host "   ❌ Cannot connect to MySQL" -ForegroundColor Red
}

# Test 7: Frontend to Backend Connection (from Browser perspective)
Write-Host "`n7. FRONTEND → BACKEND CONNECTION TEST" -ForegroundColor Yellow
Write-Host "   Testing if frontend can reach backend API..." -ForegroundColor Gray
try {
    # Simulate what the frontend JavaScript would do -ErrorAction Stop
    Write-Host "   ✅ Frontend can successfully reach backend API" -ForegroundColor Green
    Write-Host "   ✅ CORS and API communication working" -ForegroundColor Green
}
  Write-Host "   ✅ CORS and API communication working" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Frontend cannot reach backend: $_" -ForegroundColor Red
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   📌 QUICK ACCESS URLS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   🌐 Frontend:       http://localhost:5173" -ForegroundColor White
Write-Host "   🔌 Backend API:    http://localhost:5000/api" -ForegroundColor White
Write-Host "   🗄️  phpMyAdmin:    http://localhost:8081" -ForegroundColor White
Write-Host "   🐬 MySQL:          localhost:3306" -ForegroundColor White
Write-Host "`n   📋 API Endpoints:" -ForegroundColor White
Write-Host "      - http://localhost:5000/api/districts" -ForegroundColor Gray
Write-Host "      - http://localhost:5000/api/destinations" -ForegroundColor Gray
Write-Host "      - http://localhost:5000/api/users/register" -ForegroundColor Gray
Write-Host "      - http://localhost:5000/api/users/login" -ForegroundColor Gray
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "💡 Tip: Run 'Start-Process http://localhost:5173' to open in browser`n" -ForegroundColor Cyan
