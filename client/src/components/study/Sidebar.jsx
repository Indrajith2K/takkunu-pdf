import React, { useRef } from 'react';
import { useStudy } from '../../context/StudyContext';
import { parseDocument } from '../../utils/study/documentParser';
import { chunkText } from '../../utils/study/textChunking';

const Sidebar = () => {
    const { documents, addDocument, removeDocument, setIsProcessing } = useStudy();
    const fileInputRef = useRef(null);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setIsProcessing(true);

        for (const file of files) {
            try {
                // Parse document
                const { text, pageCount, isScanned } = await parseDocument(file);

                // Check if document is scanned or has no text
                if (isScanned || !text || text.trim().length < 20) {
                    alert(`${file.name}: This document appears to be scanned or contains no selectable text. Text extraction is not available.`);
                    continue;
                }

                // Chunk the text
                const chunks = chunkText(text, file.name, file.name);

                // Ensure chunks is an array
                if (!Array.isArray(chunks) || chunks.length === 0) {
                    alert(`${file.name}: Failed to process document text.`);
                    continue;
                }

                // Create document object with text and chunks
                const doc = {
                    id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    name: file.name,
                    type: file.name.split('.').pop().toLowerCase(),
                    pages: pageCount,
                    text: text, // Store full text
                    chunks: chunks, // Store chunks array
                    isVerified: true,
                    uploadedAt: Date.now()
                };

                // Add to state
                addDocument(doc);

            } catch (error) {
                console.error('File processing error:', error);
                alert(`Failed to process ${file.name}: ${error.message}`);
            }
        }

        setIsProcessing(false);
        e.target.value = ''; // Reset input
    };

    const handleRemoveDocument = (docId) => {
        if (confirm('Remove this document from your study session?')) {
            removeDocument(docId);
        }
    };

    return (
        <aside className="w-72 bg-brand-sidebar border-r border-white/5 flex flex-col shrink-0">
            <div className="p-6">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.ppt,.pptx"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                />
                <button
                    onClick={handleUploadClick}
                    className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-3 transition-all group"
                >
                    <span className="material-symbols-outlined text-sm text-brand-purple">add</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Upload Documents</span>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-4 space-y-4">
                <div className="px-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4">
                        Library ({documents.length})
                    </h3>

                    {documents.length === 0 ? (
                        <div className="text-center py-8">
                            <span className="material-symbols-outlined text-4xl text-slate-700 mb-2">folder_open</span>
                            <p className="text-xs text-slate-600">No documents yet</p>
                            <p className="text-[10px] text-slate-700 mt-1">Upload PDF, DOC, or PPT files</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {documents.map((doc, idx) => (
                                <div
                                    key={doc.id}
                                    className={`glass-card p-3 rounded-xl cursor-pointer hover:border-brand-purple/30 transition-all group ${idx === 0 ? 'border-l-2 border-l-brand-purple bg-brand-purple/5' : ''}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className={`material-symbols-outlined text-xl ${doc.type === 'pdf' ? 'text-rose-400' :
                                            doc.type.includes('ppt') ? 'text-orange-400' : 'text-blue-400'
                                            }`}>
                                            {doc.type === 'pdf' ? 'picture_as_pdf' : doc.type.includes('ppt') ? 'slideshow' : 'description'}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-semibold truncate ${idx === 0 ? 'text-white' : 'text-slate-300'}`}>
                                                {doc.name}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] text-slate-500">
                                                    {doc.pages} {doc.type === 'pdf' ? 'pages' : doc.type.includes('ppt') ? 'slides' : 'pages'}
                                                </span>
                                                {doc.isVerified && (
                                                    <span className="material-symbols-outlined text-[10px] text-emerald-500">verified_user</span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveDocument(doc.id)}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                                        >
                                            <span className="material-symbols-outlined text-sm text-red-400">close</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6 border-t border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-3 text-slate-500 text-[10px] font-medium uppercase tracking-widest mb-2">
                    <span className="material-symbols-outlined text-sm">lock</span>
                    Private Workspace
                </div>
                <p className="text-[9px] text-slate-700 leading-relaxed">
                    Files stay in browser memory. Nothing is stored or uploaded to servers.
                </p>
            </div>
        </aside>
    );
};

export default Sidebar;
