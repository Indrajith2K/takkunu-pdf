import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ActionCard from './components/ActionCard';
import FeatureSection from './components/FeatureSection';
import PrivacyBanner from './components/PrivacyBanner';
import Footer from './components/Footer';
import ConvertPage from './pages/ConvertPage';
import OrganizePage from './pages/OrganizePage';
import FeaturesPage from './pages/FeaturesPage';
import PrivacyPage from './pages/PrivacyPage';
import AboutPage from './pages/AboutPage';
import Stats from './components/Stats';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [activeTool, setActiveTool] = useState(null);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        setCurrentPage(event.state.page);
        setActiveTool(event.state.tool);
      } else {
        setCurrentPage('home');
        setActiveTool(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (page, tool = null) => {
    window.history.pushState({ page, tool }, '', `#${page}`);
    setCurrentPage(page);
    setActiveTool(tool);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render Logic
  const renderPage = () => {
    switch (currentPage) {
      case 'convert':
        return <ConvertPage tool={activeTool} onBack={() => navigate('home')} />;
      case 'organize':
        return <OrganizePage tool={activeTool} onBack={() => navigate('home')} />;
      case 'features':
        return <FeaturesPage onNavigate={navigate} />;
      case 'privacy':
        return <PrivacyPage onNavigate={navigate} />;
      case 'about':
        return <AboutPage onNavigate={navigate} />;
      default:
        return (
          <div className="relative min-h-screen">
            {/* Background Orbs */}
            <div className="abstract-orb bg-brand-purple w-[300px] md:w-[600px] h-[300px] md:h-[600px] -top-20 md:-top-40 -left-20 md:-left-40" />
            <div className="abstract-orb bg-brand-coral w-[300px] md:w-[600px] h-[300px] md:h-[600px] top-[30%] -right-20 md:-right-40" />

            <Navbar onNavigate={navigate} current="home" />

            <main className="pt-32 md:pt-40 pb-20 md:pb-32 px-4 md:px-0">
              <Hero />

              <Stats />

              <div className="main-container mb-24 md:mb-32 flex justify-center">
                <ActionCard onNavigate={navigate} />
              </div>

              <FeatureSection
                title="Conversion Suite"
                subtitle="High-fidelity formats for every professional need"
                icon="sync_alt"
                accentColor="text-brand-purple"
                onNavigate={navigate}
                items={[
                  {
                    icon: 'description',
                    color: 'text-brand-purple',
                    title: 'PDF to Word',
                    description: 'Convert PDF documents to editable Word format with precision.',
                    toolId: 'pdf-to-word',
                    category: 'convert'
                  },
                  {
                    icon: 'description',
                    color: 'text-brand-coral',
                    title: 'Word to PDF',
                    description: 'Transform Word documents into professional PDF files.',
                    toolId: 'word-to-pdf',
                    category: 'convert'
                  },
                  {
                    icon: 'image',
                    color: 'text-blue-400',
                    title: 'JPG to PDF',
                    description: 'Convert images to PDF format instantly.',
                    toolId: 'jpg-to-pdf',
                    category: 'convert'
                  },
                  {
                    icon: 'picture_as_pdf',
                    color: 'text-emerald-400',
                    title: 'PDF to JPG',
                    description: 'Extract pages from PDF as high-quality images.',
                    toolId: 'pdf-to-jpg',
                    category: 'convert'
                  },
                ]}
              />

              <FeatureSection
                title="Management Core"
                subtitle="Maintain absolute control over your documents"
                icon="grid_view"
                accentColor="text-brand-coral"
                onNavigate={navigate}
                items={[
                  {
                    icon: 'join_inner',
                    color: 'text-indigo-400',
                    title: 'Merge PDF',
                    description: 'Combine multiple PDF files into one document seamlessly.',
                    toolId: 'merge-pdf',
                    category: 'organize'
                  },
                  {
                    icon: 'content_cut',
                    color: 'text-rose-400',
                    title: 'Split PDF',
                    description: 'Divide PDF documents into separate files by pages.',
                    toolId: 'split-pdf',
                    category: 'organize'
                  },
                  {
                    icon: 'table_view',
                    color: 'text-amber-400',
                    title: 'Extract Pages',
                    description: 'Pull specific pages from PDF documents with precision.',
                    toolId: 'extract-pages',
                    category: 'organize'
                  },
                  {
                    icon: 'delete',
                    color: 'text-purple-400',
                    title: 'Remove Pages',
                    description: 'Delete unwanted pages from PDF files effortlessly.',
                    toolId: 'remove-pages',
                    category: 'organize'
                  },
                ]}
              />

              <PrivacyBanner />
            </main>

            <Footer />
          </div>
        );
    }
  };

  return renderPage();
}

export default App;
