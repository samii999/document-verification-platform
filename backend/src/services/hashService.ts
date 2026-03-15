import crypto from 'crypto';
import fs from 'fs';

export class HashService {
  /**
   * Generate SHA-256 hash for a file
   */
  static generateFileHash(filePath: string): string {
    try {
      const fileBuffer = fs.readFileSync(filePath);
      return crypto.createHash('sha256').update(fileBuffer).digest('hex');
    } catch (error) {
      console.error('Error generating file hash:', error);
      throw new Error('Failed to generate file hash');
    }
  }

  /**
   * Generate SHA-256 hash for a buffer
   */
  static generateBufferHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }

  /**
   * Verify if two hashes match
   */
  static verifyHash(hash1: string, hash2: string): boolean {
    return hash1.toLowerCase() === hash2.toLowerCase();
  }

  /**
   * Generate hash for text data
   */
  static generateTextHash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }
}

export default HashService;
