const FeatureSection = ({ title, subtitle, icon, accentColor, items, onNavigate }) => {
    return (
        <section className="main-container mb-32">
            <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <span className={`material-symbols-outlined ${accentColor}`}>{icon}</span>
                        <h3 className="text-[12px] font-black uppercase tracking-[0.45em] text-white">{title}</h3>
                    </div>
                    <p className="text-[10px] text-slate-500 tracking-widest uppercase font-bold">{subtitle}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        onClick={() => onNavigate && item.toolId && onNavigate(item.category, item.toolId)}
                        className="glass-card rounded-[2.5rem] p-10 group hover:-translate-y-2 hover:bg-white/10 hover:border-brand-purple/20 cursor-pointer"
                    >
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/5 group-hover:border-white/10 transition-colors">
                            <span className={`material-symbols-outlined text-3xl ${item.color}`}>{item.icon}</span>
                        </div>
                        <h4 className="text-white font-bold text-lg mb-4 tracking-tight">{item.title}</h4>
                        <p className="text-[13px] text-slate-500 leading-relaxed font-medium group-hover:text-slate-400 transition-colors">
                            {item.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeatureSection;
