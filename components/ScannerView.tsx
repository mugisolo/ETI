import React, { useState, useRef } from 'react';
import { CandidateDocument, ComplianceReport, ComplianceRisk, Candidate } from '../types';
import { analyzeDocuments } from '../services/geminiService';

interface ScannerViewProps {
  onAnalysisComplete: (candidate: Candidate) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ onAnalysisComplete }) => {
  const [files, setFiles] = useState<CandidateDocument[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      
      newFiles.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          // Remove data url prefix for API
          const base64Content = base64String.split(',')[1];
          
          setFiles(prev => [...prev, {
            name: file.name,
            type: 'unknown', 
            base64: base64Content,
            mimeType: file.type
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleScan = async () => {
    if (files.length === 0) {
      setError("Please upload at least one document.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const report = await analyzeDocuments(files);
      
      const newCandidate: Candidate = {
        id: Math.random().toString(36).substring(7),
        name: report.candidateName || "Unknown Candidate",
        role: "Pending Assessment",
        status: report.riskAssessment.level === 'CRITICAL' || report.riskAssessment.level === 'HIGH' ? 'REJECTED' : 'VERIFIED',
        report: report,
        timestamp: new Date().toISOString()
      };

      onAnalysisComplete(newCandidate);
    } catch (err) {
      setError("Analysis failed. Please try again or check your API key.");
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">New Compliance Audit</h2>
          <p className="text-base text-gray-500 mt-2">Upload candidate National ID, LC1 Letter, and Technical Certificates.</p>
        </div>

        <div className="p-8 space-y-8">
          {/* Upload Area */}
          <div className="border-3 border-dashed border-gray-300 rounded-xl p-12 text-center hover:bg-gray-50 transition-colors group">
            <input
              type="file"
              multiple
              accept="image/*,application/pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="h-16 w-16 text-indigo-900 bg-indigo-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <span className="text-lg font-bold text-indigo-900">Click to upload documents</span>
              <span className="text-sm text-gray-500 mt-1">Supports JPG, PNG (Scanned LC1 letters, IDs)</span>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Selected Documents ({files.length})</h3>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <span className="text-base text-gray-700 truncate max-w-xs font-medium">{file.name}</span>
                  </div>
                  <button onClick={() => handleRemoveFile(index)} className="text-red-500 hover:text-red-700">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg relative" role="alert">
              <span className="block sm:inline font-medium">{error}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-6">
            <button
              onClick={handleScan}
              disabled={isAnalyzing || files.length === 0}
              className={`w-full flex justify-center items-center gap-3 py-4 px-6 border border-transparent rounded-xl shadow-md text-base font-bold text-white transition-all
                ${isAnalyzing || files.length === 0 ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-900 hover:bg-indigo-800 hover:-translate-y-0.5'}
              `}
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running ETI Audit...
                </>
              ) : (
                'Verify Compliance'
              )}
            </button>
            <p className="mt-3 text-sm text-center text-gray-400 font-medium">Equatorial Talent Intelligence</p>
          </div>
        </div>
      </div>
    </div>
  );
};