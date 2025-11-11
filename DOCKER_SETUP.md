# Tour Blog Application - Complete Docker Setup

## 📦 What's Been Created

### Docker Files
1. **docker-compose.yml** - Orchestrates all services (MySQL, Backend, Frontend)
2. **server/Dockerfile** - Backend Node.js container
3. **client/Dockerfile** - Frontend React container with Nginx
4. **client/nginx.conf** - Nginx configuration for serving React app
5. **server/.dockerignore** - Files to exclude from backend image
6. **client/.dockerignore** - Files to exclude from frontend image

### Management Scripts
7. **docker-manage.ps1** - PowerShell script for Windows
8. **docker-manage.sh** - Bash script for Linux/Mac
9. **DOCKER_README.md** - Complete documentation

## 🚀 Quick Start

### Option 1: Using PowerShell Script (Windows)
```powershell
.\docker-manage.ps1
```
Then select option 1 to start all services.

### Option 2: Using Docker Compose Directly
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 📊 Services

| Service | Port | Description |
|---------|------|-------------|
| Frontend | 5173 | React app served by Nginx |
| Backend | 5000 | Node.js/Express API |
| MySQL | 3306 | Database |

## 🔧 Post-Deployment Steps

### 1. Seed the Database (First Time Only)
```bash
docker exec -it tourblog_backend node seed.js
```

### 2. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/test

## 📝 Important Notes

### Database Connection
- The backend automatically connects to MySQL using hostname `mysql`
- Database credentials are in `docker-compose.yml`
- Data persists in Docker volume `mysql_data`

### Image Uploads
- Uploads directory is mounted as a volume
- Images persist even when containers restart
- Located at `./server/uploads` on host

### Environment Variables
Backend uses these environment variables (set in docker-compose.yml):
- `DB_HOST=mysql`
- `DB_NAME=sri_lanka_travel`
- `DB_USER=root`
- `DB_PASSWORD=root`
- `PORT=5000`

## 🛠 Common Commands

### Start/Stop
```bash
docker-compose up -d          # Start in background
docker-compose down           # Stop all services
docker-compose restart        # Restart all services
```

### Rebuild After Code Changes
```bash
docker-compose up -d --build  # Rebuild and start
```

### View Logs
```bash
docker-compose logs -f                # All services
docker-compose logs -f backend        # Backend only
docker-compose logs -f frontend       # Frontend only
```

### Clean Everything
```bash
docker-compose down -v        # Remove containers and volumes
```

## 🐛 Troubleshooting

### Backend Not Connecting to Database
```bash
# Check MySQL health
docker-compose ps

# View MySQL logs
docker-compose logs mysql

# Restart backend
docker-compose restart backend
```

### Frontend Shows API Errors
- Ensure backend is running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`
- Verify API URL in browser network tab should be `http://localhost:5000/api`

### Port Already in Use
If ports 3306, 5000, or 5173 are already in use:
1. Stop the services using those ports
2. Or change ports in `docker-compose.yml`

## 🏗 Architecture

```
┌─────────────────┐
│   Frontend      │ Port 5173
│   (Nginx)       │ Serves React App
└────────┬────────┘
         │
         │ HTTP Requests
         │
┌────────▼────────┐
│   Backend       │ Port 5000
│   (Node.js)     │ Express API
└────────┬────────┘
         │
         │ SQL Queries
         │
┌────────▼────────┐
│   MySQL         │ Port 3306
│   Database      │ Stores Data
└─────────────────┘
```

## 📦 Production Considerations

Before deploying to production:

1. **Security**
   - Change database credentials
   - Update JWT_SECRET
   - Add HTTPS/SSL certificates

2. **Performance**
   - Use production-grade database
   - Configure Nginx caching
   - Enable gzip compression (already configured)

3. **Monitoring**
   - Add health check endpoints
   - Set up logging
   - Configure alerts

4. **Backups**
   - Regular database backups
   - Backup upload files

## 📚 Additional Resources

- **DOCKER_README.md** - Detailed documentation
- **docker-compose.yml** - Service configuration
- Backend Dockerfile: `server/Dockerfile`
- Frontend Dockerfile: `client/Dockerfile`

## ✅ Success Checklist

- [ ] Docker and Docker Compose installed
- [ ] All services start successfully: `docker-compose up -d`
- [ ] Frontend accessible at http://localhost:5173
- [ ] Backend accessible at http://localhost:5000/api/test
- [ ] Database seeded: `docker exec -it tourblog_backend node seed.js`
- [ ] Images display correctly in the application

---

**Need Help?** Check the logs: `docker-compose logs -f`
