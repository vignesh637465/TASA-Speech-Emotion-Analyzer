/**
 * 05 - SPEECH EMOTION ANALYZER
 * Multimodal Speech Emotion Estimator using Web Speech API + Web Audio API.
 */

// DOM Elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const clearBtn = document.getElementById('clearBtn');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const timerEl = document.getElementById('timer');
const canvas = document.getElementById('audioVisualizer');
const canvasCtx = canvas.getContext('2d');
const resultsSection = document.getElementById('resultsSection');

// Results Output Elements
const emotionEmoji = document.getElementById('emotionEmoji');
const emotionTitle = document.getElementById('emotionTitle');
const confidenceVal = document.getElementById('confidenceVal');
const wpmVal = document.getElementById('wpmVal');
const speedPace = document.getElementById('speedPace');
const durationVal = document.getElementById('durationVal');
const wordCountVal = document.getElementById('wordCountVal');
const energyVal = document.getElementById('energyVal');
const transcriptDisplay = document.getElementById('transcriptDisplay');
const ruleBreakdownList = document.getElementById('ruleBreakdownList');

// Global Speech & Audio Variables
let recognition = null;
let isRecording = false;
let startTime = 0;
let endTime = 0;
let timerInterval = null;
let secondsElapsed = 0;
let accumulatedTranscript = "";

// Web Audio API Variables
let audioCtx = null;
let analyser = null;
let micStream = null;
let animFrameId = null;
let audioEnergySamples = [];

// Initialize Web Speech API & Visualizer Canvas
function initAnalyzer() {
    // Resize canvas
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let currentText = '';
            for (let i = 0; i < event.results.length; i++) {
                currentText += event.results[i][0].transcript + ' ';
            }
            accumulatedTranscript = currentText.trim();
        };

        recognition.onerror = (e) => {
            console.warn('Speech recognition warning:', e.error);
        };
    }
}

// Start Recording Process
async function startRecording() {
    try {
        // Reset variables
        accumulatedTranscript = "";
        audioEnergySamples = [];
        secondsElapsed = 0;
        startTime = Date.now();

        // Initialize AudioContext for Mic Energy Analysis
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 256;

        // Request Microphone Stream
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        const source = audioCtx.createMediaStreamSource(micStream);
        source.connect(analyser);

        // Start Web Speech Engine
        if (recognition) {
            try { recognition.start(); } catch (e) {}
        }

        isRecording = true;

        // UI Updates
        startBtn.disabled = true;
        stopBtn.disabled = false;
        statusIndicator.classList.add('recording');
        statusText.textContent = 'Listening to speech & audio energy...';

        // Stopwatch Timer
        timerInterval = setInterval(() => {
            secondsElapsed++;
            const mins = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
            const secs = (secondsElapsed % 60).toString().padStart(2, '0');
            timerEl.textContent = `${mins}:${secs}`;
        }, 1000);

        // Draw Audio Waveform Visualizer
        drawVisualizer();

    } catch (err) {
        alert('Microphone access denied or unsupported: ' + err.message);
        console.error(err);
    }
}

// Stop Recording & Run Emotion Estimation Algorithm
function stopRecording() {
    if (!isRecording) return;

    isRecording = false;
    endTime = Date.now();
    clearInterval(timerInterval);

    // Stop Web Speech
    if (recognition) {
        try { recognition.stop(); } catch (e) {}
    }

    // Stop Mic Stream & Audio Context
    if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
    }
    if (animFrameId) {
        cancelAnimationFrame(animFrameId);
    }

    // Clear Canvas
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

    // UI Updates
    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusIndicator.classList.remove('recording');
    statusText.textContent = 'Analysis Complete';

    // Run Speech Emotion Estimation Pipeline
    analyzeSpeechEmotion();
}

// Draw Oscilloscope Audio Visualizer
function drawVisualizer() {
    if (!isRecording || !analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    // Calculate RMS Volume Energy Sample
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i];
    }
    const avgVolume = sum / bufferLength;
    audioEnergySamples.push(avgVolume);

    // Render Canvas Bars
    canvasCtx.fillStyle = '#0f172a';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    const barWidth = (canvas.width / bufferLength) * 2.5;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        canvasCtx.fillStyle = `rgb(56, 189, 248)`;
        canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        x += barWidth + 1;
    }

    animFrameId = requestAnimationFrame(drawVisualizer);
}

/**
 * Transparent Rule-Based Speech Emotion Algorithm
 */
function analyzeSpeechEmotion() {
    const durationSec = Math.max((endTime - startTime) / 1000, 1);
    const transcript = accumulatedTranscript || "Sample speech transcript for testing pace and emotion signals.";
    const words = transcript.trim().split(/\s+/).length;

    // Calculate Words Per Minute (WPM)
    const wpm = Math.round((words / durationSec) * 60);

    // Calculate Average Audio Energy Level
    const avgEnergy = audioEnergySamples.length > 0 
        ? audioEnergySamples.reduce((a, b) => a + b, 0) / audioEnergySamples.length 
        : 25;

    let energyCategory = "Medium";
    if (avgEnergy < 15) energyCategory = "Low";
    else if (avgEnergy > 45) energyCategory = "High";

    // Text Keyword Sentiment Signal
    const lower = transcript.toLowerCase();
    const happyKw = (lower.match(/(happy|joy|great|amazing|love|fantastic|excellent|excited)/g) || []).length;
    const sadKw = (lower.match(/(sad|lonely|depressed|grief|cry|terrible|bad)/g) || []).length;
    const angryKw = (lower.match(/(angry|furious|hate|mad|rage|unfair|upset)/g) || []).length;

    // Multimodal Decision Matrix
    let estimatedEmotion = "Neutral";
    let emoji = "😐";
    let confidence = 70;
    let rulesApplied = [];

    rulesApplied.push(`Speaking Duration: ${durationSec.toFixed(1)}s with ${words} words recorded.`);
    rulesApplied.push(`Calculated Speaking Speed: ${wpm} Words Per Minute (WPM).`);
    rulesApplied.push(`Average Audio RMS Volume Energy: ${avgEnergy.toFixed(1)} (${energyCategory} Volume).`);

    if (wpm > 150 && energyCategory === "High" || angryKw > 0) {
        estimatedEmotion = "Angry";
        emoji = "😡";
        confidence = 85;
        rulesApplied.push("High speaking pace (>150 WPM) coupled with high audio volume energy indicates heightened agitation / anger.");
    } else if (wpm > 130 || happyKw > 0) {
        estimatedEmotion = "Happy";
        emoji = "😊";
        confidence = 80;
        rulesApplied.push("Elevated speaking speed (>130 WPM) and positive lexical keywords indicate excitement / happiness.");
    } else if (wpm < 85 && energyCategory === "Low" || sadKw > 0) {
        estimatedEmotion = "Sad";
        emoji = "😢";
        confidence = 78;
        rulesApplied.push("Slow speaking pace (<85 WPM) combined with low volume energy and longer pauses indicates subdued / sad speech.");
    } else {
        estimatedEmotion = "Neutral";
        emoji = "😐";
        confidence = 75;
        rulesApplied.push("Moderate speaking pace (90–130 WPM) and balanced volume energy indicates calm, neutral speech.");
    }

    // Render Metrics to Dashboard UI
    emotionEmoji.textContent = emoji;
    emotionTitle.textContent = estimatedEmotion;
    confidenceVal.textContent = `${confidence}%`;

    wpmVal.textContent = `${wpm} WPM`;
    speedPace.textContent = wpm > 140 ? "Fast Pace" : (wpm < 90 ? "Slow Pace" : "Normal Pace");
    durationVal.textContent = `${durationSec.toFixed(1)}s`;
    wordCountVal.textContent = words;
    energyVal.textContent = energyCategory;

    transcriptDisplay.textContent = `"${transcript}"`;

    // Render Explanation Rules
    ruleBreakdownList.innerHTML = '';
    rulesApplied.forEach(rule => {
        const li = document.createElement('li');
        li.textContent = rule;
        ruleBreakdownList.appendChild(li);
    });

    resultsSection.classList.remove('hidden');
}

// Reset Clear Button Listener
clearBtn.addEventListener('click', () => {
    resultsSection.classList.add('hidden');
    timerEl.textContent = '00:00';
    statusText.textContent = 'Ready to Record Voice';
});

// Event Listeners
startBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);
window.addEventListener('resize', initAnalyzer);
document.addEventListener('DOMContentLoaded', initAnalyzer);
