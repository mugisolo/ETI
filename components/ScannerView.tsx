
import React, { useState, useRef } from 'react';
import { CandidateDocument, Candidate } from '../types';
import { analyzeDocuments } from '../services/geminiService';

interface ScannerViewProps {
  onAnalysisComplete: (candidate: Candidate) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ onAnalysisComplete }) => {
  const [files, setFiles] = useState<CandidateDocument[]>([]);
  const [selfie, setSelfie] = useState<CandidateDocument | null>(null);
  const [email, setEmail] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      newFiles.forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          setFiles(prev => [...prev, {
            name: file.name,
            type: 'unknown', 
            base64: base64String.split(',')[1],
            mimeType: file.type
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSelfieChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
          const file = event.target.files[0];
          const reader = new FileReader();
          reader.onloadend = () => {
              const base64String = reader.result as string;
              setSelfie({
                  name: "Selfie-with-ID.jpg",
                  type: 'selfie',
                  base64: base64String.split(',')[1],
                  mimeType: file.type
              });
          };
          reader.readAsDataURL(file);
      }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleScan = async () => {
    if (files.length === 0) {
      setError("Please upload candidate documents (ID, CV).");
      return;
    }
    if (!selfie) {
        setError("Verification Required: Please take a photo holding the ID card.");
        return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Combine general files with the specific selfie file
      const allDocs = [...files, selfie];
      const report = await analyzeDocuments(allDocs);
      
      const newCandidate: Candidate = {
        id: Math.random().toString(36).substring(7),
        name: report.candidateName || "Unknown Candidate",
        role: "Pending Assessment",
        status: report.riskAssessment.level === 'CRITICAL' || report.riskAssessment.level === 'HIGH' ? 'REJECTED' : 'VERIFIED',
        report: report,
        timestamp: new Date().toISOString(),
        email: email,
        emailVerified: false,
        documents: allDocs // Store docs including selfie
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
    <div className="max-w-4xl mx-auto p-8 font-sans">
      <div className="bg-white shadow-lg border-t-4 border-gold-500 p-10">
        <div className="mb-10 border-b border-stone-100 pb-6">
          <h2 className="text-3xl font-serif font-bold text-stone-900">Enrollment & Verification</h2>
          <p className="text-base text-stone-500 mt-2 font-light">Upload documents and verify identity with a live photo.</p>
        </div>

        <div className="space-y-8">
          {/* Email Input */}
           <div>
             <label className="block text-xs font-bold text-stone-500 uppercase mb-2 tracking-wide">Candidate Email Address</label>
             <input 
               type="email" 
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               placeholder="candidate@example.com"
               className="w-full border border-stone-300 p-3 text-sm focus:ring-1 focus:ring-gold-500 focus:border-gold-500 outline-none"
             />
           </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Document Upload Area */}
              <div className="border-2 border-dashed border-stone-300 bg-ivory-50 p-8 text-center hover:bg-ivory-100 transition-colors group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <input
                  type="file"
                  multiple
                  accept="image/*,application/pdf"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 text-gold-600 bg-white border border-gold-200 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-stone-900">Upload Documents</span>
                  <span className="text-[10px] uppercase text-stone-400 mt-1">ID, CV, Certificates</span>
                </div>
              </div>

              {/* Selfie Upload Area */}
              <div 
                className={`border-2 border-dashed ${selfie ? 'border-emerald-400 bg-emerald-50' : 'border-stone-300 bg-ivory-50'} p-8 text-center hover:bg-ivory-100 transition-colors group cursor-pointer relative`} 
                onClick={() => selfieInputRef.current?.click()}
              >
                <input
                  type="file"
                  accept="image/*"
                  capture="user" // Prompts camera on mobile
                  className="hidden"
                  ref={selfieInputRef}
                  onChange={handleSelfieChange}
                />
                <div className="flex flex-col items-center">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 shadow-sm ${selfie ? 'bg-emerald-100 text-emerald-600' : 'bg-white border border-gold-200 text-stone-600'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-stone-900">{selfie ? 'Photo Captured' : 'Take Photo Holding ID'}</span>
                  <span className="text-[10px] uppercase text-stone-400 mt-1">Required for Verification</span>
                  {selfie && <span className="absolute top-2 right-2 text-emerald-600">✓</span>}
                </div>
              </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest">Attached Documents</h3>
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-white p-4 border border-stone-200 shadow-sm">
                  <span className="text-sm text-stone-700 font-medium truncate">{file.name}</span>
                  <button onClick={() => handleRemoveFile(index)} className="text-stone-400 hover:text-red-600">×</button>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 relative" role="alert">
              <span className="block sm:inline font-medium text-sm">{error}</span>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-6">
            <button
              onClick={handleScan}
              disabled={isAnalyzing}
              className={`w-full flex justify-center items-center gap-3 py-4 px-6 rounded-none text-sm font-bold uppercase tracking-widest text-white transition-all shadow-md
                ${isAnalyzing ? 'bg-stone-300 cursor-not-allowed' : 'bg-gold-600 hover:bg-gold-700'}
              `}
            >
              {isAnalyzing ? 'Processing Enrollment...' : 'Verify & Enroll Candidate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
