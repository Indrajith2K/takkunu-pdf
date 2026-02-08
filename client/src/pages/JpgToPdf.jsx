<<<<<<< HEAD
import { useState } from 'react';
import { pdfApi } from '../api/pdf.api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Upload, Image as ImageIcon, X, ArrowRight, Loader2 } from 'lucide-react';
=======
import { useState, useEffect } from 'react';
import { pdfApi } from '../api/pdf.api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProcessingCard from '../components/ProcessingCard';
import { Upload, Image as ImageIcon, X, ArrowRight } from 'lucide-react';
>>>>>>> feature/study-mode-improvements

const JpgToPdf = ({ onNavigate }) => {
    const [files, setFiles] = useState([]);
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
                    if (prev >= 95) return 95;
                    return prev + Math.random() * 5;
                });
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isProcessing]);

>>>>>>> feature/study-mode-improvements
    const handleFileChange = (e) => {
        if (e.target.files) {
            setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
            setError('');
        }
    };

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleConvert = async () => {
        if (files.length === 0) {
            setError('Please select at least one image file.');
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            const blob = await pdfApi.jpgToPdf(files);

<<<<<<< HEAD
=======
            setProgress(100);
            await new Promise(r => setTimeout(r, 500));

>>>>>>> feature/study-mode-improvements
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'takkunu-images.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            setFiles([]);
        } catch (err) {
            console.error(err);
            setError('Conversion failed. Please try again.');
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
                        <h1 className="serif-heading text-4xl md:text-5xl mb-4">JPG to PDF</h1>
                        <p className="text-slate-400">Convert your images into a single PDF document.</p>
                    </div>

                    <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                        <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/5 hover:bg-white/10 transition-colors relative">
                            <input
                                type="file"
                                multiple
                                accept="image/jpeg, image/png, image/jpg"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                            <p className="text-lg font-medium">Drop Images here</p>
                            <p className="text-sm text-slate-500 mt-2">JPG, PNG supported (Max 10 files)</p>
                        </div>

                        {files.length > 0 && (
                            <div className="mt-8 space-y-3">
                                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Selected Images ({files.length})</h3>
                                {files.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                <ImageIcon size={16} />
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

                        {error && (
                            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <div className="mt-8 border-t border-white/10 pt-6 flex justify-end">
                            <button
                                onClick={handleConvert}
                                disabled={files.length === 0 || isProcessing}
                                className={`
                  flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all
                  ${files.length > 0 && !isProcessing
                                        ? 'accent-gradient text-white hover:shadow-lg hover:scale-105'
                                        : 'bg-white/5 text-slate-500 cursor-not-allowed'}
                `}
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin w-4 h-4" />
                                        Converting...
                                    </>
                                ) : (
                                    <>
                                        Convert to PDF
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
=======
                    {isProcessing ? (
                        <ProcessingCard
                            title="Creating PDF..."
                            progress={progress}
                            steps={[
                                { threshold: 20, label: "Processing images" },
                                { threshold: 60, label: "Building pages" },
                                { threshold: 100, label: "Compressing output..." }
                            ]}
                        />
                    ) : (
                        <>
                            <div className="text-center mb-12">
                                <h1 className="serif-heading text-4xl md:text-5xl mb-4">JPG to PDF</h1>
                                <p className="text-slate-400">Convert your images into a single PDF document.</p>
                            </div>

                            <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                                <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/5 hover:bg-white/10 transition-colors relative">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/jpeg, image/png, image/jpg"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <Upload className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                                    <p className="text-lg font-medium">Drop Images here</p>
                                    <p className="text-sm text-slate-500 mt-2">JPG, PNG supported (Max 10 files)</p>
                                </div>

                                {files.length > 0 && (
                                    <div className="mt-8 space-y-3">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Selected Images ({files.length})</h3>
                                        {files.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                        <ImageIcon size={16} />
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

                                {error && (
                                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 rounded-xl text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="mt-8 border-t border-white/10 pt-6 flex justify-end">
                                    <button
                                        onClick={handleConvert}
                                        disabled={files.length === 0}
                                        className={`
                      flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all
                      ${files.length > 0
                                                ? 'accent-gradient text-white hover:shadow-lg hover:scale-105'
                                                : 'bg-white/5 text-slate-500 cursor-not-allowed'}
                    `}
                                    >
                                        Convert to PDF
                                        <ArrowRight className="w-4 h-4" />
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

export default JpgToPdf;
