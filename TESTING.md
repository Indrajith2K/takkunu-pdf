# Testing Guide - takkunu pdf

Complete testing checklist for MVP validation before launching to users.

---

## 🎯 Testing Philosophy

> Test with real files, real students, real scenarios. Not just happy paths.

**Goals**:
1. Ensure all features work as advertised
2. Verify error handling is user-friendly
3. Confirm performance is acceptable
4. Test on real devices (mobile + desktop)

---

## ✅ Pre-Launch Checklist

### 1. Local Development Testing

#### Frontend (localhost:5173)

- [ ] App loads without errors
- [ ] All pages render correctly
- [ ] Navigation works (Home ↔ Convert ↔ Organize)
- [ ] Responsive on mobile (check Chrome DevTools)
- [ ] File upload component works
- [ ] Progress indicators display
- [ ] Error messages display
- [ ] Success messages display

#### Backend (localhost:3000)

- [ ] Server starts without errors
- [ ] Health check responds: `curl http://localhost:3000/health`
- [ ] All endpoints accessible
- [ ] File uploads accepted
- [ ] Temp directory exists
- [ ] Auto-cleanup runs every 5 minutes

---

### 2. Conversion Tools Testing

#### A. PDF to Word

**Test Files**:
- [ ] Simple text PDF (1 page)
- [ ] Multi-page PDF (3-5 pages)
- [ ] PDF with images
- [ ] Complex layout PDF
- [ ] Scanned PDF (should fail gracefully)

**Expected Results**:
- ✅ Text-based PDFs convert successfully
- ✅ Output is .docx format
- ✅ Text is preserved
- ⚠️ Layout may differ (expected)
- ❌ Scanned PDFs show friendly error

**Test Script**:
```bash
# Using curl (replace with actual file)
curl -F "file=@test.pdf" http://localhost:3000/api/convert/pdf-to-word --output result.docx
```

#### B. Word to PDF

**Test Files**:
- [ ] Simple .docx (text only)
- [ ] .docx with images
- [ ] .docx with tables
- [ ] .doc (older format)
- [ ] Complex formatting

**Expected Results**:
- ✅ All Word formats convert successfully
- ✅ Output is valid PDF
- ✅ Formatting mostly preserved
- ✅ Images included

#### C. JPG to PDF

**Test Files**:
- [ ] Small JPG (100KB)
- [ ] Large JPG (5MB)
- [ ] High resolution (4000x3000px)
- [ ] Low resolution (640x480px)

**Expected Results**:
- ✅ All JPG files convert
- ✅ Output is valid PDF
- ✅ Image quality maintained

#### D. PDF to JPG

**Test Files**:
- [ ] Single-page PDF
- [ ] Multi-page PDF (3 pages)
- [ ] High-res PDF
- [ ] Low-res PDF

**Expected Results**:
- ✅ Single-page: one JPG output
- ✅ Multi-page: multiple JPGs or zip
- ✅ Image quality acceptable (150 DPI)

---

### 3. Organize Tools Testing

#### A. Merge PDF

**Test Files**:
- [ ] 2 small PDFs (1 page each)
- [ ] 3 PDFs (varying sizes)
- [ ] Large PDFs (5MB each)

**Expected Results**:
- ✅ PDFs merged in correct order
- ✅ All pages present in output
- ✅ No corruption

**Test Script**:
```bash
curl -F "files=@file1.pdf" -F "files=@file2.pdf" http://localhost:3000/api/organize/merge-pdf --output merged.pdf
```

#### B. Split PDF

**Test Files**:
- [ ] 3-page PDF
- [ ] 10-page PDF
- [ ] 1-page PDF (edge case)

**Expected Results**:
- ✅ Each page becomes separate PDF
- ✅ Files named correctly
- ✅ Output is zip file (if implemented)

#### C. Extract Pages

**Test Cases**:
- [ ] Extract single page: "3"
- [ ] Extract range: "1-3"
- [ ] Extract mixed: "1-3,5,7-9"
- [ ] Extract all: "1-10" (from 10-page PDF)
- [ ] Invalid: "15" (page doesn't exist)
- [ ] Invalid: "abc" (non-numeric)

**Expected Results**:
- ✅ Valid specs: correct pages extracted
- ❌ Invalid specs: friendly error message

#### D. Remove Pages

**Test Cases**:
- [ ] Remove single: "2"
- [ ] Remove range: "2-4"
- [ ] Remove mixed: "2,5,7-9"
- [ ] Remove all: should fail gracefully
- [ ] Invalid page numbers: friendly error

**Expected Results**:
- ✅ Specified pages removed
- ✅ Remaining pages in correct order
- ❌ Can't remove all pages

---

### 4. Error Handling Testing

#### Frontend Validation

- [ ] Upload with no file selected → Error message
- [ ] File too large (>10MB) → "File size must be less than 10 MB"
- [ ] Wrong file type → Prevented by file picker
- [ ] Network error → "Connection failed. Please try again."

#### Backend Errors

- [ ] Missing file → 400 Bad Request
- [ ] Invalid file type → "Invalid file type"
- [ ] Conversion failure → Friendly error message
- [ ] Tool not found (simulate) → Error logged, user sees generic message

#### Edge Cases

- [ ] Empty PDF → Handled gracefully
- [ ] Corrupted file → Error message
- [ ] Simultaneous requests → Queue or reject gracefully
- [ ] Server offline → Frontend shows error

---

### 5. Performance Testing

#### File Size Limits

- [ ] 1 KB file → Fast (<2s)
- [ ] 1 MB file → Medium (~5s)
- [ ] 5 MB file → Acceptable (~15s)
- [ ] 10 MB file → Slow but works (~30s)
- [ ] 11 MB file → Rejected

#### Concurrent Users (simulate)

```bash
# Test 5 simultaneous requests
for i in {1..5}; do
  curl -F "file=@test.pdf" http://localhost:3000/api/convert/pdf-to-word --output result$i.docx &
done
wait
```

**Expected**: All complete without crashing (may be slow)

#### Auto-Cleanup

```bash
# 1. Upload file via API
# 2. Wait 6 minutes
# 3. Check temp/ directory
ls -la server/temp/
```

**Expected**: File deleted after 5 minutes

---

### 6. UI/UX Testing

#### Desktop Testing

**Browsers**:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if Mac available)
- [ ] Edge (latest)

**Screen Sizes**:
- [ ] 1920x1080 (Full HD)
- [ ] 1366x768 (Common laptop)
- [ ] 1280x720 (HD)

#### Mobile Testing

**Devices**:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)

**Screen Sizes**:
- [ ] 375x667 (iPhone SE)
- [ ] 390x844 (iPhone 12/13)
- [ ] 360x800 (Android common)

**Test Cases**:
- [ ] Can tap file upload area
- [ ] File picker opens correctly
- [ ] Progress bar visible
- [ ] Download works on mobile
- [ ] Buttons are touch-friendly (min 44x44px)

---

### 7. Real User Testing (Beta)

#### Recruit 5-10 Classmates

**Give them tasks**:
1. Convert your assignment PDF to Word
2. Merge two PDFs (e.g., notes + assignment)
3. Extract pages 1-3 from a lecture PDF

**Collect Feedback**:
- Was it easy to use?
- Did anything confuse you?
- Did you encounter any errors?
- Would you use this again?

**Iterate Based on Feedback**

---

## 🐛 Common Issues & Fixes

### Issue: "libreoffice: command not found"

**Cause**: LibreOffice not installed  
**Fix**: Install LibreOffice (see COMMANDS.md)

### Issue: "File too large"

**Cause**: File exceeds 10 MB  
**Fix**: Expected behavior, inform user

### Issue: "Conversion failed"

**Cause**: Scanned PDF or corrupted file  
**Fix**: Show message: "Works best with text-based PDFs"

### Issue: "Server not responding"

**Cause**: Backend offline or cold start (Render)  
**Fix**: Check backend logs, wait 30s for cold start

### Issue: "CORS error"

**Cause**: Frontend can't reach backend  
**Fix**: Check `VITE_API_URL` environment variable

---

## 📊 Quality Metrics

### Success Criteria

- ✅ **Feature Completeness**: All 8 tools working
- ✅ **Error Rate**: <5% of conversions fail
- ✅ **User Satisfaction**: >80% positive feedback
- ✅ **Performance**: 90% of files process in <30s
- ✅ **Mobile Usability**: Works on phones without issues

### Monitor These

1. **Conversion Success Rate**
   - Track: Successful vs. failed conversions
   - Goal: >95% success rate

2. **Average Processing Time**
   - Track: Time from upload to download
   - Goal: <30 seconds for 10 MB files

3. **User Retention**
   - Track: Users who return within 7 days
   - Goal: >20% (for MVP)

4. **Error Types**
   - Track: Most common errors
   - Fix: Address top 3 error causes

---

## 🧪 Automated Testing (Future)

### Unit Tests (Phase 2)

```javascript
// Example: Test page range parsing
describe('parsePageSpec', () => {
  it('should parse single page', () => {
    expect(parsePageSpec('3')).toEqual([3]);
  });
  
  it('should parse range', () => {
    expect(parsePageSpec('1-3')).toEqual([1, 2, 3]);
  });
  
  it('should parse mixed', () => {
    expect(parsePageSpec('1-3,5')).toEqual([1, 2, 3, 5]);
  });
});
```

### Integration Tests (Phase 2)

```javascript
// Example: Test API endpoint
describe('POST /api/convert/pdf-to-word', () => {
  it('should convert PDF to Word', async () => {
    const response = await request(app)
      .post('/api/convert/pdf-to-word')
      .attach('file', 'test/fixtures/sample.pdf');
    
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/');
  });
});
```

### E2E Tests (Phase 3)

Using Playwright or Cypress for full user journey testing.

---

## 📝 Test Documentation Template

```markdown
## Test: [Feature Name]

**Date**: YYYY-MM-DD  
**Tester**: Your Name  
**Environment**: Local / Staging / Production

### Test Cases

| ID | Description | Input | Expected | Actual | Status |
|----|-------------|-------|----------|--------|--------|
| 1  | Convert simple PDF | sample.pdf | .docx output | ✅ Works | PASS |
| 2  | Convert scanned PDF | scan.pdf | Friendly error | ✅ Error shown | PASS |
| 3  | File > 10 MB | large.pdf | Rejected | ✅ Rejected | PASS |

### Issues Found

1. [Issue description]
2. [Issue description]

### Recommendations

1. [Recommendation]
2. [Recommendation]
```

---

## 🎯 Final Pre-Launch Checklist

Before sharing with users:

- [ ] All 8 tools tested and working
- [ ] Error messages are friendly
- [ ] Mobile responsive verified
- [ ] Auto-cleanup tested (files delete after 5 min)
- [ ] Deployment successful (Vercel + Render)
- [ ] Health check endpoint working
- [ ] Documentation complete (README, DEPLOYMENT)
- [ ] Beta tested with 5+ people
- [ ] Feedback incorporated
- [ ] Performance acceptable (<30s for most files)

---

## 🚀 Launch Day Checklist

- [ ] Announce to classmates
- [ ] Monitor error logs
- [ ] Watch for unusual patterns
- [ ] Be ready to fix issues quickly
- [ ] Collect user feedback actively
- [ ] Plan iteration based on feedback

---

## 📚 Resources

- **Browser Testing**: Chrome DevTools, Firefox DevTools
- **API Testing**: Postman, curl
- **Load Testing**: Apache Bench (ab), Artillery
- **Mobile Testing**: Real devices + BrowserStack (free tier)

---

*Remember: Perfect is the enemy of good. Ship MVP, then iterate based on real usage.*
