# 📦 Component Documentation - takkunu pdf

Complete reference for all React components in the application.

---

## 📂 Component Structure

```
src/
├── components/
│   ├── common/
│   │   ├── FileUploader.jsx       # File upload with drag-and-drop
│   │   ├── FileUploader.css
│   │   ├── ProgressIndicator.jsx  # Loading states
│   │   └── ProgressIndicator.css
│   └── organize/
│       ├── PageSelector.jsx       # Page range input
│       └── PageSelector.css
├── pages/
│   ├── HomePage.jsx               # Landing page with tool grid
│   ├── HomePage.css
│   ├── ConvertPage.jsx            # File conversion interface
│   ├── ConvertPage.css
│   └── OrganizePage.jsx           # PDF organization interface
├── services/
│   └── apiService.js              # Backend API calls
├── App.jsx                        # Main app with routing
├── App.css                        # App-level styles
└── index.css                      # Global design system
```

---

## 🧩 Component Details

### 1. **App.jsx** (Main Application)

**Purpose:** Main component with client-side routing

**State:**
- `currentPage`: 'home' | 'convert' | 'organize'
- `activeTool`: currently selected tool ID

**Functions:**
- `navigate(page, tool)`: Navigation handler

**Usage:**
```jsx
import App from './App';
// Mounted in main.jsx
```

---

### 2. **HomePage.jsx** (Landing Page)

**Purpose:** Display all 8 PDF tools in a grid

**Props:**
- `onNavigate(category, toolId)`: Callback to navigate to tool page

**Tools Displayed:**
- **Convert:** pdf-to-word, word-to-pdf, jpg-to-pdf, pdf-to-jpg
- **Organize:** merge-pdf, split-pdf, extract-pages, remove-pages

**Usage:**
```jsx
<HomePage onNavigate={(category, toolId) => navigate(category, toolId)} />
```

**Key Features:**
- Responsive grid layout (1-4 columns)
- Emoji icons for each tool
- Hover effects on cards
- Info banner about features
- Footer with branding

---

### 3. **ConvertPage.jsx** (Conversion Interface)

**Purpose:** Handle file conversions (PDF ↔ Word, PDF ↔ JPG)

**Props:**
- `tool`: Tool identifier (e.g., 'pdf-to-word')
- `onBack()`: Callback to return to homepage

**State:**
- `selectedFile`: Uploaded file
- `isProcessing`: Boolean for loading state
- `progress`: 0-100 for progress bar
- `error`: Error message string
- `success`: Boolean for success state

**Tool Configurations:**
```javascript
{
  'pdf-to-word': {
    title: 'PDF to Word',
    icon: '📄',
    accept: '.pdf',
    description: 'Convert your PDF to editable Word',
    note: 'Works best with text-based PDFs'
  },
  // ... other tools
}
```

**Workflow:**
1. User selects file via FileUploader
2. User clicks "Convert File" button
3. Shows ProgressIndicator while processing
4. Downloads result automatically
5. Shows success message

**Usage:**
```jsx
<ConvertPage 
  tool="pdf-to-word" 
  onBack={() => navigate('home')} 
/>
```

---

### 4. **OrganizePage.jsx** (PDF Organization)

**Purpose:** Handle PDF operations (merge, split, extract, remove)

**Props:**
- `tool`: Tool identifier (e.g., 'merge-pdf')
- `onBack()`: Callback to return to homepage

**State:**
- `selectedFiles`: Array of uploaded files
- `selectedPages`: Page specification string
- `isProcessing`, `progress`, `error`, `success`: Same as ConvertPage

**Tool Configurations:**
```javascript
{
  'merge-pdf': {
    title: 'Merge PDF',
    icon: '🔗',
    accept: '.pdf',
    description: 'Combine multiple PDFs',
    multiFile: true
  },
  'extract-pages': {
    title: 'Extract Pages',
    icon: '📑',
    accept: '.pdf',
    description: 'Extract specific pages',
    needsPageSelection: true
  },
  // ... other tools
}
```

**Usage:**
```jsx
<OrganizePage 
  tool="merge-pdf" 
  onBack={() => navigate('home')} 
/>
```

---

### 5. **FileUploader.jsx** (Common Component)

**Purpose:** Drag-and-drop file upload with validation

**Props:**
- `accept`: File types (e.g., '.pdf', '.doc,.docx')
- `onFileSelect(file)`: Callback when file is selected
- `selectedFile`: Currently selected file (single mode)
- `multiFile`: Boolean for multiple file upload
- `files`: Array of files (multi mode)
- `onRemoveFile(index)`: Callback to remove file (multi mode)

**Features:**
- Drag-and-drop zone
- Click to browse
- File size validation (10 MB max)
- Visual feedback for drag state
- File list display with name and size
- Remove button (multi-file mode)

**Usage:**
```jsx
<FileUploader
  accept=".pdf"
  onFileSelect={(file) => setSelectedFile(file)}
  selectedFile={selectedFile}
/>

// Multi-file mode
<FileUploader
  accept=".pdf"
  onFileSelect={(file) => setFiles([...files, file])}
  multiFile={true}
  files={files}
  onRemoveFile={(index) => setFiles(files.filter((_, i) => i !== index))}
/>
```

---

### 6. **ProgressIndicator.jsx** (Common Component)

**Purpose:** Show loading state with animated progress

**Props:**
- `progress`: Number 0-100
- `message`: Loading message string

**Features:**
- Animated spinner
- Progress bar with percentage
- Status message

**Usage:**
```jsx
<ProgressIndicator
  progress={75}
  message="Converting your file..."
/>
```

---

### 7. **PageSelector.jsx** (Organize Component)

**Purpose:** Input for page range specification

**Props:**
- `value`: Current page specification string
- `onChange(value)`: Callback when value changes
- `tool`: Tool identifier (for help text)

**Features:**
- Text input for page ranges
- Contextual placeholder (e.g., "1-3, 5, 7-9")
- Help text based on tool
- Validation on backend

**Usage:**
```jsx
<PageSelector
  value={selectedPages}
  onChange={(pages) => setSelectedPages(pages)}
  tool="extract-pages"
/>
```

**Page Format Examples:**
- Extract: "1-3, 5, 7-9" (pages to keep)
- Remove: "2, 4-6, 8" (pages to delete)

---

## 🔌 API Service (apiService.js)

**Purpose:** Handle all backend communication

### Functions:

#### `convertFile(tool, file)`
```javascript
const result = await convertFile('pdf-to-word', pdfFile);
// Returns: { blob: Blob, filename: 'output.docx' }
```

#### `organizeFile(tool, files, pages)`
```javascript
const result = await organizeFile('merge-pdf', [file1, file2]);
// Returns: { blob: Blob, filename: 'merged.pdf' }

const result = await organizeFile('extract-pages', [pdfFile], '1-3,5');
// Returns: { blob: Blob, filename: 'extracted.pdf' }
```

#### `checkHealth()`
```javascript
const isHealthy = await checkHealth();
// Returns: boolean
```

---

## 🎨 Styling System

All components use **vanilla CSS** with CSS variables defined in `index.css`.

### Design Tokens:
```css
--color-primary: #6366f1        /* Indigo */
--color-secondary: #10b981      /* Green */
--color-bg-main: #fafafa        /* Off-white */
--color-bg-card: #ffffff        /* White */
--spacing-md: 1rem
--border-radius-lg: 0.75rem
```

### Component-specific CSS:
- `HomePage.css`: Grid layout, tool cards
- `ConvertPage.css`: Page header, content layout
- `FileUploader.css`: Upload area, file list
- `ProgressIndicator.css`: Spinner, progress bar
- `PageSelector.css`: Input styling

---

## 📱 Responsive Design

All components are mobile-first responsive:

**Breakpoints:**
- Desktop: Default (4 columns)
- Tablet: `@media (max-width: 768px)` (2 columns)
- Mobile: `@media (max-width: 480px)` (1 column)

**Example:**
```css
.tools-grid {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
```

---

## 🔄 Data Flow

```
User Action
   ↓
Component State Update
   ↓
UI Re-render
   ↓
API Call (apiService)
   ↓
Backend Processing
   ↓
Response with File Blob
   ↓
Download Trigger
   ↓
Success State + Reset
```

---

## 🛠️ Adding a New Tool

### Step 1: Add to HomePage
```jsx
const newTool = {
  id: 'new-feature',
  name: 'New Feature',
  icon: '🆕',
  category: 'convert' // or 'organize'
};
```

### Step 2: Add Config to ConvertPage or OrganizePage
```jsx
'new-feature': {
  title: 'New Feature',
  icon: '🆕',
  accept: '.pdf',
  description: 'Description here'
}
```

### Step 3: Add Backend Route
```javascript
// In convertRoutes.js or organizeRoutes.js
router.post('/new-feature', upload.single('file'), async (req, res) => {
  // Implementation
});
```

---

## ✅ Component Checklist

All components have:
- ✅ PropTypes documented
- ✅ Error handling
- ✅ Loading states
- ✅ Responsive design
- ✅ Accessibility (semantic HTML)
- ✅ Clean code separation
- ✅ Reusable patterns

---

## 🎯 Best Practices

1. **State Management:** Use local state, avoid over-complication
2. **Error Handling:** Always catch and display errors
3. **Loading States:** Show feedback during async operations
4. **File Validation:** Check size and type before upload
5. **User Feedback:** Success/error messages for all actions
6. **Cleanup:** Reset state after operations
7. **Responsive:** Test on mobile, tablet, desktop

---

**All components are production-ready and fully functional!** 🚀
