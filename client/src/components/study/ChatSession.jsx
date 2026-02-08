import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useStudy } from '../../context/StudyContext';
import { streamChatResponse } from '../../utils/study/aiService';

const ChatSession = () => {
    const { messages, documents, getAllChunks, addMessage, updateMessage, isProcessing } = useStudy();
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!inputValue.trim() || isTyping) return;

        const userQuery = inputValue.trim();
        setInputValue('');

        // Add user message
        const userMessage = {
            id: `msg-${Date.now()}`,
            role: 'user',
            content: userQuery,
            timestamp: Date.now()
        };
        addMessage(userMessage);

        // Start AI response
        setIsTyping(true);

        try {
            // Check if we have documents
            if (documents.length === 0) {
                const noDocsMessage = {
                    id: `msg-${Date.now()}-ai`,
                    role: 'assistant',
                    content: "Please upload some documents first so I can help you study from them. I can only answer questions based on your uploaded materials.",
                    timestamp: Date.now()
                };
                addMessage(noDocsMessage);
                setIsTyping(false);
                return;
            }

            // Get all chunks from documents
            const allChunks = getAllChunks();

            if (!allChunks || allChunks.length === 0) {
                const noContextMessage = {
                    id: `msg-${Date.now()}-ai`,
                    role: 'assistant',
                    content: "I couldn't extract text from your documents. They may be scanned or contain no selectable text.",
                    timestamp: Date.now()
                };
                addMessage(noContextMessage);
                setIsTyping(false);
                return;
            }

            // Prepare conversation history (only last 6 for context)
            const conversationHistory = messages.slice(-6).map(m => ({
                role: m.role === 'assistant' ? 'assistant' : 'user',
                content: m.content
            }));

            // Stream AI response
            let aiResponse = '';
            const aiMessageId = `msg-${Date.now()}-ai`;

            // Create initial AI message
            const aiMessage = {
                id: aiMessageId,
                role: 'assistant',
                content: '',
                timestamp: Date.now()
            };
            addMessage(aiMessage);

            // Stream content from OpenRouter
            for await (const chunk of streamChatResponse(userQuery, allChunks, conversationHistory)) {
                aiResponse += chunk;

                // Update message content using updateMessage
                updateMessage(aiMessageId, { content: aiResponse });
            }

        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                id: `msg-${Date.now()}-ai`,
                role: 'assistant',
                content: 'AI service temporarily unavailable. Please try again.',
                timestamp: Date.now()
            };
            addMessage(errorMessage);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex-1 flex flex-col z-10 overflow-hidden">
            <div className="h-14 border-b border-white/5 flex items-center justify-between px-8 bg-brand-black/50 backdrop-blur-md shrink-0">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-widest">Study Session</span>
                    <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div className="flex gap-4">
                    <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                        <span className="material-symbols-outlined text-sm">history</span> History
                    </button>
                    <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors">
                        <span className="material-symbols-outlined text-sm">share</span> Export
                    </button>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                {messages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center max-w-md">
                            <div className="w-16 h-16 rounded-2xl accent-gradient flex items-center justify-center mx-auto mb-4">
                                <span className="material-symbols-outlined text-3xl text-white">auto_awesome</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">AI Study Assistant</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">
                                Upload your study materials and ask me anything. I'll answer strictly from your documents.
                            </p>
                            <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-xs text-slate-500 mb-2">Try asking:</p>
                                <ul className="text-xs text-slate-400 space-y-1 text-left">
                                    <li>• "Summarize the key points from Chapter 1"</li>
                                    <li>• "What is the definition of GDP?"</li>
                                    <li>• "Create practice questions on this topic"</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-4 max-w-3xl ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'ai' ? 'accent-gradient' : 'bg-white/10'}`}>
                            <span className="material-symbols-outlined text-white text-sm">
                                {msg.role === 'ai' ? 'smart_toy' : 'person'}
                            </span>
                        </div>

                        <div className={`p-5 rounded-2xl ${msg.role === 'ai'
                            ? 'bg-white/[0.04] border border-white/[0.05] rounded-tl-none text-slate-200'
                            : 'bg-brand-purple/20 border border-brand-purple/30 rounded-tr-none text-white'}`}
                        >
                            {msg.role === 'assistant' || msg.role === 'ai' ? (
                                <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none
                                    prose-headings:text-white prose-headings:font-bold
                                    prose-p:text-slate-200 prose-p:my-2
                                    prose-strong:text-white prose-strong:font-bold
                                    prose-code:text-brand-purple prose-code:bg-white/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
                                    prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10
                                    prose-ul:text-slate-200 prose-ul:my-2
                                    prose-ol:text-slate-200 prose-ol:my-2
                                    prose-li:my-1
                                    prose-blockquote:border-l-brand-purple prose-blockquote:text-slate-300
                                ">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {msg.content}
                                </p>
                            )}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-4 max-w-3xl">
                        <div className="w-8 h-8 rounded-lg accent-gradient flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-white text-sm">smart_toy</span>
                        </div>
                        <div className="bg-white/[0.04] border border-white/[0.05] p-5 rounded-2xl rounded-tl-none">
                            <div className="flex gap-1">
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-8 pt-0 shrink-0">
                <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-purple to-brand-coral rounded-2xl opacity-10 group-focus-within:opacity-25 transition-opacity blur-sm"></div>
                    <div className="relative bg-brand-charcoal border border-white/10 rounded-2xl flex items-center p-2 focus-within:border-white/20 transition-all shadow-2xl">
                        <input
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-4 text-white placeholder-slate-500"
                            placeholder="Ask anything from your uploaded materials..."
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isTyping || isProcessing}
                            type="text"
                        />
                        <div className="flex items-center gap-2 pr-2">
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isTyping || isProcessing}
                                className="w-10 h-10 accent-gradient rounded-xl flex items-center justify-center text-white shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined">arrow_upward</span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatSession;
