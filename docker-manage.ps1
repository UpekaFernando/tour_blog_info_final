# Tour Blog Docker Management Script (PowerShell)

function Print-Green {
    param($message)
    Write-Host $message -ForegroundColor Green
}

function Print-Yellow {
    param($message)
    Write-Host $message -ForegroundColor Yellow
}

function Print-Red {
    param($message)
    Write-Host $message -ForegroundColor Red
}

function Start-Services {
    Print-Yellow "Starting all services..."
    docker-compose up -d
    Print-Green "✓ All services started!"
    Print-Yellow "`nWaiting for services to be healthy..."
    Start-Sleep -Seconds 10
    docker-compose ps
    Print-Green "`n✓ Application is ready!"
    Print-Yellow "`nAccess points:"
    Write-Host "  Frontend: http://localhost:5173"
    Write-Host "  Backend:  http://localhost:5000/api"
    Write-Host "  MySQL:    localhost:3306"
}

function Stop-Services {
    Print-Yellow "Stopping all services..."
    docker-compose down
    Print-Green "✓ All services stopped!"
}

function Restart-Services {
    Print-Yellow "Restarting all services..."
    docker-compose restart
    Print-Green "✓ All services restarted!"
}

function Rebuild-Services {
    Print-Yellow "Rebuilding and starting all services..."
    docker-compose up -d --build
    Print-Green "✓ All services rebuilt and started!"
}

function View-Logs {
    Print-Yellow "Showing logs (Ctrl+C to exit)..."
    docker-compose logs -f
}

function Clean-All {
    Print-Red "WARNING: This will remove all containers, volumes, and data!"
    $confirm = Read-Host "Are you sure? (yes/no)"
    if ($confirm -eq "yes") {
        Print-Yellow "Cleaning up..."
        docker-compose down -v
        Print-Green "✓ Everything cleaned!"
    } else {
        Print-Yellow "Cancelled."
    }
}

function Seed-Database {
    Print-Yellow "Seeding database..."
    docker exec -it tourblog_backend node seed.js
    Print-Green "✓ Database seeded!"
}

function Show-Status {
    Print-Yellow "Service Status:"
    docker-compose ps
}

function Show-Menu {
    Write-Host ""
    Print-Green "=== Tour Blog Docker Management ==="
    Write-Host "1. Start all services"
    Write-Host "2. Stop all services"
    Write-Host "3. Restart all services"
    Write-Host "4. Rebuild and start"
    Write-Host "5. View logs"
    Write-Host "6. Show status"
    Write-Host "7. Seed database"
    Write-Host "8. Clean all (remove volumes)"
    Write-Host "9. Exit"
    Write-Host ""
    
    $choice = Read-Host "Select option (1-9)"
    
    switch ($choice) {
        "1" { Start-Services }
        "2" { Stop-Services }
        "3" { Restart-Services }
        "4" { Rebuild-Services }
        "5" { View-Logs }
        "6" { Show-Status }
        "7" { Seed-Database }
        "8" { Clean-All }
        "9" { exit 0 }
        default { Print-Red "Invalid option" }
    }
    
    Show-Menu
}

# Check if docker is installed
try {
    docker --version | Out-Null
} catch {
    Print-Red "Error: Docker is not installed!"
    exit 1
}

try {
    docker-compose --version | Out-Null
} catch {
    Print-Red "Error: Docker Compose is not installed!"
    exit 1
}

# Start
Print-Green "Tour Blog Docker Management"
Show-Menu
