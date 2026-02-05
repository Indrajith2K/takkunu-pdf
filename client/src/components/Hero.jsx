const Hero = () => {
    return (
        <div className="main-container flex flex-col items-center text-center mb-24">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[9px] uppercase tracking-[0.35em] font-extrabold text-slate-400 mb-10 shadow-sm">
                <span className="flex h-1.5 w-1.5 rounded-full bg-brand-coral animate-pulse"></span>
                The Gold Standard in PDF Management
            </div>

            <h1 className="serif-heading text-6xl md:text-8xl text-white mb-8 leading-[1.05] tracking-tight">
                Refining <span className="italic text-brand-purple">Digital</span> <br />
                <span className="bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">PDF Precision</span>
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl font-light leading-relaxed mb-8">
                A sophisticated suite of tools engineered for students and professionals who demand speed, security, and absolute accuracy.
            </p>
        </div>
    );
};

export default Hero;
