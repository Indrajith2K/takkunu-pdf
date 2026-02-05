const ProgressIndicator = ({ progress, message }) => {
    return (
        <div className="py-16 text-center">
            {/* Animated spinner */}
            <div className="flex justify-center mb-8">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
                    <div
                        className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand-purple animate-spin"
                        style={{ animationDuration: '1s' }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl text-brand-purple">autorenew</span>
                    </div>
                </div>
            </div>

            <p className="text-white text-xl font-semibold mb-8">{message}</p>

            {/* Progress bar */}
            <div className="max-w-md mx-auto">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full accent-gradient transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-slate-400 text-sm mt-3 font-medium">{progress}% Complete</p>
            </div>

            {/* Helpful tip */}
            <div className="mt-12 p-4 bg-white/5 border border-white/10 rounded-xl max-w-md mx-auto">
                <p className="text-xs text-slate-400">
                    <span className="material-symbols-outlined text-sm inline align-middle mr-1">info</span>
                    Your file is being processed securely and will auto-delete in 5 minutes
                </p>
            </div>
        </div>
    );
};

export default ProgressIndicator;
