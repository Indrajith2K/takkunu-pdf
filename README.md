# takkunu pdf

> A lightweight, fast, honest, student-first PDF utility web application

## 🎯 Vision

Build a calm, reliable digital utility that students can trust for years. No fake features, no watermarks, no forced login, no paid APIs.

**Utility > UI gimmicks | Stability > feature overload**

## ✅ Features (MVP)

### 📄 Convert
- PDF → Word (text-based PDFs only)
- Word → PDF
- JPG → PDF
- PDF → JPG

### 🗂 Organize
- Merge PDF
- Split PDF
- Extract pages
- Remove pages

## 🛠️ Technology Stack

- **Frontend**: React (Vite) + JavaScript → Vercel
- **Backend**: Node.js + Express → Render (Free tier)
- **Tools**: LibreOffice (headless), Poppler, ImageMagick, qpdf

## 📂 Project Structure

```
takkunu-pdf/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   └── public/
└── server/          # Node.js backend
    ├── src/
    │   ├── routes/
    │   ├── services/
    │   └── utils/
    └── Dockerfile
```

## 🚀 Quick Start

### Client (Frontend)
```bash
cd client
npm install
npm run dev
```

### Server (Backend)
```bash
cd server
npm install
npm run dev
```

## 🔧 Environment Variables

### Client (.env)
```
VITE_API_URL=http://localhost:3000
```

### Server (.env)
```
PORT=3000
MAX_FILE_SIZE=10485760
TEMP_FILE_LIFETIME=300000
```

## 📦 Deployment

- **Frontend**: Vercel (Auto-deploy from GitHub)
- **Backend**: Render (Docker, Free tier)

## 🎓 Student-First Principles

- ✅ Extremely simple interface
- ✅ No ads, no signup
- ✅ Clear tool categories
- ✅ Honest limitations (text PDFs work best)
- ✅ Friendly error messages

## ⚙️ System Constraints

- Max file size: **10 MB**
- One conversion job at a time (queue-based)
- Auto-delete files after **5 minutes**
- No login required
- No database (MVP)

## 🧠 Philosophy

Think long-term. Think like someone who wants to quietly win after 2 years, not loudly fail in 2 months.

---

Built with ❤️ for students everywhere
