# Deployment Guide for POSEIFY on Render

## 📋 Prerequisites

1. **GitHub Repository**: Your code is already on GitHub ✅
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **MongoDB Atlas**: Keep your existing MongoDB Atlas connection
4. **Cloudinary Account**: Keep your existing Cloudinary setup
5. **Brevo Account**: Keep your existing Brevo email service

---

## 🚀 Deployment Steps

### Step 1: Prepare PostgreSQL on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `poseify-postgres`
   - **Database**: `poseify`
   - **User**: `poseify_user`
   - **Region**: Choose closest to you
   - **Plan**: Free
4. Click **"Create Database"**
5. Wait for provisioning (2-3 minutes)
6. **Copy the Internal Database URL** (starts with `postgresql://`)

---

### Step 2: Deploy Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: `kunamvamsikrishna/poseify`
3. Configure:

   **Basic Settings:**
   - **Name**: `poseify-api`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: Leave empty (root of repo)
   - **Runtime**: `Node`
   - **Build Command**: 
     ```bash
     cd backend && npm install && cd ../python && pip install -r requirements.txt
     ```
   - **Start Command**: 
     ```bash
     cd backend && node server.js
     ```

4. **Plan**: Free

---

### Step 3: Configure Environment Variables

Click **"Environment"** tab and add these variables:

```env
# Node Environment
NODE_ENV=production
PORT=10000

# PostgreSQL (from Render Database)
DB_HOST=<Your Render Postgres Host>
DB_PORT=5432
DB_USER=poseify_user
DB_PASSWORD=<Your Render Postgres Password>
DB_NAME=poseify
DATABASE_URL=<Your Render Internal Database URL>

# MongoDB Atlas (use your existing connection)
MONGO_URI=<Your MongoDB Atlas Connection String>

# JWT Secret (generate a strong random key)
JWT_SECRET=<Generate strong random secret key>

# Cloudinary (use your existing credentials)
CLOUDINARY_CLOUD_NAME=<Your Cloudinary Cloud Name>
CLOUDINARY_API_KEY=<Your Cloudinary API Key>
CLOUDINARY_API_SECRET=<Your Cloudinary API Secret>

# Brevo Email (use your existing credentials)
BREVO_API_KEY=<Your Brevo API Key>
BREVO_FROM_EMAIL=<Your verified sender email>
BREVO_FROM_NAME=POSEIFY Backup System
ADMIN_EMAIL=<Your admin email>

# Python Path
PYTHON_PATH=/opt/render/project/src/python/venv/bin/python
```

**To get Render Postgres credentials:**
- Go to your `poseify-postgres` database
- Click "Info" tab
- Copy: **Internal Database URL**, **Host**, **Password**

---

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will:
   - Clone your GitHub repo
   - Install Node.js dependencies
   - Install Python dependencies (MediaPipe)
   - Start the server
3. Watch the **Logs** for any errors
4. Deployment takes ~5-10 minutes

---

## 🔧 Post-Deployment Configuration

### 1. Initialize Database Tables

After first deployment, run migrations:

1. Go to your web service → **Shell** tab
2. Run:
```bash
cd backend
node -e "require('./models/sql/index.js').sequelize.sync({force: false})"
```

### 2. Test Your API

Your API will be available at: `https://poseify-api.onrender.com`

Test endpoints:
```bash
# Health check
https://poseify-api.onrender.com/health

# API root
https://poseify-api.onrender.com/api

# Register user (POST)
https://poseify-api.onrender.com/api/users/register
```

---

## 📝 Important Notes

### Free Tier Limitations

1. **Web Service**:
   - Spins down after 15 minutes of inactivity
   - First request after sleep takes 30-60 seconds
   - 750 hours/month free

2. **PostgreSQL**:
   - 1GB storage
   - Expires after 90 days (backup your data!)

3. **Solution**: Upgrade to paid plan ($7/month) for always-on service

### Python + Node.js Setup

Render supports both runtimes:
- Node.js is primary (package.json detected)
- Python installed via build command
- MediaPipe works on Render's Ubuntu environment

### File Uploads

Since Render uses ephemeral storage:
- ✅ Images stored in Cloudinary (persistent)
- ✅ Backups can be sent via email
- ⚠️ Local `uploads/` and `backups/` folders are temporary

### Environment Variables Security

- ✅ Never commit `.env` file
- ✅ Use Render's environment variable manager
- ✅ Rotate secrets regularly

---

## 🔄 Continuous Deployment

Enable auto-deploy from GitHub:

1. Go to web service → **Settings**
2. Under **"Build & Deploy"**
3. Enable **"Auto-Deploy"**: Yes
4. Now every `git push` triggers automatic deployment!

---

## 🐛 Troubleshooting

### Build Fails

**Python dependencies fail:**
```bash
# Add to build command:
apt-get update && apt-get install -y python3-dev build-essential
```

**MediaPipe fails:**
```bash
# MediaPipe requires specific system libraries
pip install mediapipe --no-cache-dir
```

### Service Crashes

**Check logs:**
1. Go to web service → **Logs** tab
2. Look for error messages
3. Common issues:
   - Missing environment variables
   - Database connection timeout
   - Python path incorrect

**Database connection fails:**
- Use **Internal Database URL** (not external)
- Ensure DATABASE_URL starts with `postgresql://`

### Slow Cold Starts

**Free tier issue:**
- First request after sleep takes 30-60 seconds
- Upgrade to paid plan for always-on service

**Workaround:**
- Use cron job to ping your API every 14 minutes:
  ```bash
  # Use cron-job.org or similar
  GET https://poseify-api.onrender.com/health
  ```

---

## 📊 Monitoring

### View Logs
```
Dashboard → Web Service → Logs
```

### Metrics
```
Dashboard → Web Service → Metrics
- CPU usage
- Memory usage
- Request count
- Response time
```

### Database
```
Dashboard → PostgreSQL → Metrics
- Connections
- Storage usage
```

---

## 🔐 Production Checklist

- [ ] Change JWT_SECRET to strong random value
- [ ] Update CORS allowed origins in `backend/app.js`
- [ ] Enable SSL (Render provides free SSL)
- [ ] Set up custom domain (optional)
- [ ] Configure backup retention policy
- [ ] Set up monitoring/alerts
- [ ] Test all API endpoints
- [ ] Test email notifications
- [ ] Test pose detection with MediaPipe
- [ ] Document production URL in README

---

## 🌐 Custom Domain (Optional)

1. Go to web service → **Settings** → **Custom Domain**
2. Add your domain: `api.poseify.com`
3. Update DNS records (Render provides instructions)
4. SSL certificate auto-generated

---

## 💰 Cost Estimate

**Free Tier:**
- Web Service: $0 (with limitations)
- PostgreSQL: $0 (90 days, 1GB)
- Total: $0/month

**Paid Plan:**
- Web Service: $7/month (always-on)
- PostgreSQL: $7/month (persistent)
- Total: $14/month

---

## 🆘 Support

- [Render Documentation](https://render.com/docs)
- [Render Community](https://community.render.com)
- [GitHub Issues](https://github.com/kunamvamsikrishna/poseify/issues)

---

## 🎉 Success!

Once deployed, your API will be live at:
```
https://poseify-api.onrender.com
```

Update your frontend/Postman to use this URL instead of `localhost:5000`!
