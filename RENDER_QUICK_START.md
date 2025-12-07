# Quick Render Deployment Steps

## 🚀 Fast Track Deployment

### 1️⃣ Create PostgreSQL Database (5 minutes)
1. Go to https://dashboard.render.com
2. Click **New +** → **PostgreSQL**
3. Set name: `poseify-postgres`
4. Choose **Free** plan
5. Click **Create Database**
6. ⏰ Wait 2-3 minutes for provisioning
7. 📋 **Copy the Internal Database URL** from the Info tab

### 2️⃣ Deploy Web Service (10 minutes)
1. Click **New +** → **Web Service**
2. Connect GitHub: `kunamvamsikrishna/poseify`
3. Fill in:
   - **Name**: `poseify-api`
   - **Runtime**: `Node`
   - **Build Command**: 
     ```
     cd backend && npm install && cd ../python && pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt
     ```
   - **Start Command**: 
     ```
     cd backend && node server.js
     ```
4. Choose **Free** plan
5. Click **Create Web Service** (don't deploy yet!)

### 3️⃣ Add Environment Variables
Click **Environment** tab and add:

```
NODE_ENV=production
PORT=10000

# Postgres (from Step 1)
DATABASE_URL=<paste-internal-database-url-here>

# MongoDB (from your .env file)
MONGO_URI=<Your MongoDB Atlas Connection String>

# JWT (generate a strong secret)
JWT_SECRET=<Your JWT Secret Key>

# Cloudinary (from your .env file)
CLOUDINARY_CLOUD_NAME=<Your Cloud Name>
CLOUDINARY_API_KEY=<Your API Key>
CLOUDINARY_API_SECRET=<Your API Secret>

# Brevo (your existing credentials from .env file)
BREVO_API_KEY=<Your Brevo API Key>
BREVO_FROM_EMAIL=<Your verified sender email>
BREVO_FROM_NAME=POSEIFY
ADMIN_EMAIL=<Your admin email>

# Python
PYTHON_PATH=/opt/render/project/src/python/venv/bin/python
```

### 4️⃣ Deploy!
1. Click **Manual Deploy** → **Deploy latest commit**
2. Watch logs (takes 5-8 minutes)
3. Once deployed, your API is live at: `https://poseify-api.onrender.com`

### 5️⃣ Test
```bash
# Health check
https://poseify-api.onrender.com/health

# API root
https://poseify-api.onrender.com/api
```

## ⚠️ Important Notes

### Free Tier Limitations
- Service sleeps after 15 min inactivity
- First request after sleep: 30-60 sec delay
- PostgreSQL expires after 90 days

### Folder Structure Works!
✅ Your structure with `/backend` and `/python` is perfect for Render
✅ Build command handles both Node.js and Python
✅ Start command runs from backend folder

### Files Already in Repo
✅ `render.yaml` - Render configuration
✅ `build.sh` - Build script
✅ `DEPLOYMENT.md` - Full deployment guide

## 🎉 Done!
Your API URL: `https://poseify-api.onrender.com`

Update Postman collection to use this URL instead of `localhost:5000`!
