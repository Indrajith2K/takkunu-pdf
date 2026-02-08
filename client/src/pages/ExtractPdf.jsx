<<<<<<< HEAD
import { useState } from 'react';
import { pdfApi } from '../api/pdf.api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Upload, FileIcon, X, ArrowRight, Loader2, Layers } from 'lucide-react';
=======
import { useState, useEffect } from 'react';
import { pdfApi } from '../api/pdf.api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProcessingCard from '../components/ProcessingCard';
import { Upload, FileIcon, X, ArrowRight, Layers } from 'lucide-react';
>>>>>>> feature/study-mode-improvements

const ExtractPdf = ({ onNavigate }) => {
    const [file, setFile] = useState(null);
    const [pages, setPages] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
<<<<<<< HEAD
    const [error, setError] = useState('');

=======
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

>>>>>>> feature/study-mode-improvements
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const handleExtract = async () => {
        if (!file) return setError('Please upload a file.');
        if (!pages.trim()) return setError('Please enter page numbers to extract.');

        setIsProcessing(true);
        setError('');

        try {
            const blob = await pdfApi.extractPdf(file, pages);

<<<<<<< HEAD
=======
            setProgress(100);
            await new Promise(r => setTimeout(r, 500));

>>>>>>> feature/study-mode-improvements
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'takkunu-extracted.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            setFile(null);
            setPages('');
        } catch (err) {
            console.error(err);
            setError('Extraction failed. Check your page range and try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-black text-white relative">
            <Navbar onNavigate={onNavigate} current="tools" />

            <main className="pt-40 pb-20 px-6">
                <div className="max-w-3xl mx-auto">
<<<<<<< HEAD
                    <div className="text-center mb-12">
                        <h1 className="serif-heading text-4xl md:text-5xl mb-4">Extract Pages</h1>
                        <p className="text-slate-400">Select specific pages to create a new PDF.</p>
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
                                <Layers className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                                <p className="text-xl font-medium">Upload PDF</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* File Info */}
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
                                            <FileIcon size={24} />
                                        </div>
                                        <div>
                                            <p className="font-medium text-lg">{file.name}</p>
                                            <button onClick={() => setFile(null)} className="text-sm text-red-400 hover:text-red-300">Change file</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Input Area */}
                                <div>
                                    <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                                        Pages to Extract
                                    </label>
                                    <input
                                        type="text"
                                        value={pages}
                                        onChange={(e) => setPages(e.target.value)}
                                        placeholder="e.g. 1, 3, 5-10"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                                    />
                                    <p className="text-xs text-slate-500 mt-2 ml-2">
                                        Tip: Use commas for single pages and hyphens for ranges.
                                    </p>
                                </div>
                            </div>
                        )}

                        {error && <div className="mt-6 text-red-400 text-sm text-center">{error}</div>}

                        <div className="mt-8 border-t border-white/10 pt-6 flex justify-end">
                            <button
                                onClick={handleExtract}
                                disabled={!file || !pages.trim() || isProcessing}
                                className={`
                  flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all
                  ${file && pages.trim() && !isProcessing
                                        ? 'accent-gradient text-white hover:shadow-lg hover:scale-105'
                                        : 'bg-white/5 text-slate-500 cursor-not-allowed'}
                `}
                            >
                                {isProcessing ? <Loader2 className="animate-spin w-4 h-4" /> : 'Extract Pages'}
                            </button>
                        </div>
                    </div>
=======
                    {isProcessing ? (
                        <ProcessingCard
                            title="Extracting pages..."
                            progress={progress}
                            steps={[
                                { threshold: 20, label: "Scanning input file" },
                                { threshold: 60, label: "Selecting specific pages" },
                                { threshold: 100, label: "Creating new PDF..." }
                            ]}
                        />
                    ) : (
                        <>
                            <div className="text-center mb-12">
                                <h1 className="serif-heading text-4xl md:text-5xl mb-4">Extract Pages</h1>
                                <p className="text-slate-400">Select specific pages to create a new PDF.</p>
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
                                        <Layers className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                                        <p className="text-xl font-medium">Upload PDF</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* File Info */}
                                        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
                                                    <FileIcon size={24} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-lg">{file.name}</p>
                                                    <button onClick={() => setFile(null)} className="text-sm text-red-400 hover:text-red-300">Change file</button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Input Area */}
                                        <div>
                                            <label className="block text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
                                                Pages to Extract
                                            </label>
                                            <input
                                                type="text"
                                                value={pages}
                                                onChange={(e) => setPages(e.target.value)}
                                                placeholder="e.g. 1, 3, 5-10"
                                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple transition-all"
                                            />
                                            <p className="text-xs text-slate-500 mt-2 ml-2">
                                                Tip: Use commas for single pages and hyphens for ranges.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {error && <div className="mt-6 text-red-400 text-sm text-center">{error}</div>}

                                <div className="mt-8 border-t border-white/10 pt-6 flex justify-end">
                                    <button
                                        onClick={handleExtract}
                                        disabled={!file || !pages.trim()}
                                        className={`
                      flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all
                      ${file && pages.trim()
                                                ? 'accent-gradient text-white hover:shadow-lg hover:scale-105'
                                                : 'bg-white/5 text-slate-500 cursor-not-allowed'}
                    `}
                                    >
                                        Extract Pages
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
>>>>>>> feature/study-mode-improvements
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ExtractPdf;
