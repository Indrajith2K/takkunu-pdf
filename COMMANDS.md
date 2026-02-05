# Command Reference - Open Source Tools

This document maps each feature to the exact command-line tool and command used.

---

## 📄 Convert Tools

### 1. PDF to Word

**Tool**: LibreOffice (Headless)  
**Package**: `libreoffice`, `libreoffice-writer`  
**Command**:
```bash
libreoffice --headless --convert-to docx "input.pdf" --outdir "/output/directory"
```

**How it works**:
- LibreOffice reads PDF text content
- Converts to DOCX format preserving layout
- Works best with text-based PDFs (not scanned images)

**Limitations**:
- Does NOT perform OCR
- Complex layouts may not convert perfectly
- Scanned PDFs won't work (need OCR)

---

### 2. Word to PDF

**Tool**: LibreOffice (Headless)  
**Package**: `libreoffice`, `libreoffice-writer`  
**Command**:
```bash
libreoffice --headless --convert-to pdf "input.docx" --outdir "/output/directory"
```

**How it works**:
- LibreOffice renders document as PDF
- Preserves formatting, fonts, images
- Supports .doc and .docx formats

**Limitations**:
- Very large documents may take time
- Some advanced Word features may not render perfectly

---

### 3. JPG to PDF

**Tool**: ImageMagick  
**Package**: `imagemagick`  
**Command**:
```bash
magick convert "input.jpg" "output.pdf"
```

**Alternative (older ImageMagick)**:
```bash
convert "input.jpg" "output.pdf"
```

**How it works**:
- Wraps image in PDF container
- Can handle JPEG, JPG formats
- Quick and reliable

**Limitations**:
- One image per PDF (for MVP)
- Large images may create large PDFs

---

### 4. PDF to JPG

**Tool**: Poppler Utils (pdftoppm)  
**Package**: `poppler-utils`  
**Command**:
```bash
pdftoppm -jpeg -r 150 "input.pdf" "output-prefix"
```

**Parameters**:
- `-jpeg`: Output format
- `-r 150`: Resolution in DPI (150 is good balance)
- Output files: `output-prefix-1.jpg`, `output-prefix-2.jpg`, etc.

**How it works**:
- Renders each PDF page as image
- Creates separate JPG for each page
- Higher DPI = better quality but larger files

**Limitations**:
- Multi-page PDFs create multiple images
- For MVP: return first page or zip all pages

---

## 🗂 Organize Tools

### 1. Merge PDF

**Tool**: Poppler Utils (pdfunite)  
**Package**: `poppler-utils`  
**Command**:
```bash
pdfunite "input1.pdf" "input2.pdf" "input3.pdf" "output.pdf"
```

**Alternative using qpdf**:
```bash
qpdf --empty --pages "input1.pdf" "input2.pdf" "input3.pdf" -- "output.pdf"
```

**How it works**:
- Concatenates PDFs in order
- Fast and reliable
- Preserves PDF features

**Limitations**:
- All inputs must be valid PDFs
- Output size = sum of all inputs

---

### 2. Split PDF

**Tool**: Poppler Utils (pdfseparate)  
**Package**: `poppler-utils`  
**Command**:
```bash
pdfseparate "input.pdf" "output-page-%d.pdf"
```

**Alternative using qpdf**:
```bash
qpdf "input.pdf" --split-pages "output.pdf"
```

**How it works**:
- Extracts each page to separate PDF
- `%d` is replaced with page number (1, 2, 3...)
- Creates multiple files

**Limitations**:
- Creates many files (should zip for download)
- Large PDFs create many outputs

---

### 3. Extract Pages

**Tool**: qpdf  
**Package**: `qpdf`  
**Command**:
```bash
qpdf "input.pdf" --pages "input.pdf" 1-3,5,7-9 -- "output.pdf"
```

**Page specification format**:
- `1-3`: Pages 1, 2, 3
- `5`: Page 5 only
- `7-9`: Pages 7, 8, 9
- Combined: `1-3,5,7-9`

**How it works**:
- Reads input PDF
- Extracts only specified pages
- Creates new PDF with selected pages

**Alternative using pdftk** (if available):
```bash
pdftk "input.pdf" cat 1-3 5 7-9 output "output.pdf"
```

**Limitations**:
- Page specification must be valid
- Page numbers must exist in source PDF

---

### 4. Remove Pages

**Tool**: qpdf  
**Package**: `qpdf`  
**Process**: Two-step process

**Step 1: Get total pages**
```bash
qpdf --show-npages "input.pdf"
```

**Step 2: Extract pages to keep**
```bash
# Example: Remove pages 2 and 5 from 10-page PDF
# Keep: 1,3-4,6-10
qpdf "input.pdf" --pages "input.pdf" 1,3-4,6-10 -- "output.pdf"
```

**How it works**:
1. Calculate total pages
2. Parse pages to remove (e.g., "2,5")
3. Calculate inverse (pages to keep)
4. Extract pages to keep

**Logic in code**:
```javascript
// Total pages: 10
// Pages to remove: "2,5"
// Pages to keep: [1,3,4,6,7,8,9,10]
// Format as: "1,3-4,6-10"
```

**Limitations**:
- Cannot remove all pages
- Page specification must be valid

---

## 🔧 System Requirements

### Docker Image (Render)

All tools are installed via Dockerfile:

```dockerfile
RUN apt-get update && apt-get install -y \
    libreoffice \
    libreoffice-writer \
    poppler-utils \
    qpdf \
    imagemagick \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
```

### Local Development (Windows)

To test locally, install:

**Option 1: Using Package Managers**

```powershell
# Using Chocolatey
choco install libreoffice-fresh
choco install poppler
choco install qpdf
choco install imagemagick

# Using Scoop
scoop install libreoffice
scoop install poppler
scoop install qpdf
scoop install imagemagick
```

**Option 2: Manual Installation**

- **LibreOffice**: [Download](https://www.libreoffice.org/download/)
- **Poppler**: [Windows builds](https://github.com/oschwartz10612/poppler-windows/releases)
- **qpdf**: [Download](https://github.com/qpdf/qpdf/releases)
- **ImageMagick**: [Download](https://imagemagick.org/script/download.php#windows)

**Important**: Add all tools to Windows PATH

---

## 📊 Performance Benchmarks

Approximate processing times (varies by file size):

| Operation | Small (1MB) | Medium (5MB) | Large (10MB) |
|-----------|-------------|--------------|--------------|
| PDF→Word | 2-5s | 5-10s | 10-20s |
| Word→PDF | 2-5s | 5-10s | 10-20s |
| JPG→PDF | 1-2s | 2-5s | 5-10s |
| PDF→JPG | 3-6s | 6-12s | 12-25s |
| Merge (2 files) | 1-3s | 3-6s | 6-12s |
| Split | 2-5s | 5-10s | 10-20s |
| Extract Pages | 1-3s | 3-6s | 6-12s |
| Remove Pages | 2-4s | 4-8s | 8-15s |

*These are estimates for Render free tier. May vary based on load.*

---

## 🐛 Debugging Commands

### Test Tools Installation

```bash
# Check LibreOffice
libreoffice --version

# Check Poppler tools
pdfunite --version
pdfseparate --version
pdftoppm --version

# Check qpdf
qpdf --version

# Check ImageMagick
magick --version
# or
convert --version
```

### Test Individual Operations

```bash
# Test PDF to Word
libreoffice --headless --convert-to docx test.pdf --outdir ./output

# Test merge
pdfunite file1.pdf file2.pdf merged.pdf

# Test page extraction
qpdf input.pdf --pages input.pdf 1-3 -- output.pdf
```

---

## 🎯 Why These Tools?

| Tool | Why Chosen | Alternatives Considered |
|------|-----------|------------------------|
| **LibreOffice** | Free, mature, excellent format support | Google Docs (requires API), Pandoc (limited formatting) |
| **Poppler** | Industry standard, fast, reliable | PyPDF2 (Python dependency), pdf.js (browser-only) |
| **qpdf** | Powerful page manipulation, free | PDFtk (harder to install), PyPDF2 (slower) |
| **ImageMagick** | Universal image tool, simple | Pillow (Python), Sharp (Node, more complex) |

All chosen tools are:
- ✅ **Open source**
- ✅ **Free forever**
- ✅ **Well maintained**
- ✅ **Available in Debian/Ubuntu repos**
- ✅ **Proven in production**

---

## 📚 Additional Resources

- **LibreOffice Docs**: https://help.libreoffice.org/
- **Poppler Utils**: https://poppler.freedesktop.org/
- **qpdf Manual**: https://qpdf.readthedocs.io/
- **ImageMagick Docs**: https://imagemagick.org/

---

*This reference is your technical foundation. Keep it updated as you learn more about these tools.*
