# 📊 Complete Project Structure - takkunu pdf

Visual reference for the entire codebase organization.

---

## 🌲 Full Directory Tree

```
takkunu-pdf/
│
├── 📚 Documentation Files
│   ├── README.md                    # Project overview & introduction
│   ├── QUICKSTART.md                # 5-minute setup guide
│   ├── ARCHITECTURE.md              # System design & technical decisions
│   ├── DEPLOYMENT.md                # Vercel + Render deployment guide
│   ├── COMMANDS.md                  # CLI tools reference (all commands)
│   ├── TESTING.md                   # QA checklist & testing strategy
│   ├── PROJECT_SUMMARY.md           # Complete project overview
│   ├── STRUCTURE.md                 # This file - visual structure
│   └── .gitignore                   # Git ignore rules
│
├── 🎨 client/                       # FRONTEND - React Application
│   │
│   ├── 📦 Configuration
│   │   ├── package.json             # Dependencies & scripts
│   │   ├── package-lock.json        # Lock file
│   │   ├── vite.config.js           # Vite build configuration
│   │   ├── vercel.json              # Vercel deployment config
│   │   ├── eslint.config.js         # Code linting rules
│   │   ├── .env.example             # Environment variables template
│   │   └── index.html               # HTML entry point
│   │
│   ├── 📂 public/                   # Static assets
│   │   └── vite.svg                 # Default favicon
│   │
│   ├── 📂 src/                      # Source code
│   │   │
│   │   ├── 🧩 components/           # React Components
│   │   │   │
│   │   │   ├── common/              # Shared components
│   │   │   │   ├── FileUploader.jsx        # Drag-drop file upload
│   │   │   │   ├── FileUploader.css
│   │   │   │   ├── ProgressIndicator.jsx   # Loading & progress UI
│   │   │   │   └── ProgressIndicator.css
│   │   │   │
│   │   │   ├── convert/             # Convert-specific (future)
│   │   │   │
│   │   │   └── organize/            # Organize-specific
│   │   │       ├── PageSelector.jsx        # Page range input
│   │   │       └── PageSelector.css
│   │   │
│   │   ├── 📄 pages/                # Page components
│   │   │   ├── HomePage.jsx         # Landing page (tool grid)
│   │   │   ├── HomePage.css
│   │   │   ├── ConvertPage.jsx      # PDF/Doc/Image conversions
│   │   │   ├── ConvertPage.css
│   │   │   └── OrganizePage.jsx     # PDF organization tools
│   │   │
│   │   ├── 🔌 services/             # API communication
│   │   │   └── apiService.js        # Fetch calls to backend
│   │   │
│   │   ├── 🛠️ utils/                # Utilities (future)
│   │   │
│   │   ├── App.jsx                  # Main app component (routing)
│   │   ├── App.css                  # App-specific styles
│   │   ├── index.css                # Global styles & design system
│   │   └── main.jsx                 # React entry point
│   │
│   └── 📦 node_modules/             # Dependencies (gitignored)
│
└── ⚙️ server/                       # BACKEND - Node.js API
    │
    ├── 📦 Configuration
    │   ├── package.json             # Dependencies & scripts
    │   ├── package-lock.json        # Lock file
    │   ├── Dockerfile               # Docker image definition
    │   ├── .env.example             # Environment variables template
    │   └── .dockerignore            # Docker build ignore (future)
    │
    ├── 📂 src/                      # Source code
    │   │
    │   ├── 🛣️ routes/                # API endpoints
    │   │   ├── convertRoutes.js     # POST /api/convert/*
    │   │   │                        # - pdf-to-word
    │   │   │                        # - word-to-pdf
    │   │   │                        # - jpg-to-pdf
    │   │   │                        # - pdf-to-jpg
    │   │   │
    │   │   └── organizeRoutes.js    # POST /api/organize/*
    │   │                            # - merge-pdf
    │   │                            # - split-pdf
    │   │                            # - extract-pages
    │   │                            # - remove-pages
    │   │
    │   ├── 💼 services/              # Business logic
    │   │   ├── convertService.js    # Conversion implementations
    │   │   │                        # - Uses: LibreOffice, ImageMagick, Poppler
    │   │   │
    │   │   └── organizeService.js   # Organization implementations
    │   │                            # - Uses: qpdf, pdfunite, pdfseparate
    │   │
    │   ├── 🛠️ utils/                 # Utilities
    │   │   └── fileCleanup.js       # Auto-delete old files (5 min)
    │   │
    │   └── index.js                 # Express server entry point
    │                                # - Middleware setup
    │                                # - Route mounting
    │                                # - Error handling
    │
    ├── 📂 temp/                     # Temporary file storage
    │   └── .gitkeep                 # Keep directory in git
    │
    └── 📦 node_modules/             # Dependencies (gitignored)
```

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
│                                                                   │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐           │
│  │  HomePage   │──▶│ ConvertPage │──▶│ OrganizePage │          │
│  │  (Select)   │   │  (Upload)   │   │  (Process)   │          │
│  └─────────────┘   └─────────────┘   └─────────────┘           │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                 │
│                            │                                     │
│                            ▼                                     │
│                   ┌────────────────┐                             │
│                   │  apiService.js │                             │
│                   │ (HTTP Client)  │                             │
│                   └────────────────┘                             │
└───────────────────────────│─────────────────────────────────────┘
                            │
                   HTTP POST (FormData)
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS SERVER (index.js)                     │
│                                                                   │
│  ┌──────────────┐          ┌──────────────┐                     │
│  │   Middleware │          │    Routes    │                     │
│  │  - CORS      │──────▶   │              │                     │
│  │  - Multer    │          │              │                     │
│  │  - Logging   │          │              │                     │
│  └──────────────┘          └──────────────┘                     │
│                                   │                              │
│            ┌──────────────────────┴───────────────────┐         │
│            │                                           │         │
│            ▼                                           ▼         │
│  ┌──────────────────┐                     ┌──────────────────┐ │
│  │ convertRoutes.js │                     │organizeRoutes.js │ │
│  │                  │                     │                  │ │
│  │ /pdf-to-word     │                     │ /merge-pdf       │ │
│  │ /word-to-pdf     │                     │ /split-pdf       │ │
│  │ /jpg-to-pdf      │                     │ /extract-pages   │ │
│  │ /pdf-to-jpg      │                     │ /remove-pages    │ │
│  └──────────────────┘                     └──────────────────┘ │
│            │                                           │         │
│            ▼                                           ▼         │
│  ┌──────────────────┐                     ┌──────────────────┐ │
│  │convertService.js │                     │organizeService.js│ │
│  │                  │                     │                  │ │
│  │ Business Logic   │                     │ Business Logic   │ │
│  └──────────────────┘                     └──────────────────┘ │
│            │                                           │         │
│            └─────────────┬─────────────────────────────┘         │
│                          │                                       │
│                          ▼                                       │
│              ┌───────────────────────┐                           │
│              │   CLI Tools (exec)    │                           │
│              │                       │                           │
│              │ - libreoffice         │                           │
│              │ - pdfunite/separate   │                           │
│              │ - qpdf                │                           │
│              │ - magick convert      │                           │
│              └───────────────────────┘                           │
│                          │                                       │
│                          ▼                                       │
│              ┌───────────────────────┐                           │
│              │   temp/ directory     │                           │
│              │                       │                           │
│              │ input.pdf   ──▶ output.docx                       │
│              │                       │                           │
│              │ (auto-cleanup 5 min)  │                           │
│              └───────────────────────┘                           │
│                          │                                       │
└──────────────────────────│───────────────────────────────────────┘
                           │
                   File Stream Response
                           │
                           ▼
                   ┌───────────────┐
                   │ Browser       │
                   │ Download      │
                   └───────────────┘
```

---

## 🗂️ Component Hierarchy

```
<App>
│
├─ <HomePage>
│  │
│  ├─ Header
│  │
│  ├─ Convert Tools Grid
│  │  ├─ Card: PDF to Word
│  │  ├─ Card: Word to PDF
│  │  ├─ Card: JPG to PDF
│  │  └─ Card: PDF to JPG
│  │
│  ├─ Organize Tools Grid
│  │  ├─ Card: Merge PDF
│  │  ├─ Card: Split PDF
│  │  ├─ Card: Extract Pages
│  │  └─ Card: Remove Pages
│  │
│  └─ Footer
│
├─ <ConvertPage tool={toolId}>
│  │
│  ├─ Header (with back button)
│  │
│  ├─ <FileUploader />
│  │  ├─ Drag-drop zone
│  │  ├─ File input (hidden)
│  │  └─ Selected file display
│  │
│  ├─ <ProgressIndicator /> (when processing)
│  │  ├─ Spinner
│  │  ├─ Progress bar
│  │  └─ Status message
│  │
│  ├─ Alert: Success/Error
│  │
│  └─ Convert Button
│
└─ <OrganizePage tool={toolId}>
   │
   ├─ Header (with back button)
   │
   ├─ <FileUploader multiFile={...} />
   │
   ├─ <PageSelector /> (if needed)
   │
   ├─ <ProgressIndicator /> (when processing)
   │
   ├─ Alert: Success/Error
   │
   └─ Process Button
```

---

## 🔌 API Endpoint Map

```
Base URL: http://localhost:3000 (dev) or https://your-app.onrender.com (prod)

GET /
├─ Response: API info

GET /health
├─ Response: { status: "healthy", ... }

POST /api/convert/pdf-to-word
├─ Body: FormData { file: PDF }
├─ Response: DOCX file stream

POST /api/convert/word-to-pdf
├─ Body: FormData { file: DOCX/DOC }
├─ Response: PDF file stream

POST /api/convert/jpg-to-pdf
├─ Body: FormData { file: JPG }
├─ Response: PDF file stream

POST /api/convert/pdf-to-jpg
├─ Body: FormData { file: PDF }
├─ Response: JPG file stream (or ZIP)

POST /api/organize/merge-pdf
├─ Body: FormData { files: [PDF, PDF, ...] }
├─ Response: Merged PDF stream

POST /api/organize/split-pdf
├─ Body: FormData { files: PDF }
├─ Response: ZIP of separate PDFs

POST /api/organize/extract-pages
├─ Body: FormData { files: PDF, pages: "1-3,5" }
├─ Response: PDF with extracted pages

POST /api/organize/remove-pages
├─ Body: FormData { files: PDF, pages: "2,4" }
├─ Response: PDF with pages removed
```

---

## 🎨 CSS Architecture

```
index.css
│
├─ 🎨 Design Tokens (CSS Variables)
│  ├─ Colors (primary, secondary, backgrounds, text)
│  ├─ Spacing (xs → 2xl)
│  ├─ Typography (font-family, sizes)
│  ├─ Borders (radius variants)
│  ├─ Shadows (sm → xl)
│  └─ Transitions (fast, normal, slow)
│
├─ 🔧 Reset & Base Styles
│  ├─ Universal box-sizing
│  ├─ Body defaults
│  └─ Typography base
│
├─ 🧩 Reusable Components
│  ├─ .container
│  ├─ .card (.card-clickable)
│  ├─ .btn (.btn-primary, .btn-secondary, .btn-lg, .btn-sm)
│  ├─ .file-upload-area
│  ├─ .alert (.alert-info, .alert-success, .alert-error)
│  └─ .spinner
│
├─ 🛠️ Utility Classes
│  ├─ Spacing (mt-*, mb-*, gap-*)
│  ├─ Flexbox (flex, flex-column, items-center, justify-*)
│  ├─ Text (text-center, text-muted)
│  └─ Interactive (hover states)
│
└─ 📱 Responsive Breakpoints
   ├─ @media (max-width: 768px)  # Tablet
   └─ @media (max-width: 480px)  # Mobile
```

**Component-specific CSS:**
- `HomePage.css` - Tool grid, header, footer
- `ConvertPage.css` - Page layout
- `FileUploader.css` - Upload area, file list
- `ProgressIndicator.css` - Spinner, progress bar
- `PageSelector.css` - Input styling

---

## 🛠️ Technology Stack Map

```
Frontend Stack:
React 18
  └─ Vite 7
      ├─ ESBuild (transpiler)
      ├─ Rollup (bundler)
      └─ HMR (dev server)

Backend Stack:
Node.js 20
  └─ Express 4
      ├─ Multer (file uploads)
      ├─ CORS (cross-origin)
      └─ dotenv (env vars)

System Tools:
LibreOffice
  └─ PDF ↔ Word conversion

Poppler Utils
  ├─ pdfunite (merge)
  ├─ pdfseparate (split)
  └─ pdftoppm (PDF to image)

qpdf
  ├─ Page extraction
  ├─ Page removal
  └─ PDF manipulation

ImageMagick
  └─ Image ↔ PDF conversion

Deployment:
Vercel
  └─ Static site (frontend)

Render
  └─ Docker container (backend)
      └─ All tools pre-installed
```

---

## 📊 File Size Reference

| File/Directory | Purpose | Size Category |
|----------------|---------|---------------|
| `index.css` | Design system | ~8 KB |
| `App.jsx` | Main component | ~1 KB |
| `HomePage.jsx` | Landing page | ~3 KB |
| `ConvertPage.jsx` | Convert UI | ~5 KB |
| `OrganizePage.jsx` | Organize UI | ~5 KB |
| `FileUploader.jsx` | Upload component | ~3 KB |
| `apiService.js` | API client | ~3 KB |
| `convertService.js` | Backend logic | ~4 KB |
| `organizeService.js` | Backend logic | ~5 KB |
| `Dockerfile` | Container def | ~1 KB |
| **Total Source** | All custom code | **~40 KB** |
| `node_modules` | Dependencies | ~200 MB (dev) |
| `dist/` (build) | Production bundle | ~150 KB gzipped |

**Key Insight**: The entire application source is only ~40 KB. Dependencies are larger, but tree-shaking reduces production bundle to ~150 KB.

---

## 🗺️ Learning Path Through Codebase

For someone new to the project, read files in this order:

1. **README.md** - Understand the vision
2. **QUICKSTART.md** - Get it running
3. **client/src/App.jsx** - See routing logic
4. **client/src/pages/HomePage.jsx** - Understand UI
5. **client/src/components/common/FileUploader.jsx** - Learn uploads
6. **client/src/services/apiService.js** - See API calls
7. **server/src/index.js** - Backend entry point
8. **server/src/routes/convertRoutes.js** - API endpoints
9. **server/src/services/convertService.js** - Core logic
10. **ARCHITECTURE.md** - Deep dive into design

---

## 🎯 Critical Files (Must Understand)

### Frontend (3 files)
1. `App.jsx` - Routing & state
2. `apiService.js` - Backend communication
3. `index.css` - Design system

### Backend (3 files)
1. `index.js` - Server setup
2. `convertService.js` - Conversion logic
3. `organizeService.js` - Organization logic

### DevOps (2 files)
1. `Dockerfile` - Container definition
2. `vercel.json` - Frontend deployment

**Master these 8 files and you understand 80% of the codebase.**

---

## 📈 Codebase Stats

- **Total Files**: ~30 source files
- **Lines of Code**: ~2000 (excluding node_modules)
- **Languages**: JavaScript (98%), CSS (2%)
- **Components**: 6 React components
- **API Endpoints**: 8
- **CLI Tools**: 4 (LibreOffice, Poppler, qpdf, ImageMagick)
- **Documentation**: 8 markdown files

---

*This structure is designed for clarity, maintainability, and student learning.*
