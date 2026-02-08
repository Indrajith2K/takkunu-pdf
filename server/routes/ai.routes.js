const express = require('express');
const router = express.Router();

// OpenRouter API configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

/**
 * Model selection logic based on task type and language
 */
function selectModel(taskType, language = 'english') {
    // Multilingual support
    if (['tamil', 'hindi', 'malayalam', 'telugu', 'tanglish'].includes(language.toLowerCase())) {
        return 'openai/gpt-oss-120b:free';
    }

    // Task-based selection
    switch (taskType) {
        case 'programming':
        case 'technical':
            return 'arcee-ai/trinity-large-preview:free';
        case 'reasoning':
        case 'mcq':
        case 'quiz':
            return 'liquid/lfm-2.5-1.2b-thinking:free';
        case 'summary':
        case 'keypoints':
            return 'stepfun/step-3.5-flash:free';
        default:
            return 'stepfun/step-3.5-flash:free';
    }
}

/**
 * POST /api/ai/chat
 * Stream chat responses with document context
 */
router.post('/chat', async (req, res) => {
    try {
        const { messages, documentContext, taskType = 'chat', language = 'english' } = req.body;

        if (!OPENROUTER_API_KEY) {
            return res.status(500).json({ error: 'OpenRouter API key not configured' });
        }

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array required' });
        }

        // Build system prompt with document context
        const systemPrompt = documentContext && documentContext.length > 0
            ? `You are a study assistant. Answer ONLY using the provided document context below.
If the information is not found in the context, respond: "I couldn't find this information in your uploaded documents."

DOCUMENT CONTEXT:
${documentContext.join('\n\n---\n\n')}

Remember: Answer strictly from the context above. Match the user's language.`
            : `You are a study assistant. The user hasn't uploaded any documents yet. 
Politely ask them to upload study materials first.`;

        // Select appropriate model
        const model = selectModel(taskType, language);

        // Prepare messages with system prompt
        const fullMessages = [
            { role: 'system', content: systemPrompt },
            ...messages
        ];

        // Call OpenRouter API
        const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://takkunu-pdf.com',
                'X-Title': 'Takkunu PDF Study Mode'
            },
            body: JSON.stringify({
                model: model,
                messages: fullMessages,
                stream: true,
                temperature: 0.3,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenRouter error:', errorText);
            return res.status(response.status).json({
                error: 'AI service temporarily unavailable. Please try again.'
            });
        }

        // Set headers for streaming
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Stream the response
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n').filter(line => line.trim() !== '');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') {
                        res.write('data: [DONE]\n\n');
                        continue;
                    }

                    try {
                        const parsed = JSON.parse(data);
                        const content = parsed.choices?.[0]?.delta?.content;
                        if (content) {
                            res.write(`data: ${JSON.stringify({ content })}\n\n`);
                        }
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        }

        res.end();

    } catch (error) {
        console.error('Chat proxy error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

/**
 * POST /api/ai/cards
 * Generate study cards from document content
 */
router.post('/cards', async (req, res) => {
    try {
        const { documentText, cardType, documentName } = req.body;

        if (!OPENROUTER_API_KEY) {
            return res.status(500).json({ error: 'OpenRouter API key not configured' });
        }

        if (!documentText || !cardType) {
            return res.status(400).json({ error: 'Document text and card type required' });
        }

        // Select model based on card type
        const model = cardType === 'mcq'
            ? 'liquid/lfm-2.5-1.2b-thinking:free'
            : 'stepfun/step-3.5-flash:free';

        // Build prompt based on card type
        let prompt = '';
        switch (cardType) {
            case 'key-points':
                prompt = `Extract 3-5 key points from this document. Return ONLY a JSON array of strings.
Document: ${documentText.substring(0, 3000)}

Format: ["Point 1", "Point 2", "Point 3"]`;
                break;

            case 'fact':
                prompt = `Extract one important fact or definition from this document. Return ONLY a JSON object.
Document: ${documentText.substring(0, 3000)}

Format: {"label": "TERM", "description": "Definition or explanation"}`;
                break;

            case 'mcq':
                prompt = `Create a multiple-choice question from this document. Return ONLY a JSON object.
Document: ${documentText.substring(0, 3000)}

Format: {"question": "Question text?", "options": ["A", "B", "C"], "correctIndex": 0}`;
                break;

            default:
                return res.status(400).json({ error: 'Invalid card type' });
        }

        // Call OpenRouter API
        const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://takkunu-pdf.com',
                'X-Title': 'Takkunu PDF Study Mode'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: 'You are a study card generator. Return only valid JSON.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenRouter error:', errorText);
            return res.status(500).json({ error: 'Failed to generate study card' });
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '{}';

        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
        if (jsonMatch) {
            const cardData = JSON.parse(jsonMatch[0]);
            res.json({ success: true, data: cardData });
        } else {
            res.status(500).json({ error: 'Failed to parse card data' });
        }

    } catch (error) {
        console.error('Card generation error:', error);
        res.status(500).json({ error: 'Failed to generate study card' });
    }
});

module.exports = router;
