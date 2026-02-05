# Architecture Overview - takkunu pdf

This document explains how everything connects and why design decisions were made.

---

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    HTTP Request (POST FormData)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL (Frontend - React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   HomePage   │→ │ ConvertPage  │→ │ OrganizePage │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                              ↓                                   │
│                      API Service Layer                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    HTTP Request (Multipart Upload)
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                 RENDER (Backend - Node.js + Docker)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Express API  │→ │   Services   │→ │  CLI Tools   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                              ↓                                   │
│              Temporary File System (Auto-Cleanup)                │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    HTTP Response (File Stream)
                              ↓
                        Browser Download
```

---

## 📂 Folder Structure

### **Root Level**

```
takkunu-pdf/
├── client/              # React frontend (Vite)
├── server/              # Node.js backend (Express)
├── README.md            # Project overview
├── DEPLOYMENT.md        # Deployment guide
├── COMMANDS.md          # Tool command reference
├── ARCHITECTURE.md      # This file
└── .gitignore          # Git ignore rules
```

### **Frontend (client/)**

```
client/
├── src/
│   ├── components/
│   │   ├── common/             # Shared components
│   │   │   ├── FileUploader.jsx
│   │   │   ├── FileUploader.css
│   │   │   ├── ProgressIndicator.jsx
│   │   │   └── ProgressIndicator.css
│   │   ├── convert/            # Convert-specific (future)
│   │   └── organize/           # Organize-specific
│   │       ├── PageSelector.jsx
│   │       └── PageSelector.css
│   ├── pages/
│   │   ├── HomePage.jsx        # Landing page with tools grid
│   │   ├── HomePage.css
│   │   ├── ConvertPage.jsx     # Convert operations
│   │   ├── ConvertPage.css
│   │   ├── OrganizePage.jsx    # Organize operations
│   ├── services/
│   │   └── apiService.js       # Backend API communication
│   ├── utils/                  # Utilities (future)
│   ├── App.jsx                 # Main app with routing
│   ├── index.css               # Design system & global styles
│   └── main.jsx                # React entry point
├── public/                     # Static assets
├── package.json
├── vite.config.js
├── vercel.json                 # Vercel deployment config
└── .env.example                # Environment variables template
```

### **Backend (server/)**

```
server/
├── src/
│   ├── routes/
│   │   ├── convertRoutes.js    # POST /api/convert/*
│   │   └── organizeRoutes.js   # POST /api/organize/*
│   ├── services/
│   │   ├── convertService.js   # Conversion logic
│   │   └── organizeService.js  # Organization logic
│   ├── utils/
│   │   └── fileCleanup.js      # Auto-cleanup utility
│   └── index.js                # Express server entry
├── temp/                       # Temporary file storage
│   └── .gitkeep
├── package.json
├── Dockerfile                  # Docker image definition
└── .env.example                # Environment variables template
```

---

## 🔄 Request Flow

### Example: PDF to Word Conversion

1. **User Action**
   - User selects PDF file via FileUploader component
   - Clicks "Convert File" button

2. **Frontend Processing**
   ```javascript
   // ConvertPage.jsx
   const handleConvert = async () => {
     const result = await convertFile('pdf-to-word', selectedFile);
     // Download file...
   }
   ```

3. **API Request**
   ```javascript
   // apiService.js
   const formData = new FormData();
   formData.append('file', file);
   
   fetch('https://api.render.com/api/convert/pdf-to-word', {
     method: 'POST',
     body: formData
   })
   ```

4. **Backend Receives Request**
   ```javascript
   // convertRoutes.js
   router.post('/pdf-to-word', upload.single('file'), async (req, res) => {
     const result = await pdfToWord(req.file.path);
     res.sendFile(result.outputPath);
   });
   ```

5. **Service Executes Command**
   ```javascript
   // convertService.js
   export const pdfToWord = async (inputPath) => {
     const command = `libreoffice --headless --convert-to docx "${inputPath}"`;
     await execAsync(command);
     return { outputPath, filename };
   }
   ```

6. **File Cleanup** (background)
   ```javascript
   // Runs every 5 minutes
   setInterval(() => {
     cleanupOldFiles(); // Deletes files older than 5 minutes
   }, 5 * 60 * 1000);
   ```

7. **Response & Download**
   - Backend streams file to frontend
   - Frontend triggers browser download
   - User receives converted file

---

## 🎨 Design Patterns

### 1. **Service Layer Pattern**

**Why**: Separates business logic from HTTP handling

```javascript
// ❌ BAD: Logic in route
router.post('/convert', (req, res) => {
  exec('libreoffice ...'); // Direct execution
});

// ✅ GOOD: Logic in service
router.post('/convert', async (req, res) => {
  const result = await convertService.pdfToWord(req.file.path);
  res.sendFile(result.outputPath);
});
```

### 2. **Stateless Architecture**

**Why**: Enables horizontal scaling, no session management

- No database for MVP
- No user sessions
- Each request is independent
- Temporary files auto-deleted

### 3. **File-based Processing**

**Why**: Simple, reliable, works with CLI tools

```javascript
// Upload → Temp File → Process → Stream Response → Auto-delete
multer saves to disk
  → Service processes file
    → Response streams file
      → Cleanup deletes after 5min
```

### 4. **Queue-based Design** (for future)

Current: One request at a time  
Future: Job queue with Bull/BullMQ

---

## 🛡️ Error Handling

### Frontend

```javascript
try {
  const result = await convertFile(tool, file);
  setSuccess(true);
} catch (err) {
  setError(err.message || 'Conversion failed. Please try again.');
}
```

**User-Friendly Messages**:
- ✅ "Conversion failed. Please try again."
- ✅ "Server busy. Please try again in a moment."
- ❌ NOT: "Error: ENOENT: no such file or directory"

### Backend

```javascript
// Error middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal server error'
  });
});
```

**Never crash the server** - always catch and return graceful errors.

---

## 💾 Data Flow

### File Upload

```
Browser File Object
  → FormData
    → HTTP POST
      → Multer Middleware
        → Disk Storage (temp/)
          → Service Processing
            → Output File
              → HTTP Response Stream
                → Browser Download
                  → Auto-cleanup (5 min)
```

### No Persistence

- **No database** - not needed for MVP
- **No user data** - no login, no tracking
- **Temporary files only** - auto-deleted
- **Stateless API** - no session storage

---

## 🔐 Security Considerations

### Current Implementation

1. **File Size Limits**
   ```javascript
   limits: {
     fileSize: 10 * 1024 * 1024 // 10 MB
   }
   ```

2. **File Type Validation**
   ```javascript
   fileFilter: (req, file, cb) => {
     const allowedMimes = ['application/pdf', ...];
     if (allowedMimes.includes(file.mimetype)) {
       cb(null, true);
     } else {
       cb(new Error('Invalid file type'));
     }
   }
   ```

3. **Auto-cleanup**
   - Prevents disk filling
   - Removes user data automatically
   - Privacy-friendly

4. **CORS Configuration**
   ```javascript
   app.use(cors()); // Configure for production
   ```

### Future Enhancements

- Rate limiting (Express rate-limit)
- File scanning (ClamAV)
- Request validation (Joi)
- API authentication (for Pro tier)

---

## 🚀 Performance Optimizations

### Frontend

1. **Code Splitting** (Vite automatic)
2. **Lazy Loading** (future: React.lazy)
3. **Bundle Optimization** (Vite production build)
4. **CDN Delivery** (Vercel Edge Network)

### Backend

1. **Docker Layer Caching**
   ```dockerfile
   # Copy package.json first (cached)
   COPY package*.json ./
   RUN npm ci
   
   # Copy code later (changes more often)
   COPY . .
   ```

2. **Parallel Processing** (future: Worker threads)
3. **Stream-based Responses** (not loading full file in memory)
4. **Automatic Cleanup** (prevents disk overflow)

---

## 📊 Scaling Strategy

### MVP (Current)

- **Users**: 10-100 students
- **Load**: <1000 conversions/day
- **Cost**: $0/month (free tiers)

### Growth Phase (3-6 months)

- **Users**: 100-1000 students
- **Load**: 1000-10000 conversions/day
- **Upgrade**: Render $7/month (no cold starts)

### Scale Phase (6-12 months)

- **Users**: 1000-10000 users
- **Load**: 10000-100000 conversions/day
- **Infrastructure**:
  - Multiple Render instances (load balancer)
  - Redis for job queue
  - S3 for temporary storage
  - CloudFront CDN

### Enterprise Phase (1-2 years)

- **Users**: 10000+ users
- **Load**: 100000+ conversions/day
- **Infrastructure**:
  - Kubernetes cluster
  - Dedicated database
  - Object storage
  - CDN + Load balancing
  - Monitoring (Datadog/New Relic)

**Key Point**: Start simple, scale as needed. Don't over-engineer for scale you don't have yet.

---

## 🧠 Design Decisions

### Why No Database?

**Decision**: Don't use a database for MVP

**Reasoning**:
- No user accounts → no user data to store
- Conversions are stateless → no job history needed
- Files auto-deleted → no storage needed
- Simpler deployment → one less service
- Lower costs → no database hosting

**When to add**:
- User accounts implemented
- Job history needed
- Usage analytics required
- API access tracking

### Why Separate Frontend/Backend?

**Decision**: Monorepo with separate deployments

**Reasoning**:
- **Different scaling needs**: Frontend (CDN), Backend (CPU-heavy)
- **Technology isolation**: React vs. Node.js + system tools
- **Deployment flexibility**: Update frontend without backend rebuild
- **Free tier optimization**: Vercel for static, Render for compute

**Alternative considered**: Single Next.js app  
**Why rejected**: System tools (LibreOffice, qpdf) don't work in Vercel serverless

### Why Docker?

**Decision**: Use Docker for backend deployment

**Reasoning**:
- **System dependencies**: Need LibreOffice, Poppler, qpdf, ImageMagick
- **Consistent environment**: Dev = Production
- **Render support**: Free tier supports Docker
- **Portability**: Can move to any Docker-compatible host

### Why Client-side Routing (not React Router)?

**Decision**: Simple state-based navigation

**Reasoning**:
- **Simplicity**: Only 3 pages, no complex routing needed
- **Smaller bundle**: No router library needed
- **Future-ready**: Easy to migrate to React Router later if needed

**When to upgrade**: When routes become complex (>5 pages)

---

## 🎯 Non-Functional Requirements

### Performance

- **Page Load**: <2 seconds (achieved via Vite + Vercel CDN)
- **Conversion Time**: <30 seconds for 10MB file
- **API Response**: <100ms for health check

### Reliability

- **Uptime**: 99%+ (Vercel + Render free tier)
- **Error Rate**: <1% of requests
- **Graceful Degradation**: Never crash, always return error

### Usability

- **Mobile-First**: Responsive design from 320px+
- **Simple UX**: <3 clicks to convert
- **Clear Feedback**: Progress indicators, friendly errors

### Maintainability

- **Code Quality**: ESLint, consistent patterns
- **Documentation**: This file, COMMANDS.md, DEPLOYMENT.md
- **Modularity**: Clear separation of concerns

---

## 🔮 Future Architecture

### Phase 1: Enhanced MVP (Months 1-3)

- Add job queue (Bull + Redis)
- Implement rate limiting
- Add usage analytics (no PII)
- Improve error messages

### Phase 2: Pro Features (Months 4-6)

- User accounts (optional)
- OCR for scanned PDFs
- Batch processing
- API access
- Usage dashboard

### Phase 3: Scale (Months 7-12)

- Microservices architecture
- Dedicated conversion workers
- Object storage (S3/R2)
- Advanced monitoring
- Premium tier features

**Philosophy**: Evolve architecture based on real usage, not speculation.

---

## 📚 Technology Justifications

| Technology | Why Chosen | When to Replace |
|------------|-----------|-----------------|
| **React** | Industry standard, large ecosystem | Never (unless fundamental shift) |
| **Vite** | Fast builds, modern tooling | Only if better tool emerges |
| **Express** | Simple, mature, well-documented | When need more structure (NestJS) |
| **Multer** | De facto file upload for Express | Only if Express replaced |
| **Docker** | Required for system tools | Never (deployment standard) |
| **LibreOffice** | Best free PDF/Word converter | Only if better free option exists |
| **Poppler** | Industry standard PDF tools | Never (used by everyone) |
| **qpdf** | Most powerful free PDF manipulation | Never (no better alternative) |

---

## 🎓 Learning Path for Students

To understand this architecture:

1. **Week 1**: Understand Express basics, REST APIs
2. **Week 2**: Learn React component patterns
3. **Week 3**: Study file uploads (Multer)
4. **Week 4**: Understand Docker basics
5. **Week 5**: Learn deployment (Vercel + Render)
6. **Week 6**: Master CLI tools (COMMANDS.md)

---

## 📖 Further Reading

- [12-Factor App Methodology](https://12factor.net/)
- [REST API Best Practices](https://restfulapi.net/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [React Design Patterns](https://www.patterns.dev/posts/react-patterns/)

---

*This architecture is designed to be simple, stable, and student-friendly. Complexity should only be added when real user needs demand it.*
