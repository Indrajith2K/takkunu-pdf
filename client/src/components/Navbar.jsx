import { useState, useEffect } from 'react';

const Navbar = ({ onNavigate, current }) => {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Tools', id: 'home' },
        { name: 'Study', id: 'study' },
        { name: 'Features', id: 'features' },
        { name: 'Privacy', id: 'privacy' },
        { name: 'About', id: 'about' }
    ];

    const handleNavClick = (pageId) => {
        if (onNavigate) onNavigate(pageId);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-2 md:py-4' : 'py-4 md:py-8'
                    }`}
            >
                <div className="w-full px-4 md:px-6 max-w-7xl mx-auto">
                    <div className="bg-brand-charcoal/90 backdrop-blur-xl border border-white/10 rounded-full px-4 md:px-6 py-3 md:py-3.5 flex items-center justify-between shadow-2xl">
                        {/* Logo */}
                        <div
                            onClick={() => handleNavClick('home')}
                            className="flex items-center gap-2 md:gap-3 group cursor-pointer flex-shrink-0"
                        >
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/95 p-0.5 shadow-lg group-hover:scale-105 transition-transform flex items-center justify-center">
                                <img
                                    src="/logo.png"
                                    alt="Takkunu PDF Logo"
                                    className="w-full h-full rounded-lg object-cover"
                                />
                            </div>
                            <span className="text-xs md:text-sm font-black tracking-[0.15em] md:tracking-[0.2em] text-white uppercase italic hidden sm:inline-block">
                                Takkunu PDF
                            </span>
                        </div>

                        {/* Desktop Links */}
                        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => handleNavClick(link.id)}
                                    className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors whitespace-nowrap ${current === link.id ? 'text-white' : 'text-slate-400 hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                </button>
                            ))}
                        </div>

                        {/* CTA & Mobile Toggle */}
                        <div className="flex items-center gap-2 md:gap-4">
                            <button
                                onClick={() => handleNavClick('home')}
                                className="hidden md:block px-4 lg:px-6 py-2 lg:py-2.5 text-[9px] lg:text-[10px] font-bold uppercase tracking-[0.2em] text-white accent-gradient rounded-full hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all active:scale-95 whitespace-nowrap"
                            >
                                Start Now
                            </button>

                            {/* Mobile Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden w-9 h-9 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors flex-shrink-0"
                                aria-label="Toggle menu"
                            >
                                <span className="material-symbols-outlined text-xl md:text-2xl">
                                    {isMobileMenuOpen ? 'close' : 'menu'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-brand-black/95 backdrop-blur-3xl z-40 transition-all duration-500 flex items-center justify-center ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                    }`}
            >
                <div className="flex flex-col items-center gap-6 md:gap-8 text-center p-6">
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={() => handleNavClick(link.id)}
                            className={`text-xl md:text-2xl font-serif font-medium transition-colors ${current === link.id ? 'text-white' : 'text-slate-500 hover:text-white'
                                }`}
                        >
                            {link.name}
                        </button>
                    ))}
                    <div className="w-12 h-[1px] bg-white/10 my-2 md:my-4"></div>
                    <button
                        onClick={() => handleNavClick('home')}
                        className="px-8 md:px-10 py-3 md:py-4 text-xs font-bold uppercase tracking-[0.25em] text-white accent-gradient rounded-full shadow-lg hover:scale-105 transition-transform"
                    >
                        Launch Studio
                    </button>
                </div>
            </div>
        </>
    );
};

export default Navbar;
