import './HomePage.css';

const HomePage = ({ onNavigate }) => {
    const convertTools = [
        { id: 'pdf-to-word', name: 'PDF to Word', icon: '📄', category: 'convert' },
        { id: 'word-to-pdf', name: 'Word to PDF', icon: '📝', category: 'convert' },
        { id: 'jpg-to-pdf', name: 'JPG to PDF', icon: '🖼️', category: 'convert' },
        { id: 'pdf-to-jpg', name: 'PDF to JPG', icon: '📷', category: 'convert' },
    ];

    const organizeTools = [
        { id: 'merge-pdf', name: 'Merge PDF', icon: '🔗', category: 'organize' },
        { id: 'split-pdf', name: 'Split PDF', icon: '✂️', category: 'organize' },
        { id: 'extract-pages', name: 'Extract Pages', icon: '📑', category: 'organize' },
        { id: 'remove-pages', name: 'Remove Pages', icon: '🗑️', category: 'organize' },
    ];

    return (
        <div className="home-page">
            {/* Header */}
            <header className="header">
                <div className="container">
                    <div className="header-content">
                        <div className="logo-section">
                            <div className="logo">📄</div>
                            <div>
                                <h1 className="app-title">takkunu pdf</h1>
                                <p className="app-subtitle">Simple, fast, and student-friendly PDF tools</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="main-content">
                <div className="container">
                    {/* Convert Section */}
                    <section className="tools-section">
                        <div className="section-header">
                            <h2 className="section-title">🔄 Convert</h2>
                            <p className="section-description">Transform your files between different formats</p>
                        </div>
                        <div className="tools-grid">
                            {convertTools.map((tool) => (
                                <div
                                    key={tool.id}
                                    className="tool-card card card-clickable"
                                    onClick={() => onNavigate(tool.category, tool.id)}
                                >
                                    <div className="tool-icon">{tool.icon}</div>
                                    <h3 className="tool-name">{tool.name}</h3>
                                    <p className="tool-description">Click to get started</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Organize Section */}
                    <section className="tools-section">
                        <div className="section-header">
                            <h2 className="section-title">🗂️ Organize</h2>
                            <p className="section-description">Manage and manipulate your PDF documents</p>
                        </div>
                        <div className="tools-grid">
                            {organizeTools.map((tool) => (
                                <div
                                    key={tool.id}
                                    className="tool-card card card-clickable"
                                    onClick={() => onNavigate(tool.category, tool.id)}
                                >
                                    <div className="tool-icon">{tool.icon}</div>
                                    <h3 className="tool-name">{tool.name}</h3>
                                    <p className="tool-description">Click to get started</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Info Banner */}
                    <div className="info-banner card">
                        <div className="info-icon">💡</div>
                        <div className="info-content">
                            <h4 className="info-title">Student-First PDF Utility</h4>
                            <p className="info-text">
                                <strong>Free forever.</strong> No signup required. Files auto-deleted after 5 minutes.
                                Max 10 MB per file. Works best with text-based PDFs.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <p className="footer-text">
                        Built with ❤️ for students everywhere |
                        <strong> takkunu pdf</strong> - Simple, Honest, Free
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;
