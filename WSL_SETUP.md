# Moving Tour Blog Project to WSL

## Step 1: Copy Project to WSL

From PowerShell, copy the project to WSL:
```powershell
# This copies from Windows to WSL home directory
wsl cp -r "/mnt/c/Users/Upeka/Documents/Project 2/tour_blog_info_final2" ~/tour_blog_info_final2
```

## Step 2: Install Prerequisites in WSL

Open WSL terminal and run:

```bash
# Update package lists
sudo apt update

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL
sudo apt install -y mysql-server

# Install Docker
sudo apt install -y docker.io docker-compose

# Add user to docker group
sudo usermod -aG docker $USER

# Start Docker service
sudo service docker start

# Start MySQL service
sudo service mysql start
```

## Step 3: Setup MySQL Database

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Login to MySQL
sudo mysql -u root

# Create database and user
CREATE DATABASE sri_lanka_travel;
CREATE USER 'tourblog_user'@'localhost' IDENTIFIED BY 'tourblog_pass';
GRANT ALL PRIVILEGES ON sri_lanka_travel.* TO 'tourblog_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 4: Install Project Dependencies

```bash
cd ~/tour_blog_info_final2

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

## Step 5: Update Configuration

Update `server/.env`:
```bash
cd ~/tour_blog_info_final2/server
nano .env
```

Ensure it has:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sri_lanka_travel
DB_USER=root
DB_PASSWORD=root
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
```

## Step 6: Seed Database

```bash
cd ~/tour_blog_info_final2/server
node seed.js
```

## Step 7: Run with Docker (Recommended)

```bash
cd ~/tour_blog_info_final2

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Seed database
docker exec -it tourblog_backend node seed.js
```

## Step 8: Or Run Without Docker

```bash
# Terminal 1 - Backend
cd ~/tour_blog_info_final2/server
npm run dev

# Terminal 2 - Frontend
cd ~/tour_blog_info_final2/client
npm run dev
```

## Access Application

- Frontend: http://localhost:5173
- Backend: http://localhost:5000/api

## Troubleshooting

### Docker Permission Denied
```bash
sudo service docker start
sudo chmod 666 /var/run/docker.sock
```

### MySQL Not Starting
```bash
sudo service mysql start
sudo mysql -u root
```

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :5000
# Kill process
sudo kill -9 <PID>
```

## WSL-Specific Notes

1. **File System**: Project is now at `~/tour_blog_info_final2` in WSL
2. **Access from Windows**: Use `\\wsl$\Ubuntu\home\<username>\tour_blog_info_final2`
3. **VS Code**: Install "Remote - WSL" extension to edit files
4. **Performance**: Much better than running on /mnt/c/ drive

## Quick Start Script

Save this as `setup-wsl.sh`:
```bash
#!/bin/bash
cd ~/tour_blog_info_final2
echo "Starting Tour Blog in WSL..."
docker-compose up -d
echo "Waiting for services..."
sleep 10
docker-compose ps
echo "Application ready at http://localhost:5173"
```

Make executable and run:
```bash
chmod +x setup-wsl.sh
./setup-wsl.sh
```
