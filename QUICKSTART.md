# 🚀 Quick Start Guide - takkunu pdf

Get up and running in 5 minutes.

---

## ⚡ Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))
- **Code Editor** (VS Code recommended)

---

## 📥 Step 1: Clone & Install

```bash
# Clone the repository
cd "i:/saas applications"
cd takkunu-pdf

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

---

## 🖥️ Step 2: Run Locally

### Terminal 1: Start Backend

```bash
cd server
npm run dev
```

**Expected output:**
```
🚀 takkunu pdf API Server
📡 Server running on port 3000
🏥 Health check: http://localhost:3000/health
```

**Test it:**
```bash
curl http://localhost:3000/health
```

### Terminal 2: Start Frontend

```bash
cd client
npm run dev
```

**Expected output:**
```
VITE v7.3.1  ready in 652 ms
➜  Local:   http://localhost:5173/
```

**Open browser:** http://localhost:5173

---

## ✅ Step 3: Verify It Works

### Frontend Check

1. ✅ Homepage loads
2. ✅ See 8 tool cards (4 Convert + 4 Organize)
3. ✅ Click on "PDF to Word"
4. ✅ See file upload area

### Backend Check

```bash
# Health check
curl http://localhost:3000/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "...",
  "service": "takkunu-pdf-api"
}
```

---

## 🧪 Step 4: Test a Conversion (Optional)

**Note:** Backend tools (LibreOffice, etc.) only work in Docker or if installed locally.  
For full local testing, see **Local Development Setup** below.

---

## 🐳 Local Development with Docker (Full Testing)

### Build & Run Backend in Docker

```bash
cd server

# Build Docker image
docker build -t takkunu-pdf-server .

# Run container
docker run -p 3000:3000 takkunu-pdf-server
```

Now all conversion tools will work!

---

## 📝 Environment Variables

### Frontend (.env in client/)

```bash
# Create .env file
cd client
cp .env.example .env

# Edit .env
VITE_API_URL=http://localhost:3000
```

### Backend (.env in server/)

```bash
# Create .env file
cd server
cp .env.example .env

# Edit .env (optional, has defaults)
PORT=3000
NODE_ENV=development
```

---

## 🛠️ Install Tools Locally (Windows - Optional)

If you want to test conversions without Docker:

### Using Chocolatey

```powershell
# Install Chocolatey first: https://chocolatey.org/install

choco install libreoffice-fresh -y
choco install poppler -y
choco install qpdf -y
choco install imagemagick -y
```

### Using Scoop

```powershell
# Install Scoop first: https://scoop.sh/

scoop install libreoffice
scoop install poppler
scoop install qpdf
scoop install imagemagick
```

### Verify Installation

```bash
libreoffice --version
pdfunite --version
qpdf --version
magick --version
```

**Important:** Add tools to your system PATH if not automatically added.

---

## 📂 Project Structure Reminder

```
takkunu-pdf/
├── client/          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
└── server/          # Backend (Node.js + Express)
    ├── src/
    │   ├── routes/
    │   ├── services/
    │   ├── utils/
    │   └── index.js
    ├── temp/
    ├── Dockerfile
    └── package.json
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in server/.env
PORT=3001
```

### Frontend Can't Reach Backend

**Problem:** "Network Error" in browser console

**Solutions:**
1. Check backend is running: `curl http://localhost:3000/health`
2. Verify `VITE_API_URL` in `client/.env`
3. Check CORS settings in `server/src/index.js`

### Tools Not Found (libreoffice: command not found)

**Problem:** Conversion fails with "command not found"

**Solutions:**
1. **Recommended:** Use Docker (tools pre-installed)
2. **Alternative:** Install tools locally (see above)
3. **Quick Fix:** Skip tool testing, deploy to Render (tools in Docker)

---

## 🎯 Next Steps

After getting it running locally:

1. 📖 Read **ARCHITECTURE.md** to understand the system
2. 🧪 Read **TESTING.md** to validate features
3. 🚀 Read **DEPLOYMENT.md** to deploy to production
4. 💻 Read **COMMANDS.md** to understand the tools

---

## 🆘 Getting Help

**If frontend works but backend fails:**
- Backend tools only work in Docker or when installed locally
- For MVP testing, deploy to Render (has all tools)

**If you see errors:**
1. Check terminal output for error messages
2. Verify Node.js version: `node --version` (need 18+)
3. Clear node_modules: `rm -rf node_modules && npm install`

**Still stuck?**
- Check GitHub Issues
- Review error logs in terminal
- Start with just frontend (mock API responses)

---

## ✨ Development Workflow

```bash
# Daily workflow
1. git pull                # Get latest changes
2. cd client && npm run dev    # Start frontend
3. cd server && npm run dev    # Start backend
4. Make changes
5. Test in browser
6. git add . && git commit -m "..."
7. git push
```

---

## 🎓 Tips for Students

1. **Start with frontend only** - Backend tools can wait
2. **Use Docker** for easiest setup (all tools included)
3. **Deploy early** - Render has everything set up
4. **Read docs** - Everything is documented
5. **Ask questions** - No question is too basic

---

**You're ready!** 🎉

Open http://localhost:5173 and start building!

For production deployment, continue to **DEPLOYMENT.md** →
