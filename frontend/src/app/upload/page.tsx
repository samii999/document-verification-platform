'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { generateHash } from '../../utils/hashGenerator';
import FileUpload from '../../components/FileUpload';
import { documents } from '../../services/api';
import Navbar from '../../components/Navbar';

export default function UploadPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleFileSelect = async (file: File) => {
    setUploading(true);
    setMessage('');

    try {
      // Generate hash on client side
      const hash = await generateHash(file);
      
      // Display hash to user
      setMessage(`SHA256 Hash: ${hash}`);
      setMessageType('success');
      
      // Show hash for 3 seconds, then proceed with upload
      setTimeout(() => {
        uploadFile(file, hash);
      }, 3000);
      
    } catch (error) {
      setMessage('Error generating hash');
      setMessageType('error');
      setUploading(false);
    }
  };

  const uploadFile = async (file: File, hash: string) => {
    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await documents.upload(formData);
      
      if (response.success) {
        setMessage('Document uploaded successfully!');
        setMessageType('success');
      } else {
        setMessage(response.message || 'Upload failed');
        setMessageType('error');
      }
    } catch (error: any) {
      setMessage(error.message || 'Upload failed. Please try again.');
      setMessageType('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Upload Document
          </h1>
          <p className="mt-2 text-gray-600">
            Upload a document for secure storage and verification
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">
              Supported File Types
            </h2>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                PDF
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                PNG
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                JPG
              </span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Maximum file size: 10MB
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              messageType === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <p className="font-mono text-sm break-all">{message}</p>
            </div>
          )}

          <FileUpload 
            onFileSelect={handleFileSelect}
            disabled={uploading}
          />

          {uploading && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              <h3 className="font-medium text-gray-700 mb-2">Security Information:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Your document will be hashed using SHA-256</li>
                <li>The hash will be stored for verification purposes</li>
                <li>Files are stored securely with unique names</li>
                <li>Only you can access your uploaded documents</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Go to Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
