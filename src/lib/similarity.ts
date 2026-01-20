export function cosineSimilarity(a: number[], b: number[]): number {
    if (!a.length || !b.length) return 0;

    // BUG: OpenAI embeddings are always the same length
    // const len = Math.min(a.length, b.length);

    // BUG FIX: add validation instead
    if (a.length !== b.length) {
        throw new Error("Embedding vectors must be of the same length");
    }

    // compute dot product and magnitudes
    let dot = 0;
    let magA = 0;
    let magB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        magA += a[i] * a[i];
        magB += b[i] * b[i];
    }

    // compute cosine similarity 
    const denom = Math.sqrt(magA) * Math.sqrt(magB);
    return denom === 0 ? 0 : dot / denom;
}

export function semanticToPercent(sim: number) {
    // consign similarity ranges from -1 to 1
    // maps it to 0 to 100
    return Math.round(((sim + 1) / 2) * 100);
}