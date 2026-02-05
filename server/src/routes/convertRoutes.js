// Convert Routes - PDF/Document/Image Conversions
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
    pdfToWord,
    wordToPdf,
    jpgToPdf,
    pdfToJpg
} from '../services/convertService.js';

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
        fileSize: 10 * 1024 * 1024 // 10 MB max
    },
    fileFilter: (req, file, cb) => {
        // Basic file type validation
        const allowedMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/jpg'
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    }
});

// POST /api/convert/pdf-to-word
router.post('/pdf-to-word', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await pdfToWord(req.file.path);

        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        res.sendFile(result.outputPath);

    } catch (error) {
        next(error);
    }
});

// POST /api/convert/word-to-pdf
router.post('/word-to-pdf', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await wordToPdf(req.file.path);

        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.setHeader('Content-Type', 'application/pdf');
        res.sendFile(result.outputPath);

    } catch (error) {
        next(error);
    }
});

// POST /api/convert/jpg-to-pdf
router.post('/jpg-to-pdf', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await jpgToPdf(req.file.path);

        res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
        res.setHeader('Content-Type', 'application/pdf');
        res.sendFile(result.outputPath);

    } catch (error) {
        next(error);
    }
});

// POST /api/convert/pdf-to-jpg
router.post('/pdf-to-jpg', upload.single('file'), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const result = await pdfToJpg(req.file.path);

        // For multi-page PDFs, return as zip
        if (result.isZip) {
            res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
            res.setHeader('Content-Type', 'application/zip');
        } else {
            res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
            res.setHeader('Content-Type', 'image/jpeg');
        }

        res.sendFile(result.outputPath);

    } catch (error) {
        next(error);
    }
});

export default router;
