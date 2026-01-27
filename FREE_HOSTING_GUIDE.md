# Free Hosting Guide - GitHub Integration

## 🎉 Best Free Hosting Options (2026)

Deploy your full-stack tour blog application **completely free** using these platforms:

| Service | What It Hosts | Free Tier | GitHub Integration |
|---------|---------------|-----------|-------------------|
| **Vercel** | Frontend | Unlimited | ✅ Auto-deploy |
| **Render** | Backend + DB | 750hrs/month | ✅ Auto-deploy |
| **Railway** | Backend + DB | $5 credit/month | ✅ Auto-deploy |
| **PlanetScale** | MySQL DB | 5GB storage | ✅ Via connection |
| **Cloudinary** | Images | 25GB/month | ✅ Via API |

**Total Cost**: $0/month ✨

---

## 🚀 Option 1: Vercel + Render + PlanetScale (RECOMMENDED)

### Architecture:
- **Frontend**: Vercel (React app)
- **Backend**: Render.com (Node.js API)
- **Database**: PlanetScale (MySQL)
- **Images**: Cloudinary (image CDN)

**Why this combo?**
- ✅ All have generous free tiers
- ✅ GitHub auto-deployment
- ✅ Zero credit card required (for Vercel & Render)
- ✅ Production-ready with SSL

---

## 📦 Step 1: Prepare Your Repository

### 1.1 Push to GitHub

```bash
# Initialize git (if not already)
cd "C:\Users\Upeka\Documents\Project 2\tour_blog_info_final2"
git init
git add .
git commit -m "Initial commit - Tour Blog App"

# Create repo on GitHub.com
# Then push:
git remote add origin https://github.com/yourusername/tour-blog.git
git branch -M main
git push -u origin main
```

### 1.2 Add .gitignore

Create `.gitignore` in root:
```
node_modules/
.env
.env.local
dist/
build/
uploads/
*.log
.DS_Store
```

### 1.3 Create Environment Variable Template

Create `.env.example` in server folder:
```
NODE_ENV=production
PORT=5000

# Database
DB_HOST=your-planetscale-host
DB_PORT=3306
DB_NAME=tour_blog
DB_USER=your-username
DB_PASSWORD=your-password

# JWT
JWT_SECRET=your-secret-key-min-32-characters

# Weather API
WEATHER_API_KEY=your-openweathermap-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL
FRONTEND_URL=https://your-app.vercel.app
```

---

## 🗄️ Step 2: Setup PlanetScale (Free MySQL Database)

### 2.1 Create Account

1. Go to https://planetscale.com
2. Sign up with GitHub
3. Create new database: `tour-blog`
4. Choose region: **US East** (or closest to you)

### 2.2 Initialize Database

```bash
# Install PlanetScale CLI (optional)
# Or use web console

# Get connection string from dashboard
# Format: mysql://user:pass@host/database?ssl={"rejectUnauthorized":true}
```

### 2.3 Update Database Config

Edit `server/config/database.js`:

```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: true
      } : undefined
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false
  }
);

module.exports = sequelize;
```

### 2.4 Save Connection Details

```
Host: aws.connect.psdb.cloud
Username: xxxxxxxxxxxxxxxx
Password: pscale_pw_xxxxxxxx
Database: tour-blog
```

---

## 🖼️ Step 3: Setup Cloudinary (Free Image Hosting)

### 3.1 Create Account

1. Go to https://cloudinary.com
2. Sign up (free)
3. Get credentials from dashboard

### 3.2 Install Cloudinary SDK

```bash
cd server
npm install cloudinary multer-storage-cloudinary
```

### 3.3 Update Upload Middleware

Replace `server/middleware/uploadMiddleware.js`:

```javascript
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'tour-blog', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }]
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Images only!'));
  }
});

module.exports = { upload };
```

### 3.4 Update Controllers to Use Cloudinary URL

Controllers will automatically receive `req.file.path` with Cloudinary URL:

```javascript
// In destinationController.js, localServiceController.js
const imageUrl = req.file ? req.file.path : null; // This is Cloudinary URL
```

---

## 🔙 Step 4: Deploy Backend to Render.com

### 4.1 Create Account

1. Go to https://render.com
2. Sign up with GitHub
3. Authorize Render to access your repositories

### 4.2 Create Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: tour-blog-api
   - **Region**: Oregon (or closest)
   - **Branch**: main
   - **Root Directory**: server
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### 4.3 Add Environment Variables

In Render dashboard, add all variables from `.env.example`:

```
NODE_ENV=production
PORT=10000

# PlanetScale Database
DB_HOST=aws.connect.psdb.cloud
DB_PORT=3306
DB_NAME=tour-blog
DB_USER=xxxxxxxxxxxxxxxx
DB_PASSWORD=pscale_pw_xxxxxxxx

# JWT Secret (generate new one)
JWT_SECRET=use-a-very-long-random-string-at-least-32-characters-long

# Weather API
WEATHER_API_KEY=your-openweathermap-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend URL (update after deploying frontend)
FRONTEND_URL=https://tour-blog.vercel.app
```

### 4.4 Update package.json

Make sure `server/package.json` has start script:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 4.5 Deploy

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. Your API will be at: `https://tour-blog-api.onrender.com`

**Note**: Free tier sleeps after 15 min of inactivity. First request may take 30 seconds.

---

## 🌐 Step 5: Deploy Frontend to Vercel

### 5.1 Create Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your repository

### 5.2 Configure Project

1. Click **"Add New"** → **"Project"**
2. Import your GitHub repo
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: client
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
   - **Install Command**: `npm install`

### 5.3 Add Environment Variables

```
VITE_API_URL=https://tour-blog-api.onrender.com/api
```

### 5.4 Update API Configuration

Edit `client/src/utils/api.js`:

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

### 5.5 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. Your site will be at: `https://tour-blog-xxx.vercel.app`

### 5.6 Update Backend CORS

Go back to Render dashboard and update `FRONTEND_URL`:

```
FRONTEND_URL=https://tour-blog-xxx.vercel.app
```

Also update `server/server.js` CORS:

```javascript
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173' // for local development
  ],
  credentials: true
}));
```

Commit and push - Render will auto-redeploy.

---

## 🔄 Step 6: Enable Auto-Deployment

### Both Vercel and Render automatically deploy on push!

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push

# Vercel will auto-deploy frontend
# Render will auto-deploy backend
# Check deployment status in respective dashboards
```

---

## 🚀 Option 2: Railway (All-in-One Alternative)

### Railway offers everything in one platform:

1. Go to https://railway.app
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Railway auto-detects:
   - Node.js backend
   - React frontend
   - Adds MySQL database automatically

**Pros:**
- One platform for everything
- Automatic service detection
- Built-in database

**Cons:**
- Limited free credits ($5/month)
- May run out mid-month with traffic

---

## 🎨 Option 3: Netlify (Frontend Alternative)

If you prefer Netlify over Vercel:

1. Go to https://netlify.com
2. Sign up with GitHub
3. **"Add new site"** → **"Import from Git"**
4. Configure:
   - **Base directory**: client
   - **Build command**: npm run build
   - **Publish directory**: client/dist
5. Add environment variables
6. Deploy

---

## 📊 Free Tier Limits Comparison

| Platform | Bandwidth | Build Minutes | Sleep? | SSL |
|----------|-----------|---------------|--------|-----|
| **Vercel** | 100GB/month | Unlimited | No | ✅ |
| **Render** | 100GB/month | 750hrs runtime | Yes (15min) | ✅ |
| **Railway** | 100GB/month | $5 credit | No | ✅ |
| **Netlify** | 100GB/month | 300 min/month | No | ✅ |
| **PlanetScale** | 1B reads/month | 10M writes | No | ✅ |
| **Cloudinary** | 25GB storage | 25GB bandwidth | No | ✅ |

---

## 🛠️ Step 7: Post-Deployment Setup

### 7.1 Initialize Database

Visit your API endpoint:
```
https://tour-blog-api.onrender.com/api/districts
```

This will trigger Sequelize to create tables automatically.

### 7.2 Seed Database (Optional)

Create `server/seed-production.js`:

```javascript
require('dotenv').config();
const sequelize = require('./config/database');
const { District, Destination, User } = require('./models');

async function seedDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    
    // Sync database (creates tables)
    await sequelize.sync({ alter: true });
    
    // Add seed data
    const districts = await District.bulkCreate([
      { name: 'Colombo', description: 'Commercial capital of Sri Lanka' },
      { name: 'Kandy', description: 'Cultural capital' },
      { name: 'Galle', description: 'Historic coastal city' },
      // Add more...
    ]);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
```

Run once via Render's console or locally with production DB connection.

### 7.3 Test Application

1. Visit your Vercel URL
2. Register a new user
3. Try adding a destination
4. Upload an image
5. Check if everything works

---

## 🔒 Security Best Practices

### 7.1 Environment Variables

✅ Never commit `.env` files
✅ Use different JWT secrets for production
✅ Rotate API keys regularly

### 7.2 Database Security

✅ Use PlanetScale's SSL connection
✅ Never expose database credentials
✅ Enable PlanetScale's branch protection

### 7.3 API Security

✅ Rate limiting (add express-rate-limit)
✅ Helmet.js for security headers
✅ Input validation

---

## 📝 Quick Deploy Checklist

- [ ] Push code to GitHub
- [ ] Create PlanetScale database
- [ ] Setup Cloudinary account
- [ ] Deploy backend to Render
- [ ] Deploy frontend to Vercel
- [ ] Update environment variables
- [ ] Update CORS settings
- [ ] Test all features
- [ ] Initialize database
- [ ] Monitor deployments

---

## 🐛 Troubleshooting

### Backend takes 30 seconds to respond

**Cause**: Render free tier sleeps after 15 min inactivity

**Solution**: 
- Upgrade to paid tier ($7/month)
- Or use Railway
- Or add keep-alive service (see below)

### CORS errors

```javascript
// Ensure server.js has correct CORS:
app.use(cors({
  origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Database connection fails

- Check PlanetScale connection string
- Verify SSL is enabled
- Check environment variables

### Images not uploading

- Verify Cloudinary credentials
- Check API key permissions
- Test with Cloudinary's console

---

## 🎯 Keep Render Service Awake (Optional)

Create a free service to ping your API every 14 minutes:

**Option 1: Use Cron-job.org**
1. Go to https://cron-job.org
2. Add job: `https://tour-blog-api.onrender.com/api/health`
3. Schedule: Every 14 minutes

**Option 2: UptimeRobot**
1. Go to https://uptimerobot.com
2. Add monitor for your API
3. Check interval: 5 minutes

---

## 💡 Pro Tips

1. **Custom Domain**: Both Vercel and Render support free custom domains
2. **Preview Deployments**: Vercel creates preview URLs for PRs
3. **Logs**: Check Render logs for backend errors
4. **Analytics**: Enable Vercel Analytics (free)
5. **Monitoring**: Use PlanetScale Insights to monitor queries

---

## 📈 Upgrade Path (When You Outgrow Free Tier)

| Service | Free → Paid | Cost |
|---------|-------------|------|
| Vercel Pro | Unlimited everything | $20/month |
| Render | No sleep, more memory | $7/month |
| PlanetScale | More storage/queries | $29/month |
| Railway Pro | More credits | $5/month |

---

## 🚀 Deploy Commands Summary

```bash
# 1. Push to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Create accounts:
# - PlanetScale.com (database)
# - Cloudinary.com (images)
# - Render.com (backend)
# - Vercel.com (frontend)

# 3. Deploy automatically via dashboards

# 4. Update environment variables

# 5. Test at your Vercel URL
```

**Total Setup Time**: 30-45 minutes

**Monthly Cost**: $0 💰

---

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [PlanetScale Documentation](https://planetscale.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Railway Documentation](https://docs.railway.app)

---

## ✨ Summary

**Best Free Stack for Your App:**

```
Frontend (React)     →  Vercel          (Free forever)
Backend (Node.js)    →  Render          (750 hours/month)
Database (MySQL)     →  PlanetScale     (5GB free)
Images (CDN)         →  Cloudinary      (25GB free)
Source Control       →  GitHub          (Free)
```

**Result**: Full-stack app hosted 100% free with auto-deployment! 🎉

No credit card required for Vercel. Render may ask for card but won't charge on free tier.

Ready to deploy? Start with Step 1! 🚀
