import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import Document, { IDocument } from '../models/Document';
import { generateHash } from '../utils/generateHash';

// Upload document
export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Generate hash for the uploaded file
    const fileBuffer = fs.readFileSync(file.path);
    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    // Check if document with same hash already exists
    const existingDoc = await Document.findOne({ hash });
    if (existingDoc) {
      // Remove uploaded file if duplicate
      fs.unlinkSync(file.path);
      
      return res.status(400).json({
        success: false,
        message: 'Document with same content already exists',
      });
    }

    // Create document record
    const document = new Document({
      userId,
      filename: file.filename,
      originalName: file.originalname,
      hash,
      fileSize: file.size,
      mimeType: file.mimetype,
    });

    await document.save();

    return res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        document: {
          id: document._id,
          filename: document.filename,
          originalName: document.originalName,
          hash: document.hash,
          fileSize: document.fileSize,
          mimeType: document.mimeType,
          verified: document.verified,
          createdAt: document.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Upload document error:', error);
    
    // Clean up uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get user documents
export const getUserDocuments = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const { page = 1, limit = 10 } = req.query;

    const documents = await Document.find({ userId })
      .sort({ createdAt: -1 })
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Document.countDocuments({ userId });

    res.status(200).json({
      success: true,
      data: {
        documents: documents.map(doc => ({
          id: doc._id,
          filename: doc.filename,
          originalName: doc.originalName,
          hash: doc.hash,
          fileSize: doc.fileSize,
          mimeType: doc.mimeType,
          verified: doc.verified,
          verificationDate: doc.verificationDate,
          createdAt: doc.createdAt,
        })),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get user documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Verify document
export const verifyDocument = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const { hash } = req.body;

    if (!hash) {
      return res.status(400).json({
        success: false,
        message: 'Hash is required for verification',
      });
    }

    // Find document
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Verify hash
    const isVerified = document.hash === hash;
    
    // Update document verification status
    document.verified = isVerified;
    document.verificationDate = isVerified ? new Date() : undefined;
    await document.save();

    return res.status(200).json({
      success: true,
      message: isVerified ? 'Document verified successfully' : 'Document verification failed',
      data: {
        verified: isVerified,
        documentHash: document.hash,
        providedHash: hash,
        verificationDate: document.verificationDate,
      },
    });
  } catch (error) {
    console.error('Verify document error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get document by ID
export const getDocumentById = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;

    // Find document
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Check if user owns the document or is admin
    if (document.userId.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this document',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        document: {
          id: document._id,
          userId: document.userId,
          filename: document.filename,
          originalName: document.originalName,
          hash: document.hash,
          fileSize: document.fileSize,
          mimeType: document.mimeType,
          verified: document.verified,
          verificationDate: document.verificationDate,
          createdAt: document.createdAt,
        },
      },
    });
  } catch (error) {
    console.error('Get document by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Get all documents (admin only)
export const getAllDocuments = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const documents = await Document.find({})
      .populate('userId', 'email')
      .sort({ createdAt: -1 })
      .limit(Number(limit) * Number(page))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Document.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        documents: documents.map(doc => ({
          id: doc._id,
          userId: (doc.userId as any).email,
          filename: doc.filename,
          originalName: doc.originalName,
          hash: doc.hash,
          fileSize: doc.fileSize,
          mimeType: doc.mimeType,
          verified: doc.verified,
          verificationDate: doc.verificationDate,
          createdAt: doc.createdAt,
        })),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get all documents error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// Delete document
export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    const userId = (req as any).user?.userId;
    const userRole = (req as any).user?.role;

    // Find document
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Check if user owns the document or is admin
    if (document.userId.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this document',
      });
    }

    // Delete file from uploads
    const filePath = path.join(__dirname, '../../uploads', document.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete document from database
    await Document.findByIdAndDelete(documentId);

    return res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    console.error('Delete document error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
