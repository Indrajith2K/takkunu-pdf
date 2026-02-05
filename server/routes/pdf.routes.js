const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const mergeController = require('../controllers/merge.controller');
const splitController = require('../controllers/split.controller');
const extractController = require('../controllers/extract.controller');
const removeController = require('../controllers/remove.controller');
const jpgToPdfController = require('../controllers/jpgToPdf.controller');
const wordToPdfController = require('../controllers/wordToPdf.controller');

// Merge: Multiple files upload (Max 20)
router.post('/merge', upload.array('files', 20), mergeController.mergePdfs);

// Split: Single file upload
router.post('/split', upload.single('file'), splitController.splitPdf);

// Extract: Single file upload + body params
router.post('/extract', upload.single('file'), extractController.extractPages);

// Remove: Single file upload + body params
router.post('/remove', upload.single('file'), removeController.removePages);

// JPG to PDF: Multiple images (Max 10)
router.post('/jpg-to-pdf', upload.array('files', 10), jpgToPdfController.jpgToPdf);

// Word to PDF: Single .docx file
router.post('/word-to-pdf', upload.single('file'), wordToPdfController.wordToPdf);

module.exports = router;
