# Tour Blog - Sri Lanka Travel Information Platform

A full-stack web application for exploring Sri Lankan destinations with React, Node.js, and MySQL.

## 🚀 Quick Start

```bash
docker compose up -d
```

Access: http://localhost:5173

## 📁 Essential Files

1. **client/Dockerfile** - Frontend container configuration
2. **server/Dockerfile** - Backend container configuration  
3. **docker-compose.yml** - Multi-container orchestration
4. **.dockerignore** - Docker build exclusions (in client/ and server/)
5. **Jenkinsfile** - CI/CD pipeline configuration
6. **terraform/** - Infrastructure as Code (main.tf, variables.tf, outputs.tf, user-data.sh)
7. **.gitignore** - Git exclusions

## 🛠️ Technology Stack

- **Frontend**: React 18 + Vite + Material-UI
- **Backend**: Node.js + Express + Sequelize
- **Database**: MySQL 8.0
- **DevOps**: Docker, Jenkins, Terraform, AWS

## 🐳 Docker Services

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **phpMyAdmin**: http://localhost:8081
- **MySQL**: localhost:3306

## 📚 Commands

```bash
# Start services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Deploy to AWS
cd terraform && terraform apply
```

## 🔧 Environment

**Database:**
- Host: mysql
- Database: sri_lanka_travel
- User: root
- Password: root

## 📞 Author

Upeka - Tour Blog System
