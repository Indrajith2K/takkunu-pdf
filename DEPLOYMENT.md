# Deployment Guide - takkunu pdf

This guide covers deploying **takkunu pdf** to production using Vercel (frontend) and Render (backend).

---

## 📋 Prerequisites

1. **GitHub Account** - To host your code
2. **Vercel Account** - For frontend hosting (free tier)
3. **Render Account** - For backend hosting (free tier)

---

## 🚀 Step 1: Prepare Your Code

### Push to GitHub

```bash
cd takkunu-pdf
git init
git add .
git commit -m "Initial commit - takkunu pdf"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

---

## 🎨 Step 2: Deploy Frontend to Vercel

### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com` (you'll get this after deploying backend)
6. Click **"Deploy"**

### Option B: Vercel CLI

```bash
cd client
npm install -g vercel
vercel login
vercel --prod
```

**Note:** You'll need to update `VITE_API_URL` after backend deployment.

---

## 🔧 Step 3: Deploy Backend to Render

### Using Render Dashboard (Recommended)

1. Go to [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `takkunu-pdf-api`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Docker`
   - **Instance Type**: `Free`
5. Add Environment Variables:
   ```
   PORT=3000
   NODE_ENV=production
   ```
6. Click **"Create Web Service"**

### Deployment Details

- Render will automatically:
  1. Detect the `Dockerfile`
  2. Build the Docker image with all tools (LibreOffice, Poppler, qpdf, ImageMagick)
  3. Deploy the container
  4. Provide you with a URL like: `https://takkunu-pdf-api.onrender.com`

### Important Notes for Free Tier

- ⏰ **Cold Starts**: Free tier instances spin down after 15 minutes of inactivity. First request after inactivity may take 30-60 seconds.
- 💾 **No Persistent Storage**: Files in temp directory are ephemeral (this is actually good for our auto-cleanup design).
- 🔄 **Auto-cleanup works perfectly** since files are deleted after 5 minutes anyway.

---

## 🔗 Step 4: Connect Frontend to Backend

1. Copy your Render backend URL: `https://your-app-name.onrender.com`
2. Go back to Vercel Dashboard
3. Navigate to your project → **Settings** → **Environment Variables**
4. Update `VITE_API_URL` to your Render backend URL
5. Redeploy the frontend (Vercel will auto-redeploy on env change)

---

## ✅ Step 5: Test Your Deployment

### Test Backend Health

```bash
curl https://your-backend-url.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2026-02-05T...",
  "service": "takkunu-pdf-api"
}
```

### Test Frontend

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Try uploading and converting a small PDF
3. Check browser console for any API errors

---

## 📊 Monitoring & Maintenance

### Vercel

- **Logs**: Dashboard → Your Project → Deployments → View Logs
- **Analytics**: Dashboard → Your Project → Analytics
- **Auto-deploy**: Enabled by default on `git push`

### Render

- **Logs**: Dashboard → Your Service → Logs tab
- **Metrics**: Dashboard → Your Service → Metrics tab
- **Manual Deploy**: Dashboard → Your Service → Manual Deploy

### Health Checks

Render automatically performs health checks using the `HEALTHCHECK` in Dockerfile.

---

## 🔧 Troubleshooting

### Cold Start Issues (Render Free Tier)

**Problem**: First request takes too long  
**Solution**: This is expected. Consider upgrading to paid tier for production, or:
- Keep service warm with a cron job pinging `/health` every 10 minutes
- Use services like [UptimeRobot](https://uptimerobot.com/) (free)

### CORS Errors

**Problem**: Frontend can't connect to backend  
**Solution**: 
- Verify `VITE_API_URL` in Vercel env variables
- Check backend CORS settings in `src/index.js`

### Conversion Failures

**Problem**: Conversions failing in production  
**Solution**:
- Check Render logs for tool errors
- Verify all tools installed correctly: `docker run your-image libreoffice --version`
- File size might exceed limits

### Build Failures

**Problem**: Docker build fails on Render  
**Solution**:
- Check `Dockerfile` for syntax errors
- Verify package.json scripts
- Check Render build logs for specific errors

---

## 🎯 Production Checklist

Before going live:

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] Environment variables configured
- [ ] CORS configured correctly
- [ ] Health check endpoint working
- [ ] Test all conversion tools
- [ ] Test all organize tools
- [ ] Test file size limits (10 MB)
- [ ] Test error messages
- [ ] Mobile responsiveness verified
- [ ] Page load performance checked

---

## 💰 Cost Optimization

### Current Setup (FREE)

- **Vercel**: 100 GB bandwidth/month
- **Render**: 750 hours/month (enough for 1 free instance)
- **Total**: $0/month

### When to Upgrade

Upgrade when you hit:
- **Vercel**: >100k page views/month
- **Render**: Need 24/7 uptime without cold starts

### Upgrade Path

1. **Render**: $7/month for always-on instance
2. **Vercel**: $20/month for Pro tier
3. **Total**: ~$27/month for production-grade service

---

## 🔄 Continuous Deployment

Both Vercel and Render auto-deploy on `git push` to main branch.

### Workflow

```bash
# Make changes locally
git add .
git commit -m "Add feature X"
git push origin main

# Automatic deployments:
# 1. Vercel rebuilds and deploys frontend
# 2. Render rebuilds Docker image and deploys backend
```

---

## 📝 Custom Domain (Optional)

### Vercel (Frontend)

1. Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Render (Backend)

1. Dashboard → Your Service → Settings → Custom Domain
2. Add custom domain (subdomain recommended, e.g., `api.yourdomain.com`)
3. Update DNS records

---

## 🎓 Student Tips

1. **Keep it simple**: Don't over-engineer for MVP
2. **Monitor usage**: Check Vercel/Render dashboards weekly
3. **Free tier is enough** for testing with classmates
4. **Document everything**: Keep this guide updated as you learn
5. **Iterate slowly**: Add features after MVP is stable

---

Built with care for long-term stability 🚀
