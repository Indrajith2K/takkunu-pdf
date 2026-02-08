# 🎓 AI Study Mode - Setup Guide

## Overview
The Study Mode is a **browser-only, privacy-first AI learning assistant** that helps you study from your own documents (PDF, DOC, PPTX).

### Key Features
- ✅ **100% Browser-Only** - No backend, no database, no storage
- ✅ **Privacy-First** - Files never leave your browser (except text sent to AI)
- ✅ **Session-Only** - Everything clears on refresh
- ✅ **Multi-Language** - Auto-detects Tamil, Hindi, Malayalam, Telugu, Tanglish
- ✅ **Smart Model Selection** - Chooses best AI model per query type
- ✅ **Strict Retrieval** - AI answers ONLY from your documents
- ✅ **Study Cards** - Auto-generates Key Points, Facts, and MCQs

---

## Setup Instructions

### 1. Get OpenRouter API Key

1. Go to [https://openrouter.ai/keys](https://openrouter.ai/keys)
2. Sign up (free)
3. Create a new API key
4. Copy the key (starts with `sk-or-v1-...`)

### 2. Configure Environment Variable

Create a `.env` file in the `client` folder:

```bash
cd client
cp .env.example .env
```

Edit `.env` and add your key:

```env
VITE_OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the App

```bash
npm run dev
```

---

## How It Works

### Document Upload
1. Click "Upload Documents" in the left sidebar
2. Select PDF, DOC, or PPTX files
3. Files are parsed in-browser using:
   - `pdfjs-dist` for PDFs
   - `mammoth` for DOC/DOCX
4. Text is chunked into 500-800 token segments
5. Chunks stored in React state (RAM only)

### AI Chat
1. User asks a question
2. System retrieves relevant chunks using keyword matching
3. Chunks sent to OpenRouter API with strict prompt:
   - "Answer ONLY from provided context"
   - "If not found, say so"
4. AI streams response back
5. Response displayed with typing effect

### Model Selection (Automatic)
| Condition | Model |
|-----------|-------|
| Tamil/Hindi/Malayalam/Telugu/Tanglish | `openai/gpt-oss-120b:free` |
| Programming/Tech keywords | `arcee-ai/trinity-large-preview:free` |
| Deep reasoning (why/how/explain) | `liquid/lfm-2.5-1.2b-thinking:free` |
| Quick Q&A | `stepfun/step-3.5-flash:free` |

### Study Cards
- **Key Points**: Extracted main ideas
- **Facts**: Important definitions
- **MCQs**: Practice questions with answers

---

## Privacy Guarantees

### What Stays Local
- ✅ Original files (never uploaded)
- ✅ Parsed text (in browser RAM)
- ✅ Chunks (in browser RAM)
- ✅ Chat history (in browser RAM)

### What Goes to AI
- ⚠️ Text chunks (for answering questions)
- ⚠️ User questions

### What's Never Stored
- ❌ No database
- ❌ No server storage
- ❌ No IndexedDB
- ❌ No localStorage
- ❌ No cookies

**On refresh/close tab**: Everything is cleared.

---

## Supported File Types

| Type | Extensions | Library |
|------|------------|---------|
| PDF | `.pdf` | pdfjs-dist |
| Word | `.doc`, `.docx` | mammoth |
| PowerPoint | `.ppt`, `.pptx` | mammoth |

---

## Architecture

```
client/src/
├── pages/
│   └── StudyPage.jsx          # Main study interface
├── components/study/
│   ├── Sidebar.jsx            # Document upload & library
│   ├── ChatSession.jsx        # AI chat interface
│   └── AICardsPanel.jsx       # Study cards display
├── context/
│   └── StudyContext.jsx       # Session state management
└── utils/study/
    ├── documentParser.js      # PDF/DOC/PPTX parsing
    ├── textChunking.js        # Semantic chunking & retrieval
    ├── modelSelection.js      # Language & intent detection
    └── aiService.js           # OpenRouter API integration
```

---

## Troubleshooting

### "Failed to parse PDF"
- Ensure file is a valid PDF
- Try re-uploading
- Check browser console for errors

### "API Error"
- Verify `VITE_OPENROUTER_API_KEY` is set correctly
- Check OpenRouter dashboard for quota
- Ensure you have internet connection

### "I couldn't find this in your materials"
- Try rephrasing your question
- Upload more relevant documents
- Check if document text was extracted properly

---

## Cost & Limits

- **Free Models**: All models used are free tier on OpenRouter
- **Rate Limits**: Subject to OpenRouter's free tier limits
- **No Hidden Costs**: 100% transparent

---

## Security Notes

1. **API Key**: Keep your `.env` file private (already in `.gitignore`)
2. **HTTPS**: App uses HTTPS for API calls
3. **No Tracking**: Zero analytics or tracking
4. **No Training**: Your data is never used to train models

---

## Future Enhancements (Optional)

- [ ] Export chat as PDF
- [ ] Flashcard mode
- [ ] Quiz streak tracking
- [ ] Multi-document cross-referencing
- [ ] Voice input support

---

## Support

For issues or questions:
1. Check browser console for errors
2. Verify API key is correct
3. Ensure files are valid formats
4. Try refreshing the page

---

**Built with**: React + Vite + OpenRouter + pdfjs-dist + mammoth
**License**: Private (part of Takkunu PDF)
