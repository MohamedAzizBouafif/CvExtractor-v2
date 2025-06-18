import { useState } from "react";
import UploadForm from "@/components/UploadForm";
import InfoForm from "@/components/InfoForm";
import { FileText } from "lucide-react";
import type { CVData } from "@shared/schema";

export default function Home() {
  const [extractedData, setExtractedData] = useState<CVData | null>(null);

  const handleUploadSuccess = (data: CVData) => {
    setExtractedData(data);
  };

  const handleUploadAnother = () => {
    setExtractedData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">CV Extractor</h1>
              <p className="text-sm text-gray-600">
                Extract and edit professional information from CV documents
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Show upload form if no data extracted, otherwise show info form */}
        {!extractedData ? (
          <UploadForm onUploadSuccess={handleUploadSuccess} />
        ) : (
          <InfoForm
            extractedData={extractedData}
            onUploadAnother={handleUploadAnother}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>
              &copy; 2024 CV Extractor. Professional CV analysis and extraction
              tool.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
