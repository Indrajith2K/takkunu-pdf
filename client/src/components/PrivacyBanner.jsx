const PrivacyBanner = () => {
    return (
        <div className="main-container">
            <div className="glass-card rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-20 flex flex-col lg:flex-row items-center gap-8 md:gap-12 relative overflow-hidden">
                {/* Subtle internal gradient orb */}
                <div className="absolute top-0 right-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] accent-gradient opacity-[0.03] blur-[80px] md:blur-[120px]"></div>

                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 flex items-center justify-center shrink-0 border border-white/10 shadow-inner group cursor-default">
                    <span className="material-symbols-outlined text-4xl md:text-5xl text-brand-purple">verified_user</span>
                </div>

                <div className="flex-1 text-center lg:text-left z-10">
                    <h5 className="text-white font-bold text-2xl md:text-3xl mb-4 tracking-tight">Uncompromising Privacy</h5>
                    <p className="text-base md:text-lg text-slate-400 font-light leading-relaxed max-w-2xl">
                        Your security is the foundation of our suite. Files are processed entirely in memory and permanently purged after 5 minutes.
                    </p>
                </div>

                <div className="flex gap-8 md:gap-12 shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-12 w-full lg:w-auto justify-center z-10">
                    <div className="text-center">
                        <div className="serif-heading text-4xl md:text-5xl text-white mb-2 italic">0%</div>
                        <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.4em]">Retention</div>
                    </div>
                    <div className="text-center">
                        <div className="serif-heading text-4xl md:text-5xl text-white mb-2 italic">SSL</div>
                        <div className="text-[10px] text-slate-500 uppercase font-black tracking-[0.4em]">Encrypted</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyBanner;
