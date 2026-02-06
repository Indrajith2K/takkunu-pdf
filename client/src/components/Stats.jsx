import { useState, useEffect } from 'react';
import { statsApi } from '../api/stats.api';

const Stats = () => {
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch initial count
    useEffect(() => {
        const fetchCount = async () => {
            const total = await statsApi.getGlobalActivity();
            setCount(total);
            setIsLoading(false);
        };
        fetchCount();
    }, []);

    // Refresh count every 15 seconds
    useEffect(() => {
        const interval = setInterval(async () => {
            const total = await statsApi.getGlobalActivity();
            setCount(total);
        }, 15000); // 15 seconds
        return () => clearInterval(interval);
    }, []);

    const formattedCount = count.toLocaleString();
    const mainPart = formattedCount.slice(0, -3);
    const accentPart = formattedCount.slice(-3);

    return (
        <div className="max-w-[1200px] mx-auto px-6 mb-24">
            <div className="glass-card rounded-[2.5rem] py-12 px-6 flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-32 accent-gradient-bg opacity-10 blur-[80px]"></div>

                <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-coral opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-coral"></span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Live Global Activity</span>
                    </div>

                    <div className="flex items-center">
                        {isLoading ? (
                            <span className="font-serif text-6xl md:text-7xl font-bold tracking-tight text-slate-600 animate-pulse">
                                Loading...
                            </span>
                        ) : (
                            <span className="font-serif text-6xl md:text-7xl font-bold tracking-tight text-white counter-glow">
                                {mainPart}<span className="text-brand-purple">{accentPart}</span>
                            </span>
                        )}
                    </div>

                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500 mt-2">
                        Files powered by <span className="text-white italic">Takkunu PDF</span> globally
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Stats;
