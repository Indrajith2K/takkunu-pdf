/**
 * Detect language from user input
 */
export function detectLanguage(text) {
    const sample = text.toLowerCase().substring(0, 200);

    // Tamil detection
    const tamilPattern = /[\u0B80-\u0BFF]/;
    if (tamilPattern.test(sample)) {
        return 'tamil';
    }

    // Hindi detection
    const hindiPattern = /[\u0900-\u097F]/;
    if (hindiPattern.test(sample)) {
        return 'hindi';
    }

    // Malayalam detection
    const malayalamPattern = /[\u0D00-\u0D7F]/;
    if (malayalamPattern.test(sample)) {
        return 'malayalam';
    }

    // Telugu detection
    const teluguPattern = /[\u0C00-\u0C7F]/;
    if (teluguPattern.test(sample)) {
        return 'telugu';
    }

    // Tanglish/Hinglish detection (English with Indian context)
    const indianEnglishKeywords = ['bro', 'yaar', 'da', 'pa', 'anna', 'akka', 'ji', 'hai', 'kya'];
    const hasIndianContext = indianEnglishKeywords.some(keyword =>
        sample.includes(keyword)
    );

    if (hasIndianContext) {
        return 'tanglish';
    }

    return 'english';
}

/**
 * Detect query intent/type
 */
export function detectQueryIntent(text) {
    const lower = text.toLowerCase();

    // Programming/tech keywords
    const techKeywords = ['code', 'function', 'algorithm', 'debug', 'error', 'syntax', 'compile', 'api', 'database', 'class', 'variable', 'loop', 'array'];
    if (techKeywords.some(kw => lower.includes(kw))) {
        return 'programming';
    }

    // Deep reasoning keywords
    const reasoningKeywords = ['why', 'how', 'explain', 'analyze', 'compare', 'evaluate', 'discuss', 'elaborate', 'concept', 'theory'];
    if (reasoningKeywords.some(kw => lower.includes(kw))) {
        return 'reasoning';
    }

    // Fast Q&A (short, direct questions)
    if (text.length < 50 && (lower.includes('what') || lower.includes('who') || lower.includes('when') || lower.includes('where'))) {
        return 'quick';
    }

    return 'general';
}

/**
 * Select appropriate model based on language and intent
 */
export function selectModel(text) {
    const language = detectLanguage(text);
    const intent = detectQueryIntent(text);

    // Non-English languages
    if (['tamil', 'hindi', 'malayalam', 'telugu', 'tanglish'].includes(language)) {
        return {
            model: 'openai/gpt-oss-120b:free',
            reason: 'Multi-language support'
        };
    }

    // Programming/Tech
    if (intent === 'programming') {
        return {
            model: 'arcee-ai/trinity-large-preview:free',
            reason: 'Technical/Programming query'
        };
    }

    // Deep reasoning
    if (intent === 'reasoning') {
        return {
            model: 'liquid/lfm-2.5-1.2b-thinking:free',
            reason: 'Deep reasoning required'
        };
    }

    // Fast Q&A (default)
    return {
        model: 'stepfun/step-3.5-flash:free',
        reason: 'Quick answer'
    };
}
