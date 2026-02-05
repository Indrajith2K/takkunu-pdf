const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

const mergeController = require('../controllers/merge.controller');
const splitController = require('../controllers/split.controller');
const extractController = require('../controllers/extract.controller');
const removeController = require('../controllers/remove.controller');

// Merge: Multiple files upload
router.post('/merge', upload.array('files', 20), mergeController.mergePdfs);

// Split: Single file upload
router.post('/split', upload.single('file'), splitController.splitPdf);

// Extract: Single file upload + body params
router.post('/extract', upload.single('file'), extractController.extractPages);

// Remove: Single file upload + body params
router.post('/remove', upload.single('file'), removeController.removePages);

module.exports = router;
