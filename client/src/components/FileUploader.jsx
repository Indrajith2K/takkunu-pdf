import { Upload } from 'lucide-react';

const FileUploader = ({ multiple = false, onFileSelect, accept = ".pdf", maxFiles = 1 }) => {
    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files);
        }
    };

    return (
        <div className="border-2 border-dashed border-white/10 rounded-2xl p-8 md:p-12 text-center bg-white/5 hover:bg-white/10 transition-colors relative group">
            <input
                type="file"
                multiple={multiple}
                accept={accept}
                onChange={handleChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="transform group-hover:scale-105 transition-transform duration-300">
                <Upload className="w-12 h-12 text-brand-purple mx-auto mb-4" />
                <p className="text-xl font-medium text-white mb-2">
                    {multiple ? 'Drop PDFs here' : 'Drop PDF here'}
                </p>
                <p className="text-sm text-slate-400">
                    or click to browse
                </p>
            </div>
        </div>
    );
};

export default FileUploader;
