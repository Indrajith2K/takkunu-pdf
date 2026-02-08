import Navbar from '../components/Navbar';
import Sidebar from '../components/study/Sidebar';
import ChatSession from '../components/study/ChatSession';
import AICardsPanel from '../components/study/AICardsPanel';
import { StudyProvider } from '../context/StudyContext';

const StudyPage = ({ onNavigate }) => {
    return (
        <StudyProvider>
            <div className="min-h-screen bg-brand-black text-white flex flex-col">
                {/* Navbar */}
                <Navbar onNavigate={onNavigate} current="study" />

                {/* Main Content - Study Interface */}
                <div className="flex-1 flex overflow-hidden pt-24">
                    {/* Left Sidebar - Documents */}
                    <Sidebar />

                    {/* Main Chat Area */}
                    <ChatSession />

                    {/* Right Sidebar - AI Cards */}
                    <AICardsPanel />
                </div>
            </div>
        </StudyProvider>
    );
};

export default StudyPage;
