// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js');
    });
}

// Initialize New Word-Level Model
const model = new NanoTransformer();

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

// Run Training
function runLiveTraining() {
    const textData = trainDataInput.value.trim();
    if (textData.split(" ").length < 3) {
        alert("Please enter a few words to train on!");
        return;
    }

    trainBtn.disabled = true;
    statusText.textContent = "Status: Learning words...";
    progressBar.style.width = "50%";

    // Allow UI to update before heavy math
    setTimeout(() => {
        model.train(textData, 300, 0.5); // 300 epochs for solid memory
        
        progressBar.style.width = "100%";
        statusText.textContent = "Status: 100% Fully Trained!";
        trainBtn.disabled = false;
        appendMessage("System: I have learned your words! Try typing one of them.", "system");
    }, 100);
}

// Generate Response
function handleGenerateText() {
    const prompt = userInput.value.trim();
    if (!prompt) return;

    appendMessage(prompt, 'user');
    userInput.value = '';

    setTimeout(() => {
        const aiOutput = model.generate(prompt, 10);
        appendMessage(aiOutput, 'model');
    }, 300);
}

trainBtn.addEventListener('click', runLiveTraining);
sendBtn.addEventListener('click', handleGenerateText);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleGenerateText();
});
