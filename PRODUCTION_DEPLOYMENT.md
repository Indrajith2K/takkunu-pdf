# 🚀 Takkunu PDF - Production Deployment Guide

## Architecture Overview

### Current Deployment Model
- **Frontend**: Vercel (Static Site - Vite + React)
- **Backend**: Render.com (Node.js + Express API)
- **Database**: MongoDB Atlas (Cloud Database)

### Why This Architecture?
- **Separation of Concerns**: Frontend and backend are independently scalable
- **Cost Optimization**: Vercel free tier for static sites, Render for backend
- **Performance**: CDN-backed frontend, dedicated backend compute
- **Reliability**: Independent deployment pipelines reduce failure domains

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables

#### Frontend (Vercel)
Set these in Vercel Dashboard → Project Settings → Environment Variables:

```bash
VITE_API_BASE_URL=https://takkunu-pdf-server.onrender.com
VITE_APP_NAME=Takkunu PDF
VITE_APP_VERSION=1.0.0
VITE_OPENROUTER_API_KEY=<your-openrouter-api-key>
```

**Important**: All `VITE_*` variables are PUBLIC and embedded in the client bundle.

#### Backend (Render.com)
Set these in Render Dashboard → Service → Environment:

```bash
NODE_ENV=production
PORT=3000
MONGODB_URI=<your-mongodb-atlas-connection-string>
CORS_ORIGIN=https://takkunu-pdf.vercel.app
```

### 2. Database Setup (MongoDB Atlas)

1. Create a MongoDB Atlas cluster (Free tier available)
2. Whitelist Render's IP addresses or use `0.0.0.0/0` (all IPs)
3. Create a database user with read/write permissions
4. Get connection string: `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>`
5. Add to Render environment variables as `MONGODB_URI`

**Connection Pooling**: The backend uses Mongoose with serverless-safe settings:
```javascript
mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
});
```

---

## 🔧 Deployment Steps

### Frontend Deployment (Vercel)

#### Option 1: GitHub Integration (Recommended)
1. Push code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: Automatically detected from `vercel.json`
   - **Output Directory**: Automatically detected from `vercel.json`
6. Add environment variables (see above)
7. Deploy

#### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd /path/to/takkunu-pdf
vercel --prod
```

### Backend Deployment (Render.com)

1. Go to [Render Dashboard](https://render.com/dashboard)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: takkunu-pdf-server
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for production)
5. Add environment variables (see above)
6. Create Web Service

---

## ✅ Post-Deployment Verification

### Frontend Checks
1. **Root URL**: Visit `https://your-app.vercel.app`
   - ✅ Should load the homepage without 404
   - ✅ Check browser console for errors
   
2. **Client-Side Routing**: Navigate to different pages
   - ✅ `/` → Homepage
   - ✅ `/#features` → Features page
   - ✅ `/#study` → Study Mode
   - ✅ Refresh on any page → Should not 404

3. **Asset Loading**:
   - ✅ Check Network tab → All assets load from Vercel CDN
   - ✅ No CORS errors
   - ✅ Fonts and icons load correctly

### Backend Checks
1. **Health Check**: `curl https://takkunu-pdf-server.onrender.com/healthz`
   - ✅ Should return `ok` with 200 status

2. **API Status**: `curl https://takkunu-pdf-server.onrender.com/`
   - ✅ Should return JSON with service info

3. **Database Connection**:
   - ✅ Check Render logs for "✅ MongoDB Connected"
   - ✅ No connection timeout errors

### Integration Checks
1. **Frontend → Backend**: Test a PDF operation (e.g., Merge PDF)
   - ✅ Upload files
   - ✅ Check Network tab → Request goes to Render backend
   - ✅ Download processed PDF
   - ✅ No CORS errors

2. **Study Mode**: Upload a document
   - ✅ AI features work (if OpenRouter API key is set)
   - ✅ Document parsing works
   - ✅ localStorage persists data

---

## 🐛 Troubleshooting

### Issue: Vercel 404 at Root
**Cause**: `vercel.json` misconfiguration or build failure

**Fix**:
1. Check Vercel build logs
2. Verify `vercel.json` matches the provided configuration
3. Ensure `client/dist` directory is created during build
4. Check `package.json` build script: `cd client && npm install && npm run build`

### Issue: Backend API Not Reachable
**Cause**: CORS, wrong URL, or Render service down

**Fix**:
1. Check `VITE_API_BASE_URL` in Vercel environment variables
2. Verify Render service is running (check dashboard)
3. Check Render logs for errors
4. Verify CORS settings in `server/app.js`

### Issue: MongoDB Connection Failed
**Cause**: Wrong connection string, IP not whitelisted, or network issue

**Fix**:
1. Verify `MONGODB_URI` in Render environment
2. Check MongoDB Atlas → Network Access → Whitelist `0.0.0.0/0`
3. Test connection string locally first
4. Check Render logs for specific error message

### Issue: Large File Upload Fails
**Cause**: Timeout or size limit

**Fix**:
1. Check `axios` timeout in `pdf.api.js` (currently 60s)
2. Increase timeout if needed
3. Verify Render instance has enough memory
4. Consider upgrading Render plan for larger files

---

## 📊 Monitoring & Logging

### Vercel
- **Analytics**: Vercel Dashboard → Analytics
- **Logs**: Vercel Dashboard → Deployments → View Function Logs
- **Performance**: Check Core Web Vitals

### Render
- **Logs**: Render Dashboard → Service → Logs (live tail)
- **Metrics**: CPU, Memory, Network usage
- **Alerts**: Set up email alerts for service downtime

### MongoDB Atlas
- **Metrics**: Atlas Dashboard → Metrics
- **Slow Queries**: Performance Advisor
- **Alerts**: Configure alerts for connection spikes

---

## 🔐 Security Best Practices

### Frontend
- ✅ All `VITE_*` variables are public - never store secrets
- ✅ OpenRouter API key is for browser-only AI features (acceptable risk)
- ✅ Security headers configured in `vercel.json`
- ✅ No sensitive data in localStorage

### Backend
- ✅ Helmet.js for security headers
- ✅ CORS restricted to frontend domain (update `CORS_ORIGIN`)
- ✅ MongoDB credentials in environment variables only
- ✅ File upload size limits configured
- ✅ Temporary files cleaned up after processing

### Database
- ✅ Use MongoDB Atlas with authentication
- ✅ Restrict network access to known IPs (or 0.0.0.0/0 for serverless)
- ✅ Use strong passwords
- ✅ Enable encryption at rest

---

## 🚀 Performance Optimization

### Frontend
- ✅ Code splitting configured in `vite.config.js`
- ✅ Asset caching headers in `vercel.json`
- ✅ Minification and tree-shaking enabled
- ✅ Console logs removed in production build

### Backend
- ✅ Mongoose connection pooling
- ✅ File cleanup after processing
- ✅ Graceful shutdown handling
- ✅ Health check endpoint for monitoring

---

## 📝 Deployment Checklist

Before each deployment:

- [ ] All merge conflicts resolved
- [ ] Environment variables set in Vercel
- [ ] Environment variables set in Render
- [ ] MongoDB Atlas connection string updated
- [ ] Code pushed to `main` branch
- [ ] Build passes locally (`npm run build` in `client/`)
- [ ] Backend starts locally (`npm start` in `server/`)
- [ ] No console errors in browser
- [ ] API endpoints tested
- [ ] Study Mode tested (if using AI features)

After deployment:

- [ ] Vercel deployment successful
- [ ] Render service running
- [ ] Root URL loads without 404
- [ ] API health check returns 200
- [ ] MongoDB connection successful
- [ ] Test at least one PDF operation
- [ ] Check Vercel Analytics
- [ ] Check Render logs for errors

---

## 🆘 Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/
- **Vite Docs**: https://vitejs.dev/
- **React Docs**: https://react.dev/

---

## 📞 Emergency Rollback

If deployment fails catastrophically:

### Vercel
1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

### Render
1. Go to Render Dashboard → Service
2. Click "Manual Deploy" → Select previous commit
3. Or: Revert commit in GitHub and push

---

**Last Updated**: 2026-02-08
**Version**: 1.0.0
