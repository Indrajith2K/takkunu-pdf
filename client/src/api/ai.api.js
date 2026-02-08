import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Stream chat response from backend AI proxy
 */
export async function* streamChatResponse(messages, documentChunks, taskType = 'chat', language = 'english') {
    try {
        const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages,
                documentContext: documentChunks || [],
                taskType,
                language
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'AI service temporarily unavailable');
        }

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
                        return;
                    }

                    try {
                        const parsed = JSON.parse(data);
                        if (parsed.content) {
                            yield parsed.content;
                        }
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        }
    } catch (error) {
        console.error('Chat stream error:', error);
        yield 'AI service temporarily unavailable. Please try again.';
    }
}

/**
 * Generate study card from backend AI proxy
 */
export async function generateStudyCard(documentText, cardType, documentName) {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/ai/cards`, {
            documentText,
            cardType,
            documentName
        });

        if (response.data.success) {
            return response.data.data;
        }

        return null;
    } catch (error) {
        console.error('Card generation error:', error);
        return null;
    }
}
