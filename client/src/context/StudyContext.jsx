import { createContext, useContext, useState, useCallback } from 'react';

const StudyContext = createContext(null);

export const useStudy = () => {
    const context = useContext(StudyContext);
    if (!context) {
        throw new Error('useStudy must be used within StudyProvider');
    }
    return context;
};

export const StudyProvider = ({ children }) => {
    const [documents, setDocuments] = useState([]);
    const [messages, setMessages] = useState([]);
    const [aiCards, setAiCards] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const addDocument = useCallback((doc) => {
        setDocuments(prev => [...prev, doc]);
    }, []);

    const removeDocument = useCallback((docId) => {
        setDocuments(prev => prev.filter(d => d.id !== docId));
    }, []);

    const addMessage = useCallback((message) => {
        setMessages(prev => [...prev, message]);
    }, []);

    const updateMessage = useCallback((messageId, updates) => {
        setMessages(prev => prev.map(msg =>
            msg.id === messageId ? { ...msg, ...updates } : msg
        ));
    }, []);

    const addAICard = useCallback((card) => {
        setAiCards(prev => [...prev, card]);
    }, []);

    const clearSession = useCallback(() => {
        setDocuments([]);
        setMessages([]);
        setAiCards([]);
    }, []);

    // Get all document chunks for AI context
    const getAllChunks = useCallback(() => {
        return documents.flatMap(doc => doc.chunks || []);
    }, [documents]);

    const value = {
        documents,
        messages,
        aiCards,
        isProcessing,
        setIsProcessing,
        addDocument,
        removeDocument,
        addMessage,
        updateMessage,
        addAICard,
        clearSession,
        getAllChunks
    };

    return (
        <StudyContext.Provider value={value}>
            {children}
        </StudyContext.Provider>
    );
};
