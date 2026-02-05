import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPage = ({ onNavigate }) => {
    return (
        <div className="min-h-screen bg-brand-black relative">
            <Navbar onNavigate={onNavigate} current="privacy" />

            <main className="pt-40 pb-20 px-6">
                <div className="main-container max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-20">
                        <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-6">
                            Security Protocol
                        </span>
                        <h1 className="serif-heading text-5xl md:text-7xl text-white mb-8">
                            Your Data is <br />
                            <span className="text-emerald-400">Invisible</span> to Us
                        </h1>
                    </div>

                    {/* Content */}
                    <div className="glass-card p-12 md:p-16 rounded-[2.5rem] space-y-16">
                        <section>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="material-symbols-outlined text-3xl text-brand-purple">timer_off</span>
                                <h2 className="text-2xl text-white font-bold">The 5-Minute Rule</h2>
                            </div>
                            <p className="text-slate-400 leading-relaxed text-lg">
                                We employ a strict ephemeral storage policy. From the moment your upload completes, a countdown begins.
                                At exactly 300 seconds (5 minutes), an automated cron job executes a secure wipe of the temporary directory.
                                There are no backups, no archives, and no "soft deletes". When it's gone, it's gone forever.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="material-symbols-outlined text-3xl text-brand-coral">lock</span>
                                <h2 className="text-2xl text-white font-bold">End-to-End Encryption</h2>
                            </div>
                            <p className="text-slate-400 leading-relaxed text-lg">
                                Your files traverse the internet via an encrypted SSL/TLS tunnel (HTTPS). We use standard AES-256 encryption
                                standards for data in transit. This means even if someone intercepts the data packets, they would see nothing
                                but gibberish.
                            </p>
                        </section>

                        <section>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="material-symbols-outlined text-3xl text-blue-400">visibility_off</span>
                                <h2 className="text-2xl text-white font-bold">No Human Access</h2>
                            </div>
                            <p className="text-slate-400 leading-relaxed text-lg">
                                Our server architecture is designed to be autonomous. Human administrators do not have routine access to
                                the file processing directories. Your documents are processed by scripts, not people. We never sell, trade,
                                or analyze your data for advertising purposes.
                            </p>
                        </section>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default PrivacyPage;
