import { useState } from 'react';

const FileUploader = ({ accept, onFileSelect, selectedFile, multiFile = false, files = [], onRemoveFile }) => {
    const [dragOver, setDragOver] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = () => {
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);

        const file = e.dataTransfer.files[0];
        if (file && validateFile(file)) {
            onFileSelect(file);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && validateFile(file)) {
            onFileSelect(file);
        }
    };

    const validateFile = (file) => {
        const maxSize = 10 * 1024 * 1024; // 10 MB
        if (file.size > maxSize) {
            alert('File size must be less than 10 MB');
            return false;
        }
        return true;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <div className="w-full">
            {/* Upload Area */}
            <div
                className={`
          relative border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer
          transition-all duration-300
          ${dragOver
                        ? 'border-brand-purple bg-brand-purple/10'
                        : 'border-white/20 bg-white/5 hover:border-brand-purple/50 hover:bg-white/10'
                    }
        `}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
            >
                <div className="flex flex-col items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                        <span className="material-symbols-outlined text-4xl text-brand-purple">upload_file</span>
                    </div>

                    <div>
                        <p className="text-white text-lg font-medium mb-2">
                            <span className="font-bold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-slate-500 text-sm">
                            {accept.split(',').map(ext => ext.trim().toUpperCase()).join(', ')} • Max 10 MB
                        </p>
                    </div>
                </div>
            </div>

            <input
                id="file-input"
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Selected Files List */}
            {(multiFile ? files.length > 0 : selectedFile) && (
                <div className="mt-6 space-y-3">
                    <h4 className="text-white font-bold text-sm uppercase tracking-wider">Selected Files:</h4>
                    {(multiFile ? files : [selectedFile]).map((file, index) => (
                        <div key={index} className="glass-card rounded-2xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-10 h-10 rounded-xl bg-brand-purple/20 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-brand-purple">description</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">{file.name}</p>
                                    <p className="text-slate-500 text-xs">{formatFileSize(file.size)}</p>
                                </div>
                            </div>
                            {multiFile && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveFile(index);
                                    }}
                                    className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors shrink-0"
                                    title="Remove file"
                                >
                                    <span className="material-symbols-outlined text-red-400 text-lg">close</span>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FileUploader;
