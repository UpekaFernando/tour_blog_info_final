#!/bin/bash

# Quick Deployment Script for AWS EC2
# Run this script on your EC2 instance after cloning the repo

set -e  # Exit on any error

echo "🚀 Starting Tour Blog Deployment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running on EC2 or server
if [ ! -f "docker-compose.prod.yml" ]; then
    echo -e "${RED}❌ Error: docker-compose.prod.yml not found${NC}"
    echo "Please run this script from the project root directory"
    exit 1
fi

echo -e "${YELLOW}Step 1: Checking prerequisites...${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not installed${NC}"
    echo "Please install Docker first"
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose not installed${NC}"
    echo "Please install Docker Compose first"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"
echo ""

echo -e "${YELLOW}Step 2: Setting up environment variables...${NC}"

# Check if .env exists
if [ ! -f "server/.env" ]; then
    echo "Creating .env from template..."
    cp server/.env.production server/.env
    
    echo -e "${YELLOW}⚠️  IMPORTANT: Edit server/.env and update:${NC}"
    echo "  - DB_PASSWORD"
    echo "  - JWT_SECRET"
    echo ""
    read -p "Press Enter after you've edited server/.env..."
fi

echo -e "${GREEN}✅ Environment variables ready${NC}"
echo ""

echo -e "${YELLOW}Step 3: Stopping existing containers (if any)...${NC}"
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
echo -e "${GREEN}✅ Cleaned up${NC}"
echo ""

echo -e "${YELLOW}Step 4: Pulling latest images...${NC}"
docker-compose -f docker-compose.prod.yml pull
echo -e "${GREEN}✅ Images pulled${NC}"
echo ""

echo -e "${YELLOW}Step 5: Starting containers...${NC}"
docker-compose -f docker-compose.prod.yml up -d
echo -e "${GREEN}✅ Containers started${NC}"
echo ""

echo -e "${YELLOW}Step 6: Waiting for services to be healthy...${NC}"
sleep 10

# Check container status
if docker ps | grep -q "tourblog_mysql.*healthy"; then
    echo -e "${GREEN}✅ MySQL is healthy${NC}"
else
    echo -e "${YELLOW}⏳ MySQL is starting...${NC}"
    sleep 10
fi

if docker ps | grep -q "tourblog_backend"; then
    echo -e "${GREEN}✅ Backend is running${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    docker logs tourblog_backend
    exit 1
fi

if docker ps | grep -q "tourblog_frontend"; then
    echo -e "${GREEN}✅ Frontend is running${NC}"
else
    echo -e "${RED}❌ Frontend failed to start${NC}"
    docker logs tourblog_frontend
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 7: Testing API...${NC}"
sleep 5

if curl -s http://localhost:5000/api/destinations > /dev/null; then
    echo -e "${GREEN}✅ Backend API is responding${NC}"
else
    echo -e "${RED}❌ Backend API not responding${NC}"
    echo "Check logs: docker logs tourblog_backend"
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}🎉 Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Your application is running:"
echo "  - Backend API: http://localhost:5000"
echo "  - Frontend: http://localhost:3000"
echo ""
echo "Next steps:"
echo "  1. Setup Nginx reverse proxy (see QUICK_DEPLOY_TODAY.md)"
echo "  2. Configure domain and SSL"
echo "  3. Test your application"
echo ""
echo "View logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "Stop application:"
echo "  docker-compose -f docker-compose.prod.yml down"
echo ""
