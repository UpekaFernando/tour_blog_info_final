#!/bin/bash

# Setup Nginx for Tour Blog Application
# Run this on your EC2 instance after deploying the app

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}Setting up Nginx reverse proxy...${NC}"
echo ""

# Check if nginx is installed
if ! command -v nginx &> /dev/null; then
    echo -e "${RED}❌ Nginx not installed${NC}"
    echo "Installing Nginx..."
    sudo apt update
    sudo apt install -y nginx
fi

# Copy nginx config
if [ -f "nginx.conf" ]; then
    echo "Copying Nginx configuration..."
    sudo cp nginx.conf /etc/nginx/sites-available/tour-blog
    
    # Enable site
    sudo ln -sf /etc/nginx/sites-available/tour-blog /etc/nginx/sites-enabled/
    
    # Remove default site
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Test configuration
    echo "Testing Nginx configuration..."
    if sudo nginx -t; then
        echo -e "${GREEN}✅ Nginx configuration valid${NC}"
        
        # Restart Nginx
        echo "Restarting Nginx..."
        sudo systemctl restart nginx
        sudo systemctl enable nginx
        
        echo -e "${GREEN}✅ Nginx configured and running${NC}"
        echo ""
        echo "Your application is now accessible at:"
        echo "  http://$(curl -s ifconfig.me)"
        echo ""
    else
        echo -e "${RED}❌ Nginx configuration test failed${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ nginx.conf not found${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi
