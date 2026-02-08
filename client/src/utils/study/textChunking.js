/**
 * Split text into semantic chunks for better retrieval
 * Target: 500-800 tokens per chunk with overlap
 */
export function chunkText(text, documentId, documentName, options = {}) {
    const {
        chunkSize = 600, // Target tokens (roughly 450-750 words)
        overlap = 100,    // Overlap tokens
        minChunkSize = 200
    } = options;

    // Rough token estimation: 1 token ≈ 0.75 words
    const wordsPerChunk = Math.floor(chunkSize * 0.75);
    const overlapWords = Math.floor(overlap * 0.75);

    // Split by paragraphs first
    const paragraphs = text
        .split(/\n\n+/)
        .map(p => p.trim())
        .filter(p => p.length > 0);

    const chunks = [];
    let currentChunk = [];
    let currentWordCount = 0;
    let chunkIndex = 0;

    for (const paragraph of paragraphs) {
        const words = paragraph.split(/\s+/);
        const paragraphWordCount = words.length;

        // If adding this paragraph exceeds chunk size, save current chunk
        if (currentWordCount + paragraphWordCount > wordsPerChunk && currentWordCount > 0) {
            const chunkText = currentChunk.join('\n\n');

            if (currentWordCount >= minChunkSize * 0.75) {
                chunks.push({
                    id: `${documentId}-chunk-${chunkIndex}`,
                    documentId,
                    documentName,
                    text: chunkText,
                    index: chunkIndex,
                    wordCount: currentWordCount
                });
                chunkIndex++;
            }

            // Keep overlap
            const overlapParagraphs = currentChunk.slice(-1); // Keep last paragraph for context
            currentChunk = overlapParagraphs;
            currentWordCount = overlapParagraphs.join(' ').split(/\s+/).length;
        }

        currentChunk.push(paragraph);
        currentWordCount += paragraphWordCount;
    }

    // Add final chunk
    if (currentWordCount >= minChunkSize * 0.75) {
        chunks.push({
            id: `${documentId}-chunk-${chunkIndex}`,
            documentId,
            documentName,
            text: currentChunk.join('\n\n'),
            index: chunkIndex,
            wordCount: currentWordCount
        });
    }

    return chunks;
}

/**
 * Simple keyword-based retrieval (no embeddings needed)
 */
export function retrieveRelevantChunks(query, chunks, topK = 5) {
    if (!chunks || chunks.length === 0) {
        return [];
    }

    // Normalize query
    const queryTerms = query
        .toLowerCase()
        .split(/\s+/)
        .filter(term => term.length > 2); // Filter short words

    // Score each chunk
    const scored = chunks.map(chunk => {
        const chunkText = chunk.text.toLowerCase();
        let score = 0;

        // Count term matches
        queryTerms.forEach(term => {
            const regex = new RegExp(`\\b${term}\\w*`, 'gi');
            const matches = chunkText.match(regex);
            if (matches) {
                score += matches.length;
            }
        });

        // Boost for exact phrase match
        if (chunkText.includes(query.toLowerCase())) {
            score += 10;
        }

        return { chunk, score };
    });

    // Sort by score and return top K
    return scored
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK)
        .map(item => item.chunk);
}
