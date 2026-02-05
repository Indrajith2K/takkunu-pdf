import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const AboutPage = ({ onNavigate }) => {
    return (
        <div className="min-h-screen bg-brand-black relative">
            <Navbar onNavigate={onNavigate} current="about" />

            <main className="pt-40 pb-20 px-6">
                <div className="main-container max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-20">
                        <span className="inline-block py-1 px-3 rounded-full bg-brand-coral/10 border border-brand-coral/20 text-brand-coral text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
                            Our Story
                        </span>
                        <h1 className="serif-heading text-5xl md:text-7xl text-white mb-8">
                            Why Takkunu PDF <br />
                            <span className="text-brand-purple italic">Exists</span>
                        </h1>
                    </div>

                    {/* Main Content */}
                    <div className="space-y-16">
                        {/* Intro Section */}
                        <section className="glass-card p-10 md:p-12 rounded-[2.5rem]">
                            <p className="text-xl md:text-2xl text-white font-light leading-relaxed mb-6">
                                Takkunu PDF was built with one simple idea:
                            </p>
                            <p className="text-2xl md:text-3xl text-white font-bold leading-relaxed">
                                Students don't need more PDF tools.<br />
                                They need <span className="text-brand-purple italic">fewer tools</span> that actually work.
                            </p>
                        </section>

                        {/* Problem Statement */}
                        <section>
                            <p className="text-lg text-slate-300 leading-relaxed mb-6">
                                Most PDF websites today are packed with features, pop-ups, limits, ads, and forced logins.
                                What starts as a "free tool" quickly turns into frustration — especially for students who
                                just want to submit an assignment or edit a document on time.
                            </p>
                            <p className="text-lg text-white font-semibold">
                                We wanted something different.
                            </p>
                        </section>

                        {/* Built for Students */}
                        <section className="glass-card p-10 md:p-12 rounded-[2.5rem] border-l-4 border-brand-purple">
                            <h2 className="text-3xl text-white font-bold mb-6 serif-heading">
                                Built for students, not for extraction
                            </h2>
                            <p className="text-lg text-slate-300 leading-relaxed mb-8">
                                Takkunu PDF is made for the student community.
                            </p>
                            <p className="text-base text-slate-400 mb-4">That means:</p>
                            <ul className="space-y-4 text-lg text-slate-300">
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-brand-coral mt-1 flex-shrink-0">check_circle</span>
                                    <span>No forced sign-ups</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-brand-coral mt-1 flex-shrink-0">check_circle</span>
                                    <span>No watermarks</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-brand-coral mt-1 flex-shrink-0">check_circle</span>
                                    <span>No ads interrupting your work</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-brand-coral mt-1 flex-shrink-0">check_circle</span>
                                    <span>No pretending everything is "AI magic"</span>
                                </li>
                            </ul>
                            <p className="text-lg text-slate-300 leading-relaxed mt-8">
                                We focus only on core PDF tasks that students actually use, and we make them fast, simple, and predictable.
                            </p>
                            <div className="mt-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                                <p className="text-base text-slate-400 leading-relaxed italic">
                                    If a feature has limitations, we say it clearly.<br />
                                    If something won't work well (like scanned PDFs), we don't hide it.<br />
                                    <span className="text-white font-semibold not-italic">Honesty matters.</span>
                                </p>
                            </div>
                        </section>

                        {/* Privacy Section */}
                        <section className="glass-card p-10 md:p-12 rounded-[2.5rem] border-l-4 border-emerald-400">
                            <h2 className="text-3xl text-white font-bold mb-6 serif-heading">
                                Privacy is not a feature — it's the default
                            </h2>
                            <p className="text-lg text-slate-300 leading-relaxed mb-6">
                                Your files are:
                            </p>
                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="text-center p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <span className="material-symbols-outlined text-4xl text-emerald-400 mb-3 block">speed</span>
                                    <p className="text-white font-semibold">Processed temporarily</p>
                                </div>
                                <div className="text-center p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <span className="material-symbols-outlined text-4xl text-emerald-400 mb-3 block">block</span>
                                    <p className="text-white font-semibold">Never stored long-term</p>
                                </div>
                                <div className="text-center p-6 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <span className="material-symbols-outlined text-4xl text-emerald-400 mb-3 block">delete_forever</span>
                                    <p className="text-white font-semibold">Auto-deleted in minutes</p>
                                </div>
                            </div>
                            <div className="space-y-3 text-lg text-slate-300">
                                <p>We don't read your documents.</p>
                                <p>We don't track their content.</p>
                                <p>We don't build profiles around your files.</p>
                            </div>
                            <p className="text-xl text-white font-semibold mt-6">
                                You upload, convert, download — and that's it.
                            </p>
                        </section>

                        {/* Why Takkunu */}
                        <section>
                            <h2 className="text-3xl text-white font-bold mb-6 serif-heading">
                                Why "takkunu"?
                            </h2>
                            <p className="text-2xl text-brand-purple font-semibold italic mb-6">
                                "Takkunu" means instantly.
                            </p>
                            <p className="text-lg text-slate-300 leading-relaxed mb-6">
                                That's how PDF tools should feel:
                            </p>
                            <ul className="space-y-3 text-lg text-slate-300 ml-6">
                                <li className="list-disc">No learning curve</li>
                                <li className="list-disc">No waiting games</li>
                                <li className="list-disc">No unnecessary steps</li>
                            </ul>
                            <p className="text-xl text-white font-semibold mt-6">
                                Just upload → convert → move on with your work.
                            </p>
                        </section>

                        {/* Not Everything */}
                        <section className="glass-card p-10 md:p-12 rounded-[2.5rem]">
                            <h2 className="text-3xl text-white font-bold mb-6 serif-heading">
                                Not trying to be everything
                            </h2>
                            <p className="text-lg text-slate-300 leading-relaxed mb-6">
                                We're not trying to replace big corporate PDF platforms.
                            </p>
                            <p className="text-lg text-slate-300 leading-relaxed mb-6">
                                We're building a calm, reliable utility that students can trust — today in college,
                                and tomorrow in real life.
                            </p>
                            <p className="text-2xl text-white font-bold">
                                Small. Focused. Useful.
                            </p>
                        </section>

                        {/* Our Promise */}
                        <section className="glass-card p-10 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-brand-purple/10 to-brand-coral/10 border-2 border-brand-purple/30">
                            <h2 className="text-3xl text-white font-bold mb-8 serif-heading">
                                Our Promise
                            </h2>
                            <div className="space-y-4 text-lg text-slate-300">
                                <p className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-brand-purple mt-1 flex-shrink-0">stars</span>
                                    <span>We won't overload the app with fake features</span>
                                </p>
                                <p className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-brand-purple mt-1 flex-shrink-0">stars</span>
                                    <span>We won't sacrifice trust for quick money</span>
                                </p>
                                <p className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-brand-purple mt-1 flex-shrink-0">stars</span>
                                    <span>We won't forget who this is built for</span>
                                </p>
                            </div>
                            <p className="text-xl text-white font-light leading-relaxed mt-8">
                                Takkunu PDF is here to quietly help you get things done — without drama.
                            </p>
                        </section>

                        {/* Closing */}
                        <section className="text-center py-12">
                            <p className="text-3xl text-white font-bold serif-heading mb-4">
                                Made for the students community. 💕
                            </p>
                            <button
                                onClick={() => onNavigate('home')}
                                className="mt-8 px-10 py-4 text-sm font-bold uppercase tracking-[0.25em] text-white accent-gradient rounded-full hover:shadow-[0_0_30px_rgba(139,92,246,0.4)] transition-all"
                            >
                                Try Takkunu PDF
                            </button>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AboutPage;
