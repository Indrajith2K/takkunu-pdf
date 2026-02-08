import React, { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import { generateStudyCard } from '../../utils/study/aiService';

const AICardsPanel = () => {
    const { documents } = useStudy();

    // State management
    const [activeCard, setActiveCard] = useState(null); // 'keypoints' | 'facts' | 'mcq'
    const [loading, setLoading] = useState(false);
    const [cardData, setCardData] = useState(null);
    const [streak, setStreak] = useState(() => {
        // Load streak from localStorage
        const saved = localStorage.getItem('study_mcq_streak');
        return saved ? parseInt(saved, 10) : 0;
    });
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [mcqQuestions, setMcqQuestions] = useState([]);
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [error, setError] = useState(null);

    // Generate card based on type
    const handleGenerateCard = async (type) => {
        if (!documents || documents.length === 0) {
            setError('Please upload a document first');
            return;
        }

        const firstDoc = documents[0];
        if (!firstDoc.text || firstDoc.text.trim().length < 20) {
            setError('This document appears to be scanned or contains no selectable text.');
            return;
        }

        console.log(`🎯 Starting ${type} generation for document: ${firstDoc.name}`);
        console.log(`Document text length: ${firstDoc.text.length} characters`);

        setLoading(true);
        setActiveCard(type);
        setCardData(null);
        setError(null);

        try {
            if (type === 'keypoints') {
                const data = await generateStudyCard(firstDoc.text, 'key-points', firstDoc.name);
                console.log('✅ Key points received:', data);

                if (data && Array.isArray(data) && data.length > 0) {
                    setCardData(data); // Show all key points
                } else {
                    throw new Error('No key points generated or invalid format');
                }
            }
            else if (type === 'facts') {
                const data = await generateStudyCard(firstDoc.text, 'fact', firstDoc.name);
                console.log('✅ Facts received:', data);

                // Handle both single fact object and array of facts
                if (Array.isArray(data) && data.length > 0) {
                    setCardData(data); // Multiple facts
                } else if (data && data.label && data.description) {
                    setCardData([data]); // Single fact, wrap in array
                } else {
                    throw new Error('Invalid fact data structure');
                }
            }
            else if (type === 'mcq') {
                // Generate 5 MCQs
                const questions = [];

                for (let i = 0; i < 5; i++) {
                    console.log(`Generating MCQ ${i + 1}/5...`);
                    try {
                        const data = await generateStudyCard(firstDoc.text, 'mcq', firstDoc.name);
                        console.log(`MCQ ${i + 1} received:`, data);

                        if (data && data.question && data.options && Array.isArray(data.options) && typeof data.correctIndex === 'number') {
                            questions.push(data);
                        } else {
                            console.warn(`MCQ ${i + 1} has invalid structure, skipping`);
                        }
                    } catch (mcqError) {
                        console.error(`Failed to generate MCQ ${i + 1}:`, mcqError.message);
                    }
                }

                if (questions.length > 0) {
                    setMcqQuestions(questions);
                    setCurrentQuestionIndex(0);
                    setShowAnswer(false);
                    setSelectedAnswer(null);
                    console.log(`✅ Successfully generated ${questions.length} MCQs`);
                } else {
                    throw new Error('Failed to generate any valid MCQs');
                }
            }
        } catch (error) {
            console.error('❌ Card generation failed:', error);

            let errorMessage = '';

            if (error.message.includes('API key')) {
                errorMessage = 'OpenRouter API key not configured. Check your .env file.';
            } else if (error.message.includes('Empty response')) {
                errorMessage = 'Not enough content to generate this from the current document.';
            } else if (error.message.includes('JSON')) {
                errorMessage = 'AI response format error. Please try again.';
            } else {
                errorMessage = error.message || 'Failed to generate study card. Please try again.';
            }

            setError(errorMessage);
            setActiveCard(null);
        } finally {
            setLoading(false);
        }
    };

    // Handle MCQ answer selection
    const handleMCQAnswer = (selectedIndex) => {
        if (showAnswer) return; // Already answered

        setSelectedAnswer(selectedIndex);
        setShowAnswer(true);

        const currentQuestion = mcqQuestions[currentQuestionIndex];
        const isCorrect = selectedIndex === currentQuestion.correctIndex;

        if (isCorrect) {
            const newStreak = streak + 1;
            setStreak(newStreak);
            localStorage.setItem('study_mcq_streak', newStreak.toString());
        } else {
            setStreak(0);
            localStorage.setItem('study_mcq_streak', '0');
        }
    };

    // Move to next MCQ
    const handleNextQuestion = () => {
        if (currentQuestionIndex < mcqQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setShowAnswer(false);
            setSelectedAnswer(null);
        } else {
            // Quiz complete
            alert(`Quiz complete! Final streak: ${streak} 🔥`);
            setActiveCard(null);
            setMcqQuestions([]);
            setStreak(0);
        }
    };

    // Reset to menu
    const handleBack = () => {
        setActiveCard(null);
        setCardData(null);
        setMcqQuestions([]);
        setStreak(0);
        setCurrentQuestionIndex(0);
        setShowAnswer(false);
        setSelectedAnswer(null);
    };

    return (
        <aside className="w-80 bg-brand-sidebar border-l border-white/5 flex flex-col shrink-0">
            <div className="p-6 h-full flex flex-col">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 flex items-center gap-2 shrink-0">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    AI Generated Cards
                </h3>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <div className="text-center">
                            <div className="w-8 h-8 border-2 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-xs text-slate-500">Generating from your document...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                        <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center mb-3">
                            <span className="material-symbols-outlined text-red-500 text-lg">error</span>
                        </div>
                        <p className="text-xs text-slate-300 mb-3">{error}</p>
                        <button
                            onClick={() => setError(null)}
                            className="text-[10px] text-slate-500 hover:text-white underline"
                        >
                            Dismiss
                        </button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !activeCard && !error && documents.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center px-4">
                            <span className="material-symbols-outlined text-4xl text-slate-700 mb-2">lightbulb</span>
                            <p className="text-xs text-slate-600">Upload documents to generate study cards</p>
                        </div>
                    </div>
                )}

                {/* Menu State */}
                {!loading && !activeCard && !error && documents.length > 0 && (
                    <div className="flex-1 flex flex-col gap-3">
                        <button
                            onClick={() => handleGenerateCard('keypoints')}
                            className="glass-card p-5 rounded-2xl border-t-2 border-t-brand-purple hover:bg-white/5 transition-all text-left group"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-lg text-brand-purple">lightbulb</span>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Key Points</h4>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                                Generate 5-10 concise bullet points summarizing your document
                            </p>
                        </button>

                        <button
                            onClick={() => handleGenerateCard('facts')}
                            className="glass-card p-5 rounded-2xl border-t-2 border-t-brand-coral hover:bg-white/5 transition-all text-left group"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-lg text-brand-coral">info</span>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Important Facts</h4>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                                Extract key definitions, formulas, and exam-relevant facts
                            </p>
                        </button>

                        <button
                            onClick={() => handleGenerateCard('mcq')}
                            className="glass-card p-5 rounded-2xl border-t-2 border-t-emerald-500 hover:bg-white/5 transition-all text-left group"
                        >
                            <div className="flex items-center gap-3 mb-2">
                                <span className="material-symbols-outlined text-lg text-emerald-500">quiz</span>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Practice MCQ</h4>
                            </div>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                                Test your knowledge with multiple-choice questions
                            </p>
                        </button>
                    </div>
                )}

                {/* Key Points Card */}
                {!loading && activeCard === 'keypoints' && cardData && (
                    <div className="flex-1 flex flex-col">
                        <button
                            onClick={handleBack}
                            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-4 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Back to menu
                        </button>

                        <div className="glass-card p-5 rounded-2xl border-t-2 border-t-brand-purple flex-1 overflow-y-auto custom-scrollbar">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="material-symbols-outlined text-lg text-brand-purple">lightbulb</span>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Key Points</h4>
                            </div>
                            <ul className="space-y-3">
                                {cardData.map((point, i) => (
                                    <li key={i} className={`text-[11px] leading-relaxed text-slate-400 ${i !== cardData.length - 1 ? 'border-b border-white/5 pb-2' : ''}`}>
                                        • {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Important Facts Card */}
                {!loading && activeCard === 'facts' && cardData && (
                    <div className="flex-1 flex flex-col">
                        <button
                            onClick={handleBack}
                            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 mb-4 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Back to menu
                        </button>

                        <div className="glass-card p-5 rounded-2xl border-t-2 border-t-brand-coral flex-1 overflow-y-auto custom-scrollbar">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="material-symbols-outlined text-lg text-brand-coral">info</span>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Important Facts</h4>
                            </div>
                            <div className="space-y-3">
                                {Array.isArray(cardData) ? (
                                    cardData.map((fact, index) => (
                                        <div key={index} className="p-3 bg-white/5 rounded-xl border border-white/5">
                                            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">{fact.label}</p>
                                            <p className="text-[11px] text-slate-300 leading-relaxed">{fact.description}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                                        <p className="text-[10px] text-slate-500 uppercase font-black mb-1">{cardData.label}</p>
                                        <p className="text-[11px] text-slate-300 leading-relaxed">{cardData.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Practice MCQ Card */}
                {!loading && activeCard === 'mcq' && mcqQuestions.length > 0 && (
                    <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                            <button
                                onClick={handleBack}
                                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                            >
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Back
                            </button>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-slate-500">
                                    {currentQuestionIndex + 1}/{mcqQuestions.length}
                                </span>
                                {streak > 0 && (
                                    <span className="text-[10px] text-orange-400 font-bold">
                                        🔥 {streak}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="glass-card p-5 rounded-2xl border-t-2 border-t-emerald-500 flex-1 flex flex-col">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="material-symbols-outlined text-lg text-emerald-500">quiz</span>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-white">Practice MCQ</h4>
                            </div>

                            <p className="text-[11px] text-slate-300 font-medium leading-relaxed mb-4">
                                {mcqQuestions[currentQuestionIndex].question}
                            </p>

                            <div className="space-y-2 flex-1">
                                {mcqQuestions[currentQuestionIndex].options.map((opt, i) => {
                                    const isSelected = selectedAnswer === i;
                                    const isCorrect = i === mcqQuestions[currentQuestionIndex].correctIndex;
                                    const showCorrect = showAnswer && isCorrect;
                                    const showWrong = showAnswer && isSelected && !isCorrect;

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleMCQAnswer(i)}
                                            disabled={showAnswer}
                                            className={`w-full text-left p-2.5 rounded-lg border text-[10px] transition-all ${showCorrect
                                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                                : showWrong
                                                    ? 'bg-red-500/20 border-red-500 text-red-300'
                                                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-brand-purple/30'
                                                } ${showAnswer ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            {String.fromCharCode(65 + i)}. {opt}
                                            {showCorrect && ' ✓'}
                                            {showWrong && ' ✗'}
                                        </button>
                                    );
                                })}
                            </div>

                            {showAnswer && (
                                <button
                                    onClick={handleNextQuestion}
                                    className="mt-4 w-full py-2 px-4 bg-brand-purple hover:bg-brand-purple/80 rounded-lg text-xs font-bold text-white transition-colors"
                                >
                                    {currentQuestionIndex < mcqQuestions.length - 1 ? 'Next Question →' : 'Finish Quiz'}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default AICardsPanel;
