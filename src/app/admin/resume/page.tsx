"use client";

import { useState, useEffect, useRef } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CheckCircle2, Upload, FileText } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";

export default function AdminResume() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const docSnap = await getDoc(doc(db, "settings", "resume"));
        if (docSnap.exists()) {
          const resumeUrl = docSnap.data().url;
          setUrl(resumeUrl);
          setFilePreview(resumeUrl);
        }
      } catch (error) {
        console.error("Error fetching resume URL:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf") {
        setResumeFile(file);
        setFilePreview(file.name);
      } else {
        alert("Please upload a PDF file");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      let resumeUrl = url;

      // Upload resume if selected
      if (resumeFile) {
        resumeUrl = await uploadToCloudinary(resumeFile);
        setUrl(resumeUrl);
      }

      await setDoc(doc(db, "settings", "resume"), { url: resumeUrl });
      setMessage("Resume updated successfully!");
      setFilePreview(resumeUrl);
      setResumeFile(null);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving resume:", error);
      setMessage("Error saving resume.");
      alert("Failed to save resume. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
            <h2 className="section-title">Resume Settings</h2>
            <div className="section-line"></div>
        </div>

        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="max-w-2xl w-full mx-auto">
            <div 
              className="rounded-3xl shadow-2xl backdrop-blur-sm"
              style={{
                background: 'rgb(23, 23, 23)',
                border: '1px solid rgba(71, 85, 105, 0.3)',
                padding: '2.5rem'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between" style={{ marginBottom: '32px' }}>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
                  Update Resume
                </h3>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Resume Upload */}
                <div style={{ marginBottom: '24px' }}>
                  <label className="block text-base font-medium text-slate-300" style={{ marginBottom: '15px' }}>
                    Resume File (PDF)
                  </label>
                  <div 
                    className="relative h-48 w-full border-2 border-dashed border-slate-600/50 rounded-lg flex items-center justify-center cursor-pointer transition-colors overflow-hidden hover:border-sky-400/50"
                    style={{ background: 'rgba(30, 41, 59, 0.2)' }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {filePreview ? (
                      <div className="flex flex-col items-center justify-center p-6">
                        <FileText size={48} className="mb-3 text-sky-400" />
                        <p className="text-sm text-slate-300 font-medium mb-1">
                          {resumeFile ? resumeFile.name : "Current Resume"}
                        </p>
                        {!resumeFile && url && (
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="text-xs text-sky-400 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View Current Resume
                          </a>
                        )}
                        <p className="text-xs text-slate-500 mt-2">Click to change</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <Upload size={32} className="mb-2 text-slate-400" />
                        <p className="text-sm text-slate-400">Click to upload PDF</p>
                      </div>
                    )}
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="application/pdf" 
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* Resume URL Input (Optional) */}
                <div style={{ marginBottom: '32px' }}>
                  <label className="block text-base font-medium text-slate-300" style={{ marginBottom: '15px' }}>
                    Or Enter Resume URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full bg-slate-800/30 border border-slate-600/50 text-slate-100 text-lg rounded-lg py-3 h-12 focus:outline-none focus:ring-2 focus:ring-sky-400/30 focus:border-sky-400/50 transition-all placeholder:text-slate-400"
                    style={{ paddingLeft: '8px', paddingRight: '16px' }}
                    placeholder="https://example.com/resume.pdf"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between items-center border-t border-slate-700/50" style={{ paddingTop: '20px' }}>
                  <div className="text-sm font-medium text-sky-400 h-6">
                    {message && (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 size={16} />
                        {message}
                      </span>
                    )}
                  </div>
                  
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary"
                  >
                    {saving ? "Updating..." : "Update Resume"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
