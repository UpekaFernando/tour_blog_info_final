#!/bin/bash

# Tour Blog Docker Management Script

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

print_green() {
    echo -e "${GREEN}$1${NC}"
}

print_yellow() {
    echo -e "${YELLOW}$1${NC}"
}

print_red() {
    echo -e "${RED}$1${NC}"
}

# Functions
start_services() {
    print_yellow "Starting all services..."
    docker-compose up -d
    print_green "✓ All services started!"
    print_yellow "\nWaiting for services to be healthy..."
    sleep 10
    docker-compose ps
    print_green "\n✓ Application is ready!"
    print_yellow "\nAccess points:"
    echo "  Frontend: http://localhost:5173"
    echo "  Backend:  http://localhost:5000/api"
    echo "  MySQL:    localhost:3306"
}

stop_services() {
    print_yellow "Stopping all services..."
    docker-compose down
    print_green "✓ All services stopped!"
}

restart_services() {
    print_yellow "Restarting all services..."
    docker-compose restart
    print_green "✓ All services restarted!"
}

rebuild_services() {
    print_yellow "Rebuilding and starting all services..."
    docker-compose up -d --build
    print_green "✓ All services rebuilt and started!"
}

view_logs() {
    print_yellow "Showing logs (Ctrl+C to exit)..."
    docker-compose logs -f
}

clean_all() {
    print_red "WARNING: This will remove all containers, volumes, and data!"
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
        print_yellow "Cleaning up..."
        docker-compose down -v
        print_green "✓ Everything cleaned!"
    else
        print_yellow "Cancelled."
    fi
}

seed_database() {
    print_yellow "Seeding database..."
    docker exec -it tourblog_backend node seed.js
    print_green "✓ Database seeded!"
}

show_status() {
    print_yellow "Service Status:"
    docker-compose ps
}

# Main menu
show_menu() {
    echo ""
    print_green "=== Tour Blog Docker Management ==="
    echo "1. Start all services"
    echo "2. Stop all services"
    echo "3. Restart all services"
    echo "4. Rebuild and start"
    echo "5. View logs"
    echo "6. Show status"
    echo "7. Seed database"
    echo "8. Clean all (remove volumes)"
    echo "9. Exit"
    echo ""
    read -p "Select option (1-9): " choice
    
    case $choice in
        1) start_services ;;
        2) stop_services ;;
        3) restart_services ;;
        4) rebuild_services ;;
        5) view_logs ;;
        6) show_status ;;
        7) seed_database ;;
        8) clean_all ;;
        9) exit 0 ;;
        *) print_red "Invalid option" ;;
    esac
    
    show_menu
}

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    print_red "Error: Docker is not installed!"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_red "Error: Docker Compose is not installed!"
    exit 1
fi

# Start
print_green "Tour Blog Docker Management"
show_menu
