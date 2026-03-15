import mongoose, { Schema, Document as MongoDocument } from 'mongoose';

export interface IDocument extends MongoDocument {
  userId: mongoose.Types.ObjectId;
  filename: string;
  originalName: string;
  hash: string;
  fileSize: number;
  mimeType: string;
  verified: boolean;
  verificationDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const documentSchema = new Schema<IDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  filename: {
    type: String,
    required: [true, 'Filename is required'],
    trim: true,
  },
  originalName: {
    type: String,
    required: [true, 'Original filename is required'],
    trim: true,
  },
  hash: {
    type: String,
    required: [true, 'Document hash is required'],
    unique: true,
    trim: true,
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
    min: [0, 'File size must be positive'],
  },
  mimeType: {
    type: String,
    required: [true, 'MIME type is required'],
    trim: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  verificationDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Index for faster lookups
documentSchema.index({ userId: 1, createdAt: -1 });
// Note: hash field already has unique index, no need for additional index

const Document = mongoose.model<IDocument>('Document', documentSchema);

export default Document;
