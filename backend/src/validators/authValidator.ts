import { body } from 'express-validator';

// Registration validation rules
export const validateRegistration = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('Email address is too long'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    .isLength({ max: 128 })
    .withMessage('Password is too long'),
];

// Login validation rules
export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// Document verification validation rules
export const verifyDocumentValidation = [
  body('hash')
    .notEmpty()
    .withMessage('Hash is required for verification')
    .isLength({ min: 64, max: 64 })
    .withMessage('Hash must be exactly 64 characters long (SHA-256)')
    .matches(/^[a-f0-9]+$/i)
    .withMessage('Hash must contain only hexadecimal characters'),
];
