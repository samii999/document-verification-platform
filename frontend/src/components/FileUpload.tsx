'use client';

import { useState } from 'react';

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  disabled?: boolean;
}

export default function FileUpload({ onFileSelect, disabled = false }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      if (onFileSelect) {
        onFileSelect(selectedFile);
      }
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        disabled={disabled}
      />
      {file && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">Selected: {file.name}</p>
          <p className="text-xs text-gray-500">
            Size: {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}
      {!disabled && (
        <div className="text-sm text-gray-500">
          Click to select a file or drag and drop
        </div>
      )}
      {disabled && (
        <div className="text-sm text-blue-600">
          Processing file...
        </div>
      )}
    </div>
  );
}
