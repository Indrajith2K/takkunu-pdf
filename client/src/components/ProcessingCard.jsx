import React, { useEffect, useState } from 'react';
import { FileText, CheckCircle, Loader2 } from 'lucide-react';

const ProcessingCard = ({ title, progress, steps = [] }) => {
    const roundedProgress = Math.floor(progress);

    // Default steps if none provided
    const defaultSteps = [
        { threshold: 30, label: "Analyzing files" },
        { threshold: 75, label: "Processing content" },
        { threshold: 100, label: "Finalizing output..." }
    ];

    const currentSteps = steps.length > 0 ? steps : defaultSteps;

    return (
        <div className="w-full max-w-2xl glass-card rounded-[32px] p-8 md:p-16 shadow-2xl relative z-10 text-center mx-auto border border-white/10">
            {/* Background Glow */}
            <div className="mb-10 relative inline-block">
                <div className="absolute inset-0 bg-brand-purple/30 blur-2xl rounded-full scale-150 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 shadow-xl">
                    <FileText className="w-12 h-12 text-brand-purple" />
                </div>
            </div>

            <h1 className="serif-heading text-3xl md:text-5xl mb-12 text-white leading-tight italic">
                {title}
            </h1>

            {/* Progress Bar */}
            <div className="space-y-4 mb-12">
                <div className="flex justify-between items-end px-1">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Processing Progress</span>
                    <span className="text-3xl font-light text-brand-purple tracking-tighter">
                        {roundedProgress}<span className="text-lg opacity-60">%</span>
                    </span>
                </div>
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden relative">
                    <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-purple via-brand-coral to-brand-purple bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite] rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20"></div>
                    </div>
                </div>
            </div>

            {/* Steps List */}
            <div className="max-w-xs md:max-w-sm mx-auto space-y-4 text-left">
                {currentSteps.map((step, idx) => (
                    <StepItem
                        key={idx}
                        completed={progress > step.threshold}
                        active={progress <= step.threshold && (idx === 0 || progress > currentSteps[idx - 1].threshold)}
                        label={step.label}
                    />
                ))}
            </div>
        </div>
    );
};

const StepItem = ({ completed, active, label }) => {
    return (
        <div className={`flex items-center gap-4 transition-colors duration-500 ${active || completed ? 'text-white' : 'text-slate-500'}`}>
            {completed ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
            ) : active ? (
                <Loader2 className="w-5 h-5 text-brand-purple animate-spin" />
            ) : (
                <div className="w-4 h-4 border-2 border-slate-700 rounded-full ml-0.5"></div>
            )}
            <span className={`text-sm tracking-wide ${active ? 'font-semibold' : 'font-medium'}`}>
                {label}
            </span>
        </div>
    );
};

export default ProcessingCard;
