"use client";

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

// Types
interface PredictionResult {
  prediction: string;
  confidence: number;
  probabilities: Record<string, number>;
}

export default function Home() {
  const { t, language } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file: File) => {
    setError(null);
    setResult(null);
    
    const validExtensions = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validExtensions.includes(file.type)) {
      setError("Format non supporté (JPG, JPEG, PNG).");
      return;
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const clearSelection = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const { token, user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/login");
    }
  }, [user, isAuthLoading, router]);

  const analyzeImage = async () => {
    if (!selectedImage || !token) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Erreur d'analyse.");
      }

      const data: PredictionResult = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Erreur de connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading || !user) {
    return <div className="min-h-screen flex items-center justify-center">...</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      
      {/* Left Column : Upload */}
      <div className="flex-1 space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">{t('upload_image')}</h2>
        </div>

        {!previewUrl ? (
          <div
            className={`relative border-2 border-dashed rounded-3xl p-12 text-center transition-all duration-200 ease-in-out cursor-pointer flex flex-col items-center justify-center min-h-[400px]
              ${isDragging ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50 hover:bg-accent/50'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} onChange={handleFileInput} accept=".jpg,.jpeg,.png" className="hidden" />
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('upload_image')}</h3>
            <p className="text-secondary mb-6 max-w-sm">JPG, JPEG, PNG</p>
          </div>
        ) : (
          <div className="bg-card rounded-3xl p-6 shadow-sm border border-border">
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-square flex items-center justify-center">
              <img src={previewUrl} alt="Preview" className="max-w-full max-h-full object-contain" />
              {isLoading && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                  <svg className="animate-spin h-10 w-10 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <p className="font-medium text-lg">{t('analyzing')}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex items-center gap-4">
              <button onClick={clearSelection} disabled={isLoading} className="px-6 py-3 rounded-xl font-medium text-secondary bg-accent hover:bg-border transition-colors disabled:opacity-50">{t('cancel')}</button>
              <button onClick={analyzeImage} disabled={isLoading} className="flex-1 px-6 py-3 rounded-xl font-medium text-primary-foreground bg-primary hover:opacity-90 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2">
                {isLoading ? '...' : t('analyze')}
              </button>
            </div>
          </div>
        )}

        {error && <div className="p-4 bg-destructive/10 text-destructive border border-destructive/20 rounded-xl flex items-start gap-3">{error}</div>}
      </div>

      {/* Right Column : Results */}
      <div className="flex-1 lg:max-w-md">
        <div className={`bg-card rounded-3xl p-8 border border-border transition-all duration-500 h-full ${result ? 'opacity-100 shadow-xl' : 'opacity-50 grayscale pointer-events-none translate-y-4'}`}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">{t('prediction_result')}</h3>
            </div>
          </div>

          {result ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <p className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">{t('prediction_result')}</p>
                <div className="text-4xl font-black text-foreground tracking-tight">{result.prediction}</div>
                <div className="mt-3">
                  <span className="bg-primary/10 text-primary text-sm font-bold px-3 py-1 rounded-full">
                    {(result.confidence * 100).toFixed(1)}% {t('confidence')}
                  </span>
                </div>
              </div>

              <div className="h-px bg-border"></div>

              <div className="space-y-4">
                {Object.entries(result.probabilities)
                  .sort(([,a], [,b]) => b - a)
                  .map(([className, prob]) => (
                  <div key={className}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className={className === result.prediction ? "font-bold text-foreground" : "text-secondary"}>{className}</span>
                      <span className={className === result.prediction ? "font-bold text-foreground" : "text-secondary"}>{(prob * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-accent rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-1000 ${className === result.prediction ? 'bg-primary' : 'bg-secondary/30'}`} style={{ width: `${prob * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center text-secondary">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" x2="22" y1="5" y2="5"/><line x1="19" x2="19" y1="2" y2="8"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
