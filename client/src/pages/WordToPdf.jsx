import { useState, useEffect } from 'react';
import { pdfApi } from '../api/pdf.api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProcessingCard from '../components/ProcessingCard';
import { Upload, FileText, X, ArrowRight } from 'lucide-react';

const WordToPdf = ({ onNavigate }) => {
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
                    if (prev >= 95) return 95;
                    return prev + Math.random() * 4; // Slower for Word conversion
                });
            }, 800);
        }
        return () => clearInterval(interval);
    }, [isProcessing]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const handleConvert = async () => {
        if (!file) {
            setError('Please select a Word file.');
            return;
        }

        setIsProcessing(true);
        setError('');

        try {
            const blob = await pdfApi.wordToPdf(file);

            setProgress(100);
            await new Promise(r => setTimeout(r, 500));

            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'takkunu-converted.pdf');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            setFile(null);
        } catch (err) {
            console.error(err);
            setError('Conversion failed. Ensure the file is a valid .docx document.');
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
                            title="Converting Word to PDF..."
                            progress={progress}
                            steps={[
                                { threshold: 20, label: "Reading DOCX file" },
                                { threshold: 60, label: "Converting layout" },
                                { threshold: 100, label: "Generating PDF..." }
                            ]}
                        />
                    ) : (
                        <>
                            <div className="text-center mb-12">
                                <h1 className="serif-heading text-4xl md:text-5xl mb-4">Word to PDF</h1>
                                <p className="text-slate-400">Convert Microsoft Word documents to PDF.</p>
                            </div>

                            <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                                {!file ? (
                                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center bg-white/5 hover:bg-white/10 transition-colors relative">
                                        <input
                                            type="file"
                                            accept=".docx"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        <Upload className="w-12 h-12 text-brand-coral mx-auto mb-4" />
                                        <p className="text-xl font-medium">Upload Word File</p>
                                        <p className="text-sm text-slate-500 mt-2">.docx files supported</p>
                                    </div>
                                ) : (
                                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-lg">{file.name}</p>
                                                <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setFile(null)}
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
                                        onClick={handleConvert}
                                        disabled={!file}
                                        className={`
                      flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest transition-all
                      ${file
                                                ? 'accent-gradient text-white hover:shadow-lg hover:scale-105'
                                                : 'bg-white/5 text-slate-500 cursor-not-allowed'}
                    `}
                                    >
                                        Convert Now
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

export default WordToPdf;
