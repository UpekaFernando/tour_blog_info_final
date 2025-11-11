# 🐳 Docker Hub Images - Tour Blog Application

## 📦 Available Images

Your application images are published on Docker Hub:

- **Backend**: `upeka2002/tourblog-backend:latest`
- **Frontend**: `upeka2002/tourblog-frontend:latest`

## 🚀 Quick Start with Docker Hub Images

### Option 1: Use Production Compose File (Recommended)

This pulls pre-built images from Docker Hub:

```bash
# Pull latest images from Docker Hub
docker-compose -f docker-compose.prod.yml pull

# Start all containers
docker-compose -f docker-compose.prod.yml up -d

# Seed the database
docker exec -it tourblog_backend node seed.js

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Option 2: Use Development Compose File

This builds images locally from source code:

```bash
# Build and start containers
docker-compose up -d --build

# Seed the database
docker exec -it tourblog_backend node seed.js
```

## 🌐 Access Your Application

After starting containers:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/test
- **Database (phpMyAdmin)**: http://localhost:8081
  - Username: `root`
  - Password: `root`

## 🔄 Update Images

When new code is pushed to GitHub, images are automatically rebuilt. To get the latest:

```bash
# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Restart containers with new images
docker-compose -f docker-compose.prod.yml up -d

# Or do both in one command
docker-compose -f docker-compose.prod.yml pull && docker-compose -f docker-compose.prod.yml up -d
```

## 📋 Common Commands

```bash
# View running containers
docker-compose -f docker-compose.prod.yml ps

# Stop all containers
docker-compose -f docker-compose.prod.yml down

# Stop and remove volumes (WARNING: deletes database data)
docker-compose -f docker-compose.prod.yml down -v

# View logs
docker-compose -f docker-compose.prod.yml logs backend
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs mysql

# Access container shell
docker exec -it tourblog_backend sh
docker exec -it tourblog_frontend sh
```

## 🔐 Login Credentials

**Admin Account:**
- Email: `admin@example.com`
- Password: `admin123`

**Regular User:**
- Email: `user@example.com`
- Password: `user123`

## 📂 Files Explained

- **docker-compose.yml** - Development version (builds from source)
- **docker-compose.prod.yml** - Production version (uses Docker Hub images)
- **.github/workflows/docker-build-push.yml** - CI/CD pipeline

## 🛠️ For Developers

### Manual Docker Hub Push

If you want to manually push images:

```bash
# Login to Docker Hub
docker login -u upeka2002

# Build images
docker build -t upeka2002/tourblog-backend:latest ./server
docker build -t upeka2002/tourblog-frontend:latest ./client

# Push to Docker Hub
docker push upeka2002/tourblog-backend:latest
docker push upeka2002/tourblog-frontend:latest
```

### Tag Specific Version

```bash
# Tag with version number
docker tag upeka2002/tourblog-backend:latest upeka2002/tourblog-backend:v1.0.0
docker tag upeka2002/tourblog-frontend:latest upeka2002/tourblog-frontend:v1.0.0

# Push tagged versions
docker push upeka2002/tourblog-backend:v1.0.0
docker push upeka2002/tourblog-frontend:v1.0.0
```

## 🌍 Deploy Anywhere

Anyone can now deploy your application:

```bash
# On any machine with Docker installed:
curl -O https://raw.githubusercontent.com/UpekaFernando/tour_blog_info_final/main/docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d
docker exec -it tourblog_backend node seed.js
```

## 📊 Image Stats

View your images on Docker Hub:
- Backend: https://hub.docker.com/r/upeka2002/tourblog-backend
- Frontend: https://hub.docker.com/r/upeka2002/tourblog-frontend

---

**Docker Hub Username**: `upeka2002`  
**GitHub Repository**: https://github.com/UpekaFernando/tour_blog_info_final
