import OpenAI from 'openai';
import { detectLanguage, detectQueryIntent } from './modelSelection';

// Get API key from environment
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
    console.warn('⚠️ VITE_OPENROUTER_API_KEY not set. Study Mode AI features will not work.');
}

// Initialize OpenRouter client
const openrouter = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: OPENROUTER_API_KEY,
    dangerouslyAllowBrowser: true,
    defaultHeaders: {
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Takkunu PDF Study Mode'
    }
});

/**
 * Select appropriate model based on language and task
 */
function selectModel(userQuery, taskType = 'chat') {
    const language = detectLanguage(userQuery);
    const intent = detectQueryIntent(userQuery);

    // Multilingual support
    if (['tamil', 'hindi', 'malayalam', 'telugu', 'tanglish'].includes(language)) {
        return 'openai/gpt-oss-120b:free';
    }

    // Task-based selection
    if (taskType === 'mcq' || taskType === 'quiz' || intent === 'reasoning') {
        return 'stepfun/step-3.5-flash:free';
    }

    if (intent === 'programming' || taskType === 'technical') {
        return 'arcee-ai/trinity-large-preview:free';
    }

    // Default: General study
    return 'liquid/lfm-2.5-1.2b-thinking:free';
}

/**
 * Build system prompt with document context
 */
function buildSystemPrompt(documentChunks) {
    if (!documentChunks || documentChunks.length === 0) {
        return `You are a private study assistant. The user hasn't uploaded any documents yet.
Politely ask them to upload study materials first.`;
    }

    const context = documentChunks
        .map(chunk => chunk.text || chunk)
        .join('\n\n---\n\n');

    return `You are a private study assistant.
You may ONLY answer using the provided document content below.
If the answer is not explicitly present in the context, you MUST say:
"I cannot find this information in your uploaded documents."

Do not guess. Do not add outside knowledge. Do not hallucinate.

DOCUMENT CONTEXT:
${context}

Remember: Answer strictly from the context above. Match the user's language.`;
}

/**
 * Stream chat response from OpenRouter
 */
export async function* streamChatResponse(userQuery, documentChunks, conversationHistory = []) {
    if (!OPENROUTER_API_KEY) {
        yield 'AI service not configured. Please add VITE_OPENROUTER_API_KEY to your .env file.';
        return;
    }

    try {
        // Select model
        const model = selectModel(userQuery);

        // Build system prompt with context
        const systemPrompt = buildSystemPrompt(documentChunks);

        // Prepare messages
        const messages = [
            { role: 'system', content: systemPrompt },
            ...conversationHistory.slice(-6), // Last 6 messages for context
            { role: 'user', content: userQuery }
        ];

        // Call OpenRouter with streaming
        const stream = await openrouter.chat.completions.create({
            model: model,
            messages: messages,
            stream: true,
            temperature: 0.3, // Low temperature for factual responses
            max_tokens: 1000
        });

        // Stream response
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                yield content;
            }
        }

    } catch (error) {
        console.error('OpenRouter streaming error:', error);

        if (error.status === 401) {
            yield 'Authentication failed. Please check your OpenRouter API key in .env file.';
        } else {
            yield 'AI service temporarily unavailable. Please try again.';
        }
    }
}

/**
 * Generate study card from document content
 * Uses SAME execution pattern for all card types
 */
export async function generateStudyCard(documentText, cardType, documentName, retryCount = 0) {
    if (!OPENROUTER_API_KEY) {
        console.error('❌ OpenRouter API key not configured');
        throw new Error('API key not configured');
    }

    if (!documentText || documentText.trim().length < 20) {
        console.error('❌ Document text is too short or empty');
        throw new Error('Document text is too short');
    }

    console.log(`🎯 Generating ${cardType} card from document: ${documentName} (attempt ${retryCount + 1})`);

    try {
        // Use same model for all card types for consistency
        const model = 'liquid/lfm-2.5-1.2b-thinking:free';

        // Build prompt based on card type - ALL use full document context
        let systemPrompt = '';
        let userPrompt = '';
        const fullText = documentText; // Use FULL document

        switch (cardType) {
            case 'key-points':
                systemPrompt = `You are a study assistant that extracts KEY POINTS from documents.

Rules:
- Key points are high-level ideas, objectives, and main takeaways
- Use concise bullet points
- Do NOT include minor details
- Do NOT include examples unless essential
- Use only the provided document content
- Do NOT add external information
- Return a JSON array of strings
- Each string is one key point`;

                userPrompt = `Extract KEY POINTS from this document. Return ONLY a JSON array of strings.

Document content:
${fullText}

Return format: ["Key point 1", "Key point 2", "Key point 3", ...]

Return ONLY the JSON array, no markdown, no explanations.`;
                break;

            case 'fact':
                systemPrompt = `You are a study assistant that extracts IMPORTANT FACTS from documents.

Rules:
- There is NO LIMIT on the number of facts
- Include every definition, factual statement, result, conclusion, technical detail, formula, and named concept
- Use only the provided document content
- Do NOT summarize
- Do NOT merge facts
- Each fact must be its own entry
- Do NOT add external knowledge
- If the document is long, return many facts
- Exhaustively list everything that qualifies as a fact`;

                userPrompt = `Extract ALL IMPORTANT FACTS from this document. Return ONLY a JSON array of fact objects.

Document content:
${fullText}

Return format: [
  {"label": "TERM 1", "description": "Definition or explanation"},
  {"label": "TERM 2", "description": "Definition or explanation"}
]

Return ONLY the JSON array, no markdown, no explanations.`;
                break;

            case 'mcq':
                systemPrompt = `You are a study assistant that creates multiple-choice questions from documents.

Rules:
- Generate questions strictly from the provided document content
- Each question must have one correct answer and three plausible distractors
- Do NOT use outside knowledge
- Do NOT repeat questions
- Difficulty: medium
- Base questions on actual facts from the document`;

                userPrompt = `Create ONE multiple-choice question from this document. Return ONLY a JSON object.

Document content:
${fullText}

Return format: {
  "question": "Question text?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 0
}

Return ONLY the JSON object, no markdown, no explanations.`;
                break;

            default:
                throw new Error(`Unknown card type: ${cardType}`);
        }

        console.log(`📤 Calling OpenRouter with model: ${model}`);

        // Call OpenRouter
        const response = await openrouter.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 2000 // Increased for exhaustive facts
        });

        const content = response.choices[0]?.message?.content || '';
        console.log(`📥 Received response (${content.length} chars):`, content.substring(0, 200));

        if (!content || content.trim().length === 0) {
            console.warn('⚠️ Empty response from AI');

            // Retry once
            if (retryCount === 0) {
                console.log('🔄 Retrying...');
                return await generateStudyCard(documentText, cardType, documentName, 1);
            }

            throw new Error('Empty response from AI after retry');
        }

        // Remove markdown code blocks if present
        let cleanedContent = content.trim();
        cleanedContent = cleanedContent.replace(/```json\s*/g, '');
        cleanedContent = cleanedContent.replace(/```\s*/g, '');
        cleanedContent = cleanedContent.trim();

        // Extract JSON from response
        const jsonMatch = cleanedContent.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (!jsonMatch) {
            console.error('❌ No JSON found in response:', cleanedContent);

            // Retry once
            if (retryCount === 0) {
                console.log('🔄 Retrying due to invalid JSON...');
                return await generateStudyCard(documentText, cardType, documentName, 1);
            }

            throw new Error('AI did not return valid JSON after retry');
        }

        const parsedData = JSON.parse(jsonMatch[0]);
        console.log(`✅ Successfully parsed ${cardType} card:`, parsedData);

        return parsedData;

    } catch (error) {
        console.error(`❌ Card generation error for ${cardType}:`, error);
        console.error('Error details:', error.message);
        if (error.response) {
            console.error('API Response:', error.response);
        }
        throw error; // Re-throw so UI can handle it
    }
}
