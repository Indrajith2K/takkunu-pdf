// Organize Routes - PDF Organization Operations
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    mergePdf,
    splitPdf,
    extractPages,
    removePages
} from '../services/organizeService.js';

const router = express.Router();

// ES Module dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../temp'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({
    storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB max per file
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'));
        }
    }
});

// POST /api/organize/merge-pdf
router.post('/merge-pdf', upload.array('files', 10), async (req, res, next) => {
    try {
        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ message: 'At least 2 PDF files are required' });
        }

        const filePaths = req.files.map(f => f.path);
        const result = await mergePdf(filePaths);

        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.setHeader('Content-Type', 'application/pdf');
        res.sendFile(result.outputPath);

    } catch (error) {
        next(error);
    }
});

// POST /api/organize/split-pdf
router.post('/split-pdf', upload.single('files'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No PDF file uploaded' });
        }

        const result = await splitPdf(req.file.path);

        // Return as zip file
        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.setHeader('Content-Type', 'application/zip');
        res.sendFile(result.outputPath);

    } catch (error) {
        next(error);
    }
});

// POST /api/organize/extract-pages
router.post('/extract-pages', upload.single('files'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No PDF file uploaded' });
        }

        const pages = req.body.pages;
        if (!pages) {
            return res.status(400).json({ message: 'Page specification is required' });
        }

        const result = await extractPages(req.file.path, pages);

        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.setHeader('Content-Type', 'application/pdf');
        res.sendFile(result.outputPath);

    } catch (error) {
        next(error);
    }
});

// POST /api/organize/remove-pages
router.post('/remove-pages', upload.single('files'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No PDF file uploaded' });
        }

        const pages = req.body.pages;
        if (!pages) {
            return res.status(400).json({ message: 'Page specification is required' });
        }

        const result = await removePages(req.file.path, pages);

        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.setHeader('Content-Type', 'application/pdf');
        res.sendFile(result.outputPath);

    } catch (error) {
        next(error);
    }
});

export default router;
