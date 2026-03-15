import crypto from 'crypto';
import fs from 'fs';

/**
 * Generate SHA-256 hash for a file
 */
export function generateHash(filePath: string): string {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
  } catch (error) {
    console.error('Error generating hash:', error);
    throw new Error('Failed to generate hash for file');
  }
}

/**
 * Generate SHA-256 hash for a buffer
 */
export function generateBufferHash(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

/**
 * Verify if two hashes match
 */
export function verifyHash(hash1: string, hash2: string): boolean {
  return hash1.toLowerCase() === hash2.toLowerCase();
}

/**
 * Generate hash for text data
 */
export function generateTextHash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}
