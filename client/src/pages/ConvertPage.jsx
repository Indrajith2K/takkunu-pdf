import { useState } from 'react';
import FileUploader from '../components/common/FileUploader';
import ProgressIndicator from '../components/common/ProgressIndicator';
import { convertFile } from '../services/apiService';

const toolConfigs = {
    'pdf-to-word': {
        title: 'PDF to Word',
        icon: 'description',
        accept: '.pdf',
        description: 'Convert your PDF to an editable Word document',
        note: 'Works best with text-based PDFs'
    },
    'word-to-pdf': {
        title: 'Word to PDF',
        icon: 'description',
        accept: '.doc,.docx',
        description: 'Convert your Word document to PDF format'
    },
    'jpg-to-pdf': {
        title: 'JPG to PDF',
        icon: 'image',
        accept: '.jpg,.jpeg',
        description: 'Convert your images to PDF'
    },
    'pdf-to-jpg': {
        title: 'PDF to JPG',
        icon: 'picture_as_pdf',
        accept: '.pdf',
        description: 'Convert PDF pages to images'
    }
};

const ConvertPage = ({ tool, onBack }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const config = toolConfigs[tool] || toolConfigs['pdf-to-word'];

    const handleFileSelect = (file) => {
        setSelectedFile(file);
        setError(null);
        setSuccess(false);
    };

    const handleConvert = async () => {
        if (!selectedFile) return;

        setIsProcessing(true);
        setProgress(0);
        setError(null);
        setSuccess(false);

        try {
            setProgress(20);
            const result = await convertFile(tool, selectedFile);
            setProgress(100);

            const url = window.URL.createObjectURL(result.blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = result.filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            setSuccess(true);
            setTimeout(() => {
                setSelectedFile(null);
                setSuccess(false);
                setProgress(0);
            }, 3000);
        } catch (err) {
            setError(err.message || 'Conversion failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-black relative overflow-hidden">
            <div className="abstract-orb bg-brand-purple w-[600px] h-[600px] -top-20 -left-20"></div>

            {/* Header */}
            <header className="pt-32 pb-16 border-b border-white/5">
                <div className="main-container">
                    <button
                        onClick={onBack}
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-12 text-sm font-medium group"
                    >
                        <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        Back to Tools
                    </button>

                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white/5 border border-white/10 mb-6">
                            <span className="material-symbols-outlined text-5xl text-brand-purple">{config.icon}</span>
                        </div>
                        <h1 className="serif-heading text-5xl md:text-6xl text-white mb-4 tracking-tight">{config.title}</h1>
                        <p className="text-lg text-slate-400 font-light">{config.description}</p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="py-16">
                <div className="main-container max-w-3xl">
                    <div className="glass-card rounded-[2rem] p-12">
                        {!isProcessing && !success && (
                            <>
                                <FileUploader
                                    accept={config.accept}
                                    onFileSelect={handleFileSelect}
                                    selectedFile={selectedFile}
                                />

                                {config.note && (
                                    <div className="mt-6 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                                        <div className="flex items-start gap-3">
                                            <span className="material-symbols-outlined text-blue-400 text-xl">info</span>
                                            <div>
                                                <p className="text-sm text-blue-300 font-semibold mb-1">Note</p>
                                                <p className="text-xs text-slate-400">{config.note}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {selectedFile && (
                                    <button
                                        onClick={handleConvert}
                                        className="w-full mt-8 px-8 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white accent-gradient rounded-2xl hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all"
                                    >
                                        Convert File
                                    </button>
                                )}
                            </>
                        )}

                        {isProcessing && (
                            <ProgressIndicator
                                progress={progress}
                                message="Converting your file..."
                            />
                        )}

                        {success && (
                            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-emerald-400 text-3xl">check_circle</span>
                                    <div>
                                        <p className="text-white font-bold text-lg">Success!</p>
                                        <p className="text-sm text-emerald-300">Your file has been converted and downloaded.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {error && (
                            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-red-400 text-3xl">error</span>
                                    <div>
                                        <p className="text-white font-bold text-lg">Error</p>
                                        <p className="text-sm text-red-300">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ConvertPage;
