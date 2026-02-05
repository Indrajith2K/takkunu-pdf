import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const FeaturesPage = ({ onNavigate }) => {
    const features = [
        {
            title: "Conversion Precision",
            description: "Our core engine retains 99.9% of layout formatting during PDF to Word conversions, preserving complex tables, custom fonts, and multi-column designs.",
            icon: "verified",
            color: "text-brand-purple"
        },
        {
            title: "Privacy First Architecture",
            description: "Files are processed in RAM and practically evaporate after 5 minutes. We don't just delete files; we wipe the memory sectors they occupied.",
            icon: "security",
            color: "text-brand-coral"
        },
        {
            title: "Universal Compatibility",
            description: "Works flawlessly across all modern browsers. No plugins, no installations, no version conflicts. Just pure web-based utility.",
            icon: "public",
            color: "text-blue-400"
        },
        {
            title: "Batch Processing",
            description: "Handle multiple files simultaneously. Merge dozens of PDFs or extract pages from massive documents in seconds.",
            icon: "library_add",
            color: "text-emerald-400"
        }
    ];

    return (
        <div className="min-h-screen bg-brand-black relative">
            <Navbar onNavigate={onNavigate} current="features" />

            <main className="pt-40 pb-20 px-6">
                <div className="main-container">
                    {/* Header */}
                    <div className="text-center max-w-3xl mx-auto mb-24">
                        <span className="inline-block py-1 px-3 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
                            System Capabilities
                        </span>
                        <h1 className="serif-heading text-5xl md:text-7xl text-white mb-8">
                            Engineered for <br />
                            <span className="bg-gradient-to-r from-brand-purple to-brand-coral bg-clip-text text-transparent">Excellence</span>
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed">
                            Explore the technical capabilities that make Takkunu PDF the preferred choice for professionals.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
                        {features.map((feature, idx) => (
                            <div key={idx} className="glass-card p-10 rounded-[2.5rem] hover:bg-white/10 transition-colors">
                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5">
                                        <span className={`material-symbols-outlined text-3xl ${feature.color}`}>{feature.icon}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl text-white font-serif mb-4">{feature.title}</h3>
                                        <p className="text-slate-400 leading-relaxed font-light">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Call to Action */}
                    <div className="glass-card rounded-[3rem] p-12 text-center relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl text-white font-serif mb-6">Ready to experience precision?</h2>
                            <button
                                onClick={() => onNavigate('home')}
                                className="px-8 py-4 bg-white text-brand-black font-bold uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
                            >
                                Launch Tools
                            </button>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-brand-purple/20 to-brand-coral/20 blur-3xl opacity-50"></div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FeaturesPage;
