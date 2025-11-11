# 🚀 GitHub Actions CI/CD Setup - Docker Hub Auto-Deploy

This guide will help you set up automatic Docker image builds and pushes to Docker Hub whenever you commit to GitHub.

## 📋 Prerequisites

Before starting, you need:
1. **GitHub Account** (you already have: UpekaFernando/tour_blog_info_final)
2. **Docker Hub Account** - Create one at https://hub.docker.com if you don't have it

---

## 🔧 Setup Steps

### **Step 1: Create Docker Hub Account (if you don't have one)**

1. Go to https://hub.docker.com
2. Click "Sign Up" and create an account
3. Remember your Docker Hub username (e.g., `yourusername`)

### **Step 2: Create Docker Hub Access Token**

1. Log in to Docker Hub
2. Click your username (top right) → **Account Settings**
3. Go to **Security** tab
4. Click **New Access Token**
5. Give it a name: `github-actions-token`
6. Select **Read, Write, Delete** permissions
7. Click **Generate**
8. **COPY THE TOKEN IMMEDIATELY** (you can't see it again!)

### **Step 3: Add Secrets to GitHub Repository**

1. Go to your GitHub repo: https://github.com/UpekaFernando/tour_blog_info_final
2. Click **Settings** (top menu)
3. In left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**

**Add these TWO secrets:**

**Secret 1:**
- Name: `DOCKER_USERNAME`
- Value: Your Docker Hub username (e.g., `yourusername`)
- Click **Add secret**

**Secret 2:**
- Name: `DOCKER_PASSWORD`
- Value: The access token you copied from Docker Hub
- Click **Add secret**

### **Step 4: Push Code to GitHub**

Open your terminal (PowerShell or WSL) and run:

\`\`\`bash
cd "C:\\Users\\Upeka\\Documents\\Project 2\\tour_blog_info_final2"

# Add all files
git add .

# Commit with message
git commit -m "Add GitHub Actions CI/CD for Docker Hub"

# Push to GitHub
git push origin main
\`\`\`

---

## ✅ What Happens Next (Automatic)

Once you push to GitHub:

1. ✅ GitHub Actions workflow triggers automatically
2. ✅ Builds **Backend** Docker image from `server/Dockerfile`
3. ✅ Builds **Frontend** Docker image from `client/Dockerfile`
4. ✅ Pushes both images to Docker Hub with tags:
   - `yourusername/tourblog-backend:latest`
   - `yourusername/tourblog-backend:main-abc1234` (commit SHA)
   - `yourusername/tourblog-frontend:latest`
   - `yourusername/tourblog-frontend:main-abc1234` (commit SHA)

---

## 🎯 View Build Status

After pushing:
1. Go to: https://github.com/UpekaFernando/tour_blog_info_final/actions
2. You'll see your workflow running
3. Click on it to see real-time build logs
4. Once complete, go to Docker Hub to see your images!

---

## 🐳 Your Docker Hub Images Will Be At:

- **Backend**: `https://hub.docker.com/r/yourusername/tourblog-backend`
- **Frontend**: `https://hub.docker.com/r/yourusername/tourblog-frontend`

Replace `yourusername` with your actual Docker Hub username.

---

## 📦 How to Use Your Published Images

Anyone can now pull and run your app:

\`\`\`bash
# Pull images from Docker Hub
docker pull yourusername/tourblog-backend:latest
docker pull yourusername/tourblog-frontend:latest

# Run containers
docker run -d -p 5000:5000 yourusername/tourblog-backend:latest
docker run -d -p 5173:80 yourusername/tourblog-frontend:latest
\`\`\`

---

## 🔄 Auto-Update Workflow

Every time you make changes:
1. Make code changes locally
2. Commit: `git commit -m "Your changes"`
3. Push: `git push origin main`
4. GitHub Actions automatically rebuilds and pushes new images! 🎉

---

## 🛠️ Troubleshooting

**If workflow fails:**
1. Check GitHub Actions logs for errors
2. Verify Docker Hub credentials in GitHub secrets
3. Ensure Docker Hub token has correct permissions

**If images don't appear:**
1. Wait 3-5 minutes after workflow completes
2. Check Docker Hub repositories list
3. Ensure repositories are set to Public (Settings → Visibility)

---

## 📞 Need Help?

Check workflow status: https://github.com/UpekaFernando/tour_blog_info_final/actions

---

**Created: November 11, 2025**
