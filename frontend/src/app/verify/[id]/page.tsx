'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import { documents as documentsAPI } from '../../../services/api';
import { generateHash } from '../../../utils/hashGenerator';
import Navbar from '../../../components/Navbar';
import Link from 'next/link';

interface Document {
  id: string;
  filename: string;
  originalName: string;
  hash: string;
  fileSize: number;
  mimeType: string;
  verified: boolean;
  verificationDate?: string;
  createdAt: string;
}

export default function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Unwrap the params Promise
  const resolvedParams = use(params);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchDocument();
  }, [user, router, resolvedParams.id]);

  const fetchDocument = async () => {
    try {
      const response = await documentsAPI.getDocumentById(resolvedParams.id);
      if (response.success) {
        setDocument(response.data.document);
      } else {
        setError(response.message || 'Failed to fetch document');
      }
    } catch (err) {
      setError('Failed to fetch document');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleVerify = async () => {
    if (!selectedFile) {
      setError('Please select a file to verify');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      // Generate hash from selected file
      const hash = await generateHash(selectedFile);
      const response = await documentsAPI.verifyDocument(resolvedParams.id, hash);
      setVerificationResult(response);
      
      // Refresh document data to show updated verification status
      await fetchDocument();
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Verify Document
          </h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {document && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Document Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Name</p>
                <p className="text-sm text-gray-900">{document.originalName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Size</p>
                <p className="text-sm text-gray-900">{formatFileSize(document.fileSize)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Type</p>
                <p className="text-sm text-gray-900">{document.mimeType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  document.verified
                    ? 'bg-green-100 text-green-800'
                    : document.verificationDate 
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {document.verified 
                    ? 'Verified' 
                    : document.verificationDate 
                      ? 'Modified' 
                      : 'Pending'}
                </span>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm font-medium text-gray-500">Original Hash</p>
                <p className="text-sm font-mono text-gray-900 break-all">{document.hash}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Verify Document Integrity
          </h2>
          <p className="text-gray-600 mb-4">
            Upload the same file to verify its integrity using SHA-256 hash comparison.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select file to verify
            </label>
            <input
              type="file"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </div>

          {selectedFile && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                Selected: <span className="font-medium">{selectedFile.name}</span>
              </p>
              <p className="text-sm text-gray-600">
                Size: <span className="font-medium">{formatFileSize(selectedFile.size)}</span>
              </p>
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={!selectedFile || verifying}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed px-4 py-2 rounded-md text-sm font-medium"
          >
            {verifying ? 'Verifying...' : 'Verify Document'}
          </button>

          {verificationResult && (
            <div className={`mt-4 p-4 rounded-md ${
              verificationResult.data?.verified
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              <h3 className="font-medium mb-2">
                {verificationResult.data?.verified ? '✅ Verification Successful' : '❌ Verification Failed'}
              </h3>
              <p className="text-sm">
                {verificationResult.data?.verified
                  ? 'The document integrity has been verified successfully.'
                  : 'The document does not match the original - it has been modified.'}
              </p>
              {verificationResult.data && (
                <div className="mt-2 text-sm">
                  <p>Document Hash: {verificationResult.data.documentHash}</p>
                  <p>Provided Hash: {verificationResult.data.providedHash}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
