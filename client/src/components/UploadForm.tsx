import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, FileText, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { CVData } from "@shared/schema";

interface UploadFormProps {
  onUploadSuccess: (data: CVData) => void;
}

export default function UploadForm({ onUploadSuccess }: UploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Please select a valid PDF file.');
      }
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setError(null);
      } else {
        setError('Please drop a valid PDF file.');
      }
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('cv', selectedFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const extractedData = await response.json();
      onUploadSuccess(extractedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process CV. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  return (
    <Card className="bg-white shadow-sm border border-gray-200">
      <CardContent className="p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload CV Document</h2>
          <p className="text-gray-600 mb-6">Upload a PDF file to extract professional information automatically</p>
          
          {/* Upload Zone */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 hover:border-primary transition-colors duration-200 cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('cv-file')?.click()}
          >
            <div className="flex flex-col items-center">
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Drop your CV here or click to browse</p>
              <p className="text-sm text-gray-500 mb-4">Supports PDF files up to 10MB</p>
              <input
                type="file"
                id="cv-file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
              <Button type="button" className="bg-primary text-primary-foreground hover:bg-primary/90">
                Choose File
              </Button>
            </div>
          </div>

          {/* Selected File Display */}
          {selectedFile && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-red-500" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={removeFile}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <div className="mt-6">
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3"
            >
              {isUploading ? 'Processing...' : 'Extract CV Information'}
            </Button>
          </div>

          {/* Loading State */}
          {isUploading && (
            <div className="mt-6">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <p className="text-gray-600">Processing your CV... This may take a few moments.</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <Alert className="mt-6" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
