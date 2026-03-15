import { Router } from 'express';
import { body } from 'express-validator';
import {
  uploadDocument,
  getUserDocuments,
  verifyDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
} from '../controllers/documentController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireAdmin } from '../middleware/adminMiddleware';
import { upload } from '../middleware/uploadMiddleware';
import { validateRequest } from '../middleware/validationMiddleware';

const router = Router();

// Upload document (protected)
router.post(
  '/upload',
  authenticateToken,
  upload.single('document'),
  validateRequest,
  uploadDocument
);

// Get user documents (protected)
router.get('/', authenticateToken, getUserDocuments);

// Verify document
router.post(
  '/verify/:documentId',
  [
    body('hash')
      .notEmpty()
      .withMessage('Hash is required for verification')
      .isLength({ min: 64, max: 64 })
      .withMessage('Hash must be 64 characters long (SHA-256)'),
  ],
  validateRequest,
  verifyDocument
);

// Get all documents (admin only)
router.get('/all', authenticateToken, requireAdmin, getAllDocuments);

// Get document by ID (protected)
router.get('/:documentId', authenticateToken, getDocumentById);

// Delete document (protected)
router.delete('/:documentId', authenticateToken, deleteDocument);

export default router;
