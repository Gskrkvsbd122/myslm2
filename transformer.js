/**
 * NANO TRANSFORMER - UPGRADED TO WORD-LEVEL TOKENIZATION
 */

class MathUtils {
    static softmax(arr) {
        const max = Math.max(...arr);
        const exps = arr.map(x => Math.exp(x - max));
        const sumExps = exps.reduce((a, b) => a + b, 0);
        return exps.map(x => x / (sumExps || 1));
    }
}

class NanoTransformer {
    constructor() {
        this.vocab = [];     // AI की अपनी डिक्शनरी
        this.weights = [];   // शब्दों के बीच का गणितीय संबंध
    }

    // टेक्स्ट को छोटे टुकड़ों (Tokens/Words) में तोड़ना
    tokenize(text) {
        return text.toLowerCase().match(/\b\w+\b/g) || [];
    }

    // नए शब्दों को देखकर अपना दिमाग (Matrix) बड़ा करना
    buildVocab(text) {
        const words = this.tokenize(text);
        words.forEach(word => {
            if (!this.vocab.includes(word)) {
                this.vocab.push(word);
                // नए शब्द के लिए मैट्रिक्स में नई लाइन जोड़ें
                this.weights.push(new Array(this.vocab.length).fill(0).map(() => (Math.random() * 0.1)));
                // पुरानी लाइनों को नए शब्द के हिसाब से बड़ा करें
                for(let i = 0; i < this.weights.length - 1; i++) {
                    this.weights[i].push(Math.random() * 0.1);
                }
            }
        });
    }

    // AI Training Engine
    train(textData, epochs = 250, learningRate = 0.5) {
        this.buildVocab(textData);
        const tokens = this.tokenize(textData);
        
        for (let e = 0; e < epochs; e++) {
            for (let i = 0; i < tokens.length - 1; i++) {
                const currentIdx = this.vocab.indexOf(tokens[i]);
                const targetIdx = this.vocab.indexOf(tokens[i + 1]);
                
                const logits = this.weights[currentIdx];
                const probs = MathUtils.softmax(logits);
                
                // Backpropagation (गलतियों को सुधारना)
                for (let j = 0; j < this.vocab.length; j++) {
                    const target = (j === targetIdx) ? 1.0 : 0.0;
                    const error = target - probs[j];
                    this.weights[currentIdx][j] += learningRate * error;
                }
            }
        }
    }

    // Output Generation
    generate(prompt, maxTokens = 15) {
        const inputTokens = this.tokenize(prompt);
        
        // अगर AI ने वह शब्द कभी देखा ही नहीं है
        if (inputTokens.length === 0 || !this.vocab.includes(inputTokens[inputTokens.length - 1])) {
            return "[Error: I don't know these words yet. Please train me on them!]";
        }

        let currentIdx = this.vocab.indexOf(inputTokens[inputTokens.length - 1]);
        let output = [];

        for (let i = 0; i < maxTokens; i++) {
            const logits = this.weights[currentIdx];
            const probs = MathUtils.softmax(logits);
            
            // सबसे ज्यादा संभावना (Probability) वाले शब्द को चुनना
            let nextIdx = probs.indexOf(Math.max(...probs));
            let nextWord = this.vocab[nextIdx];
            
            output.push(nextWord);
            currentIdx = nextIdx;
            
            // अगर AI एक ही शब्द में फँस जाए, तो उसे रोकना
            if (output.length > 2 && output[output.length-1] === output[output.length-2] && output[output.length-2] === output[output.length-3]) {
                break; 
            }
        }
        return output.join(" ");
    }
}
