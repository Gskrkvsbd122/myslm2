/**
 * NANO TRANSFORMER WITH ON-BROWSER TRAINING LOOP
 */

class MathUtils {
    static randomMatrix(rows, cols) {
        return Array.from({ length: rows }, () => 
            Array.from({ length: cols }, () => (Math.random() * 2 - 1) * 0.5)
        );
    }

    static zeros(rows, cols) {
        return Array.from({ length: rows }, () => Array(cols).fill(0));
    }

    static softmax(arr) {
        const max = Math.max(...arr);
        const exps = arr.map(x => Math.exp(x - max));
        const sumExps = exps.reduce((a, b) => a + b, 0);
        return exps.map(x => x / (sumExps || 1));
    }
}

class NanoTransformer {
    constructor(vocabSize = 256) {
        this.vocabSize = vocabSize;
        // Lookup Table Weight Matrix linking past tokens directly to next probabilities
        this.weights = MathUtils.randomMatrix(vocabSize, vocabSize);
    }

    // Live training engine using Delta Rule optimization
    trainStep(inputToken, targetToken, learningRate = 0.2) {
        // Softmax prediction probabilities
        const rawLogits = this.weights[inputToken];
        const probs = MathUtils.softmax(rawLogits);

        // Calculate loss gradients (Target probability error vector)
        for (let j = 0; j < this.vocabSize; j++) {
            const targetOutput = (j === targetToken) ? 1.0 : 0.0;
            const error = targetOutput - probs[j];
            
            // Backpropagation step: Adjust weight arrays directly
            this.weights[inputToken][j] += learningRate * error;
        }
    }

    // Predicts and loops sequences autoregressively
    generate(inputText, maxTokens = 20) {
        if (!inputText) return "...";
        let output = "";
        let currentToken = inputText.charCodeAt(inputText.length - 1) % this.vocabSize;

        for (let step = 0; step < maxTokens; step++) {
            const logits = this.weights[currentToken];
            const probs = MathUtils.softmax(logits);
            
            // Select token with highest probability (Greedy Decoding)
            let nextToken = probs.indexOf(Math.max(...probs));
            
            // Keep output within human-readable ASCII limits
            if (nextToken < 32 || nextToken > 126) {
                nextToken = 32; // Default to space if broken
            }

            const nextChar = String.fromCharCode(nextToken);
            output += nextChar;
            currentToken = nextToken; // Shift state context window
            
            // Break infinite prediction loop on repeated space errors
            if (output.endsWith("      ")) break;
        }
        return output;
    }
}
