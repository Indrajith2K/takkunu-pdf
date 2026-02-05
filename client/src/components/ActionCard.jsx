const ActionCard = ({ onNavigate }) => {
    return (
        <div className="relative group w-full max-w-2xl">
            {/* Glow Effect Background */}
            <div className="absolute -inset-1 bg-gradient-to-br from-brand-purple to-brand-coral rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

            <div
                onClick={() => onNavigate && onNavigate('merge-pdf')}
                className="relative bg-brand-charcoal border border-white/10 rounded-[2rem] p-12 md:p-20 text-center cursor-pointer hover:border-brand-purple/40 transition-all shadow-2xl"
            >
                <div className="mb-10 flex justify-center">
                    <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center relative border border-white/5 group-hover:bg-white/10 transition-colors">
                        <span className="material-symbols-outlined text-5xl text-brand-purple group-hover:scale-110 transition-transform duration-500">join_inner</span>
                    </div>
                </div>

                <h2 className="serif-heading text-4xl text-white mb-4">Merge PDF Documents</h2>
                <p className="text-slate-500 mb-12 text-sm font-medium">
                    Click to start or <span className="text-white underline underline-offset-8 decoration-slate-600 hover:decoration-white transition-all">browse files</span>
                </p>

                <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold border-t border-white/5 pt-10">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">shield</span>
                        <span>Encrypted</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">bolt</span>
                        <span>Fast</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                        <span>Auto-purge</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionCard;
