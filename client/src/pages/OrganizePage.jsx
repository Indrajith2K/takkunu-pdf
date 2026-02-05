import { useState } from 'react';
import FileUploader from '../components/common/FileUploader';
import ProgressIndicator from '../components/common/ProgressIndicator';
import PageSelector from '../components/organize/PageSelector';
import { organizeFile } from '../services/apiService';

const toolConfigs = {
    'merge-pdf': {
        title: 'Merge PDF',
        icon: 'join_inner',
        accept: '.pdf',
        description: 'Combine multiple PDF files into one',
        multiFile: true
    },
    'split-pdf': {
        title: 'Split PDF',
        icon: 'content_cut',
        accept: '.pdf',
        description: 'Split a PDF into separate files'
    },
    'extract-pages': {
        title: 'Extract Pages',
        icon: 'table_view',
        accept: '.pdf',
        description: 'Extract specific pages from a PDF',
        needsPageSelection: true
    },
    'remove-pages': {
        title: 'Remove Pages',
        icon: 'delete',
        accept: '.pdf',
        description: 'Remove specific pages from a PDF',
        needsPageSelection: true
    }
};

const OrganizePage = ({ tool, onBack }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedPages, setSelectedPages] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const config = toolConfigs[tool] || toolConfigs['merge-pdf'];

    const handleFileSelect = (file) => {
        if (config.multiFile) {
            setSelectedFiles(prev => [...prev, file]);
        } else {
            setSelectedFiles([file]);
        }
        setError(null);
        setSuccess(false);
    };

    const handleRemoveFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleProcess = async () => {
        if (selectedFiles.length === 0) return;

        setIsProcessing(true);
        setProgress(0);
        setError(null);
        setSuccess(false);

        try {
            setProgress(20);
            const result = await organizeFile(tool, selectedFiles, selectedPages);
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
                setSelectedFiles([]);
                setSelectedPages('');
                setSuccess(false);
                setProgress(0);
            }, 3000);
        } catch (err) {
            setError(err.message || 'Operation failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-black relative overflow-hidden">
            <div className="abstract-orb bg-brand-coral w-[600px] h-[600px] -top-20 -left-20"></div>

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
                            <span className="material-symbols-outlined text-5xl text-brand-coral">{config.icon}</span>
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
                                    selectedFile={selectedFiles[0]}
                                    multiFile={config.multiFile}
                                    files={selectedFiles}
                                    onRemoveFile={handleRemoveFile}
                                />

                                {config.needsPageSelection && selectedFiles.length > 0 && (
                                    <PageSelector
                                        value={selectedPages}
                                        onChange={setSelectedPages}
                                        tool={tool}
                                    />
                                )}

                                {selectedFiles.length > 0 && (
                                    <button
                                        onClick={handleProcess}
                                        className="w-full mt-8 px-8 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white accent-gradient rounded-2xl hover:shadow-[0_0_30px_rgba(248,113,113,0.4)] transition-all"
                                    >
                                        {config.title}
                                    </button>
                                )}
                            </>
                        )}

                        {isProcessing && (
                            <ProgressIndicator
                                progress={progress}
                                message="Processing your PDF..."
                            />
                        )}

                        {success && (
                            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-emerald-400 text-3xl">check_circle</span>
                                    <div>
                                        <p className="text-white font-bold text-lg">Success!</p>
                                        <p className="text-sm text-emerald-300">Your file has been processed and downloaded.</p>
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

export default OrganizePage;
