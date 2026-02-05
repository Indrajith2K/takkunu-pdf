import { useState } from 'react';
import { pdfApi } from '../api/pdf.api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Upload, FileIcon, X, ArrowRight, Loader2 } from 'lucide-react';

const MergePdf = ({ onNavigate }) => {
    const [files, setFiles] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        if (e.target.files) {
            setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
            setError('');
        }
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleMerge = async () => {
        if (files.length < 2) {
            setError('Please select at least 2 PDF files to merge.');
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            const blob = await pdfApi.mergePdf(files);

            // Create download link
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'takkunu-merged.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            // Reset
            setFiles([]);
        } catch (err) {
            console.error(err);
            setError('Failed to merge PDFs. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-black text-white relative">
            <Navbar onNavigate={onNavigate} current="tools" />

            <main className="pt-40 pb-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="serif-heading text-4xl md:text-5xl mb-4">Merge PDFs</h1>
                        <p className="text-slate-400">Combine multiple PDF files into one document.</p>
                    </div>

                    <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                        {/* Upload Area */}
                        <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/5 hover:bg-white/10 transition-colors relative">
                            <input
                                type="file"
                                multiple
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className="w-10 h-10 text-brand-purple mx-auto mb-4" />
                            <p className="text-lg font-medium">Drop PDFs here or click to upload</p>
                            <p className="text-sm text-slate-500 mt-2">Maximum 20 files allowed</p>
                        </div>

                        {/* File List */}
                        {files.length > 0 && (
                            <div className="mt-8 space-y-3">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Selected Files ({files.length})</h3>
                                {files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center text-red-400">
                                                <FileIcon size={16} />
                                            </div>
                                            <span className="truncate text-sm font-medium">{file.name}</span>
                                        </div>
                                        <button
                                            onClick={() => removeFile(index)}
                                            className="text-slate-500 hover:text-white transition-colors"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        {/* Action Bar */}
                        <div className="mt-8 border-t border-white/10 pt-6 flex justify-end">
                            <button
                                onClick={handleMerge}
                                disabled={files.length < 2 || isProcessing}
                                className={`
                  flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all
                  ${files.length >= 2 && !isProcessing
                                        ? 'accent-gradient text-white hover:shadow-lg hover:scale-105'
                                        : 'bg-white/5 text-slate-500 cursor-not-allowed'}
                `}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin w-4 h-4" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Merge PDFs
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default MergePdf;
