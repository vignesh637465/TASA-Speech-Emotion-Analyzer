# Project 5: Speech Emotion Analyzer

A beginner-friendly web application that analyzes spoken voice characteristics—speaking speed (WPM), audio volume energy, pause intervals, and transcript keywords—to estimate human speech emotion (**Happy**, **Sad**, **Angry**, **Neutral**). Created for the college subject **Text and Speech Analysis**.

> ℹ️ **Educational Disclaimer:** This application is strictly an educational project demonstrating acoustic metric extraction and rule-based heuristic estimation. It does not claim professional medical or psychological diagnostic accuracy.

---

## 📌 1. Title
**Speech Emotion Analyzer**

## 📝 2. Description
The **Speech Emotion Analyzer** provides a multimodal demonstration combining audio signal processing via the **Web Audio API** (`AnalyserNode` oscilloscope volume energy) and acoustic speed calculations (Words Per Minute via **Web Speech API**). It computes speaking pace, volume intensity, and transcript sentiment signals to estimate speech emotion on an interactive dashboard.

## 🎯 3. Objectives
* Learn fundamental concepts of Acoustic Speech Feature Extraction (tempo, amplitude/energy, WPM).
* Utilize browser-native `AudioContext` and `AnalyserNode` APIs for real-time waveform visualization.
* Combine acoustic metrics with transcript sentiment signals for multimodal estimation.
* Provide clear, transparent rule explanations suitable for college viva defense.

## ✨ 4. Features
* **Live Audio Visualizer:** Oscilloscope frequency visualizer rendered in real time on HTML5 Canvas.
* **Speech Metrics Dashboard:** Calculates Words Per Minute (WPM), total duration, word count, and audio energy level (Low, Medium, High).
* **Estimated Emotion Output:** Displays primary estimated emotion (Happy 😊, Sad 😢, Angry 😡, Neutral 😐) with confidence score.
* **Spoken Transcript Display:** Live speech capture and transcription.
* **Transparent Rule Breakdown:** Displays step-by-step logic explaining how the acoustic & lexical signals were combined.
* **Educational Disclaimer:** Clear banner stating demo scope.

## 🛠️ 5. Technologies Used
* **HTML5:** Canvas visualizer container, semantic document structure.
* **CSS3:** Dark-theme audio dashboard layout, responsive grid, pulsing mic state.
* **JavaScript (ES6+):** Web Audio API (`AudioContext`, `AnalyserNode`, `getUserMedia`), Web Speech API, and rule-based decision matrix.

## 🔬 6. How It Works (Viva Explanation)
The analysis follows a **Multimodal Speech Processing Pipeline**:

1. **Acoustic Energy & Frequency Sampling:**
   * `navigator.mediaDevices.getUserMedia()` streams live microphone audio.
   * `AudioContext` and `AnalyserNode` sample the RMS volume amplitude frame-by-frame:
     $$\text{RMS Volume} = \frac{1}{N} \sum_{i=1}^{N} \text{FrequencyData}[i]$$
   * Categorizes volume intensity as **Low** (<15), **Medium** (15-45), or **High** (>45).
2. **Speaking Speed (WPM) Calculation:**
   * Tracks total speech duration $T$ in seconds and transcribed word count $W$:
     $$\text{WPM} = \left( \frac{W}{T} \right) \times 60$$
   * Categorizes pace as **Slow** (<90 WPM), **Normal** (90–140 WPM), or **Fast** (>140 WPM).
3. **Transcript Lexical Keyword Extraction:**
   * Matches transcript against emotion lexicons (Happy, Sad, Angry keywords).
4. **Multimodal Decision Matrix:**
   * **Angry 😡:** Fast WPM (>150) + High Audio Volume Energy + Agitated keywords.
   * **Happy 😊:** Fast WPM (>130) + High/Medium Volume Energy + Positive keywords.
   * **Sad 😢:** Slow WPM (<85) + Low Volume Energy + Longer pauses.
   * **Neutral 😐:** Normal WPM (90–130) + Balanced Volume Energy.

## 📥 7. Installation / Setup
No node modules or external servers required.
1. Download or clone this folder:
   ```bash
   git clone <repository-url>
   cd 05-speech-emotion-analyzer
   ```

## 🚀 8. How to Run
Open `index.html` in Google Chrome, Microsoft Edge, or Safari.

* Click **Start Recording**, grant microphone permissions, speak into your mic, and click **Stop & Analyze**.

## 💡 9. Example Input & Output

* **Input (Spoken Audio):** Spoken rapidly (160 WPM) with high volume: *"I am so angry that this happened again!"*
* **Output:**
  * **Estimated Emotion:** Angry 😡
  * **Confidence:** 85%
  * **Speaking Speed:** 160 WPM (Fast Pace)
  * **Audio Energy:** High Volume
  * **Rule Explanation:** Fast pace (>150 WPM) + High volume energy + Angry keyword matches.

## 📁 10. Project Structure
```
05-speech-emotion-analyzer/
├── index.html        # HTML layout & canvas visualizer container
├── style.css         # Audio dashboard styling & layout
├── script.js         # Web Audio API, Web Speech API & estimation rules
└── README.md         # Comprehensive project documentation
```

## ⚠️ 11. Limitations
* Does not extract Pitch (F0 contour) or MFCCs (Mel-Frequency Cepstral Coefficients) which require complex machine learning models.
* Highly reliant on browser mic gain settings and room noise levels.

## 🔮 12. Future Enhancements
* Integrate WebAssembly-compiled pitch detection algorithms (e.g. YIN algorithm for pitch/fundamental frequency F0).
* Support audio file upload (.wav / .mp3) for offline analysis.
* Generate downloadable PDF speech metric summary reports.

## 📷 13. Screenshots
*(Add your project screenshots here when uploading to GitHub)*

```
+-----------------------------------------------------------+
|                  Speech Emotion Analyzer                  |
| [🎙️ Start Recording]  [⏹️ Stop & Analyze]                 |
| Visualizer: [ ▅ █ ▇ ▅ ▃ ▇ █ ▅ ]                          |
|                                                           |
| Result: Happy 😊 (80%) | WPM: 145 | Energy: High         |
+-----------------------------------------------------------+
```

## 📜 14. License
This project is open-source under the [MIT License](LICENSE). Educational demo created for college coursework.
