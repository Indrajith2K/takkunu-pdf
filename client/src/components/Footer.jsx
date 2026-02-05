const Footer = () => {
    const sections = [
        {
            title: 'Tools',
            links: ['Convert PDF', 'Organize PDF', 'All Tools']
        },
        {
            title: 'Resources',
            links: ['Documentation', 'API', 'Support']
        },
        {
            title: 'Legal',
            links: ['Privacy', 'Terms', 'Security']
        },
        {
            title: 'About',
            links: ['Our Story', 'GitHub', 'Contact']
        }
    ];

    return (
        <footer className="border-t border-white/5 pt-32 pb-16 bg-[#08080A]">
            <div className="main-container">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-16 mb-32">
                    {/* Logo Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-10 group cursor-pointer">
                            <div className="w-10 h-10 rounded-lg bg-white/95 p-0.5 shadow-lg flex items-center justify-center">
                                <img
                                    src="/logo.png"
                                    alt="Takkunu PDF Logo"
                                    className="w-full h-full rounded-md object-cover"
                                />
                            </div>
                            <span className="font-black text-white uppercase italic tracking-[0.3em] text-lg">Takkunu PDF</span>
                        </div>
                        <p className="text-sm text-slate-500 max-w-xs leading-relaxed mb-12 font-medium">
                            Student-first PDF utility. Built for speed, secured for life, designed for excellence. Free forever.
                        </p>
                        <div className="flex gap-5">
                            {['public', 'mail'].map((icon) => (
                                <a
                                    key={icon}
                                    href="#"
                                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all"
                                >
                                    <span className="material-symbols-outlined text-xl">{icon}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link Columns */}
                    {sections.map((section) => (
                        <div key={section.title}>
                            <h6 className="text-[11px] uppercase tracking-[0.45em] font-black text-white mb-10">{section.title}</h6>
                            <ul className="space-y-5 text-xs font-semibold text-slate-500">
                                {section.links.map((link) => (
                                    <li key={link}>
                                        <a href="#" className="hover:text-white transition-colors block">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Copyright Area */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-16 text-[10px] uppercase tracking-[0.35em] font-black text-slate-600">
                    <p>© 2026 TAKKUNU PDF. ALL RIGHTS RESERVED.</p>
                    <div className="flex items-center gap-3">
                        BUILT WITH <span className="text-white italic tracking-[0.1em]">❤️ FOR STUDENTS</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
