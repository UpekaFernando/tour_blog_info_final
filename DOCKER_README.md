# Tour Blog Application - Docker Setup

## Prerequisites
- Docker Desktop installed
- Docker Compose installed

## Quick Start

### 1. Build and Start All Services
```bash
docker-compose up -d
```

This will start:
- MySQL database on port 3306
- Backend API on port 5000
- Frontend on port 5173

### 2. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **MySQL**: localhost:3306

### 3. Stop All Services
```bash
docker-compose down
```

### 4. Stop and Remove All Data
```bash
docker-compose down -v
```

## Docker Commands

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Restart Services
```bash
# All services
docker-compose restart

# Specific service
docker-compose restart backend
```

### Rebuild After Code Changes
```bash
# Rebuild all
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build backend
```

### Access Container Shell
```bash
# Backend
docker exec -it tourblog_backend sh

# MySQL
docker exec -it tourblog_mysql mysql -uroot -proot sri_lanka_travel
```

## Database Initialization

The database will be automatically initialized with the schema when the MySQL container starts for the first time. If you need to seed data:

```bash
# Access backend container
docker exec -it tourblog_backend sh

# Run seed script
node seed.js
```

## Environment Variables

### Backend (.env)
```
DB_HOST=mysql
DB_PORT=3306
DB_NAME=sri_lanka_travel
DB_USER=root
DB_PASSWORD=root
PORT=5000
JWT_SECRET=your_jwt_secret_key
```

### Frontend
Built with environment variable:
```
VITE_API_URL=http://localhost:5000/api
```

## Volumes

### mysql_data
Persists database data across container restarts.

### uploads
Backend uploads directory is mounted to persist uploaded images.

## Troubleshooting

### Database Connection Issues
```bash
# Check if MySQL is healthy
docker-compose ps

# View MySQL logs
docker-compose logs mysql

# Restart MySQL
docker-compose restart mysql
```

### Backend Not Starting
```bash
# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Frontend Not Loading
```bash
# Check frontend logs
docker-compose logs frontend

# Rebuild frontend
docker-compose up -d --build frontend
```

### Clean Start (Remove Everything)
```bash
docker-compose down -v
docker-compose up -d --build
```

## Production Deployment

For production, update the following:

1. Change database credentials in `docker-compose.yml`
2. Update `JWT_SECRET` in backend environment
3. Update `VITE_API_URL` to your production API URL
4. Use proper volume mounts for uploads
5. Add SSL/TLS certificates for HTTPS

## Network

All services run on the `tourblog_network` bridge network, allowing them to communicate using service names (e.g., `backend` can connect to `mysql` using hostname `mysql`).
