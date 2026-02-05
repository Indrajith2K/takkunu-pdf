const PageSelector = ({ value, onChange, tool }) => {
    const placeholder = tool === 'extract-pages'
        ? 'e.g., 1-3, 5, 7-9'
        : 'e.g., 2, 4-6, 8';

    const helpText = tool === 'extract-pages'
        ? 'Enter page numbers to extract (e.g., 1-3, 5, 7-9)'
        : 'Enter page numbers to remove (e.g., 2, 4-6, 8)';

    return (
        <div className="mt-8">
            <label htmlFor="page-input" className="block text-white font-semibold mb-3 text-sm uppercase tracking-wider">
                Page Numbers:
            </label>
            <input
                id="page-input"
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple/50 focus:bg-white/10 transition-all"
            />
            <p className="text-slate-500 text-xs mt-2 font-medium">{helpText}</p>
        </div>
    );
};

export default PageSelector;
