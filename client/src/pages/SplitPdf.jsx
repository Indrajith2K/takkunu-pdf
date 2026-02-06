import { useState, useEffect } from 'react';
import { pdfApi } from '../api/pdf.api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProcessingCard from '../components/ProcessingCard';
import { Upload, FileIcon, X, ArrowRight } from 'lucide-react';

const SplitPdf = ({ onNavigate }) => {
    const [file, setFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        let interval;
        if (isProcessing) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return 90;
                    return prev + Math.random() * 8;
                });
            }, 700);
        }
        return () => clearInterval(interval);
    }, [isProcessing]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const removeFile = () => {
        setFile(null);
    };

    const handleSplit = async () => {
        if (!file) {
            setError('Please select a PDF file first.');
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            const blob = await pdfApi.splitPdf(file);

            setProgress(100);
            await new Promise(r => setTimeout(r, 500));

            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'takkunu-split.zip');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            setFile(null);
        } catch (err) {
            console.error(err);
            setError('Failed to split PDF. The file might be corrupted.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-black text-white relative">
            <Navbar onNavigate={onNavigate} current="tools" />

            <main className="pt-40 pb-20 px-6">
                <div className="max-w-3xl mx-auto">
                    {isProcessing ? (
                        <ProcessingCard
                            title="Splitting your PDF..."
                            progress={progress}
                            steps={[
                                { threshold: 20, label: "Analyzing pages" },
                                { threshold: 60, label: "Applying split logic" },
                                { threshold: 100, label: "Finalizing output..." }
                            ]}
                        />
                    ) : (
                        <>
                            <div className="text-center mb-12">
                                <h1 className="serif-heading text-4xl md:text-5xl mb-4">Split PDF</h1>
                                <p className="text-slate-400">Extract every page into a separate PDF file.</p>
                            </div>

                            <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                                {!file ? (
                                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center bg-white/5 hover:bg-white/10 transition-colors relative">
                                        <input
                                            type="file"
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <Upload className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                                        <p className="text-xl font-medium">Upload PDF to Split</p>
                                        <p className="text-sm text-slate-500 mt-2">Maximum file size 50MB</p>
                                    </div>
                                ) : (
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
                                                <FileIcon size={24} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-lg">{file.name}</p>
                                                <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={removeFile}
                                            className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                )}

                                {error && (
                                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="mt-8 border-t border-white/10 pt-6 flex justify-end">
                                    <button
                                        onClick={handleSplit}
                                        disabled={!file}
                                        className={`
                      flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all
                      ${file
                                                ? 'accent-gradient text-white hover:shadow-lg hover:scale-105'
                                                : 'bg-white/5 text-slate-500 cursor-not-allowed'}
                    `}
                                    >
                                        Split All Pages
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default SplitPdf;
