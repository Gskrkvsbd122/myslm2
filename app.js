// Register Service Worker for Complete Offline Standalone Execution
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('PWA Service Worker Loaded successfully'))
            .catch(err => console.error('PWA Registration Aborted', err));
    });
}

// Instantiate Global Architecture
const model = new NanoTransformer(256);

// Extract DOM Framework Elements
const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const trainDataInput = document.getElementById('train-data');
const trainBtn = document.getElementById('train-btn');
const statusText = document.getElementById('status-text');
const progressBar = document.getElementById('progress-bar');

function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    msgDiv.textContent = text;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// In-Browser Live Dataset Backpropagation Loop
async function runLiveTraining() {
    const textData = trainDataInput.value;
    if (textData.length < 2) {
        alert("Please input a longer text sequence dataset to parse.");
        return;
    }

    trainBtn.disabled = true;
    statusText.textContent = "Status: Training Synapses...";
    progressBar.style.width = "0%";

    const totalEpochs = 150; 
    
    for (let epoch = 0; epoch < totalEpochs; epoch++) {
        for (let i = 0; i < textData.length - 1; i++) {
            const currentToken = textData.charCodeAt(i) % 256;
            const nextToken = textData.charCodeAt(i + 1) % 256;
            
            // Optimize weights row vectors
            model.trainStep(currentToken, nextToken, 0.2);
        }

        // GUI Frame Progress update pacing logic
        if (epoch % 5 === 0) {
            const progressPercentage = Math.floor((epoch / totalEpochs) * 100);
            progressBar.style.width = `${progressPercentage}%`;
            await new Promise(resolve => setTimeout(resolve, 10)); // Prevent browser thread freeze
        }
    }

    progressBar.style.width = "100%";
    statusText.textContent = "Status: 100% Fully Trained!";
    trainBtn.disabled = false;
    appendMessage("System: AI weights updated via on-device learning! Try entering keywords now.", "system");
}

// Prompt Generation Call
function handleGenerateText() {
    const prompt = userInput.value;
    if (!prompt) return;

    appendMessage(prompt, 'user');
    userInput.value = '';

    // Transformer Forward Pass Prediction Delay emulation
    setTimeout(() => {
        const aiOutput = model.generate(prompt, 30);
        appendMessage(aiOutput, 'model');
    }, 200);
}

// Attach UI Listeners
trainBtn.addEventListener('click', runLiveTraining);
sendBtn.addEventListener('click', handleGenerateText);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleGenerateText();
});
