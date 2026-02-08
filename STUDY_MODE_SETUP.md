# Study Mode - Complete Setup Guide

## ✅ FIXES IMPLEMENTED

The following critical issues have been resolved:

1. ✅ **401 OpenRouter Authentication Error** - API calls now go through secure backend proxy
2. ✅ **AI Not Receiving Document Content** - Document text and chunks properly stored and injected
3. ✅ **Ungrounded AI Responses** - Strict context injection ensures answers only from uploaded docs
4. ✅ **"chunks is not defined" Error** - Chunks now stored within document objects
5. ✅ **Study Cards Generation Failure** - Cards now generated via backend API
6. ✅ **Chat Ignoring PDFs** - All document chunks sent to AI with every request

---

## 🔧 SETUP INSTRUCTIONS

### 1. Backend Configuration

#### Add OpenRouter API Key

1. Get your FREE API key from: https://openrouter.ai/keys
2. Create `.env` file in `server` directory:

```bash
cd server
cp .env.example .env
```

3. Edit `.env` and add your key:

```env
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
```

#### Install Dependencies & Restart

```bash
cd server
npm install
npm start
```

The server should start on port 3000.

### 2. Frontend Configuration

No API key needed in frontend! All AI calls go through the backend proxy.

```bash
cd client
npm install
npm run dev
```

The client should start on port 5173.

---

## 🎯 HOW IT WORKS NOW

### Document Upload Flow

1. User uploads PDF/DOC/PPTX
2. File is parsed in browser (no server upload)
3. Text is extracted and chunked
4. **Document object stores:**
   - `id` - Unique identifier
   - `name` - Filename
   - `text` - Full extracted text
   - `chunks` - Array of text chunks (500-800 tokens each)
   - `pages` - Page/slide count
   - `type` - File extension

### Chat Flow

1. User asks a question
2. Frontend calls `POST /api/ai/chat` with:
   - `messages` - Conversation history
   - `documentContext` - All chunks from all documents
   - `taskType` - 'chat', 'programming', 'reasoning', etc.
   - `language` - Detected language (English, Tamil, Hindi, etc.)

3. Backend:
   - Selects appropriate model based on task/language
   - Builds system prompt with document context
   - Calls OpenRouter API securely
   - Streams response back to frontend

4. Frontend displays streaming response

### Study Cards Flow

1. When document is uploaded, frontend calls `POST /api/ai/cards`
2. Backend generates:
   - **Key Points** - Main ideas (3-5 points)
   - **Important Facts** - Definitions and concepts
   - **Practice MCQs** - Quiz questions with answers

3. Cards displayed in right panel

---

## 🤖 MODEL SELECTION (AUTOMATIC)

The backend automatically selects the best model:

| Condition | Model Used |
|-----------|------------|
| Tamil/Hindi/Malayalam/Telugu/Tanglish | `openai/gpt-oss-120b:free` |
| Programming/Technical queries | `arcee-ai/trinity-large-preview:free` |
| Deep reasoning/MCQs | `liquid/lfm-2.5-1.2b-thinking:free` |
| Quick summaries/key points | `stepfun/step-3.5-flash:free` |

---

## 🔒 PRIVACY & SECURITY

### What Stays Local (Browser)
- ✅ Original PDF/DOC/PPTX files (never uploaded)
- ✅ Parsed text (in React state, RAM only)
- ✅ Chunks (in React state, RAM only)
- ✅ Chat history (session only)

### What Goes to Backend
- ⚠️ Extracted text chunks (for AI context)
- ⚠️ User questions
- ⚠️ Chat messages

### What Goes to OpenRouter
- ⚠️ System prompt with document context
- ⚠️ User messages
- ⚠️ Conversation history (last 6 messages)

### What's NEVER Stored
- ❌ No database storage
- ❌ No file persistence
- ❌ No server-side caching
- ❌ Everything clears on page refresh

---

## 🧪 TESTING

### Test PDF Upload
1. Go to http://localhost:5173
2. Click "Study" in navbar
3. Click "Upload Documents"
4. Select a PDF with selectable text
5. Document should appear in left sidebar

### Test AI Chat
1. After uploading a document, type a question about it
2. AI should respond ONLY from the document content
3. Try asking something not in the document - AI should say "I couldn't find this information"

### Test Study Cards
1. Upload a document
2. Wait a few seconds
3. Study cards should appear in right panel:
   - Key Points
   - Important Facts
   - Practice MCQ

### Test Language Detection
1. Ask a question in Tamil/Hindi
2. AI should respond in the same language

---

## 🐛 TROUBLESHOOTING

### "AI service temporarily unavailable"
- ✅ Check `OPENROUTER_API_KEY` is set in `server/.env`
- ✅ Restart backend server: `cd server && npm start`
- ✅ Check server logs for errors

### "chunks is not defined"
- ✅ This should be fixed now
- ✅ If you still see it, clear browser cache and reload

### "Failed to parse PDF"
- ✅ PDF might be scanned (no selectable text)
- ✅ Try a different PDF with text
- ✅ Check browser console for detailed error

### Study cards not generating
- ✅ Check backend server is running
- ✅ Check `OPENROUTER_API_KEY` is valid
- ✅ Check browser network tab for `/api/ai/cards` errors

### AI answers are generic (not from documents)
- ✅ This should be fixed - context is now injected
- ✅ Check document has text (not scanned)
- ✅ Check browser console for errors

---

## 📁 FILES CHANGED

### Backend
- ✅ `server/routes/ai.routes.js` - NEW: AI proxy endpoints
- ✅ `server/app.js` - Added AI routes registration
- ✅ `server/.env.example` - Added OpenRouter API key config

### Frontend
- ✅ `client/src/api/ai.api.js` - NEW: Backend AI API client
- ✅ `client/src/context/StudyContext.jsx` - Removed separate chunks state, added getAllChunks()
- ✅ `client/src/components/study/Sidebar.jsx` - Store text & chunks in document object
- ✅ `client/src/components/study/ChatSession.jsx` - Use backend API, inject document context
- ✅ `client/src/components/study/AICardsPanel.jsx` - Use backend API for card generation

---

## ✅ VALIDATION CHECKLIST

After setup, verify:

- ✅ PDFs upload successfully
- ✅ AI answers ONLY from uploaded documents
- ✅ Study cards generate correctly
- ✅ No 401 OpenRouter errors
- ✅ No "chunks is not defined" errors
- ✅ No backend storage or database (session only)
- ✅ UI remains unchanged
- ✅ Existing PDF tools still work

---

## 🚀 NEXT STEPS

The Study Mode is now fully functional! You can:

1. Upload multiple documents
2. Ask questions across all documents
3. Generate study cards
4. Quiz yourself with MCQs
5. Study in multiple languages

All processing happens in-memory. Nothing is stored permanently.

---

**Need help?** Check the browser console and server logs for detailed error messages.
