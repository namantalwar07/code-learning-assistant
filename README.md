# 🚀 Extended Version: Code Learning Assistant

This project extends the starter template with:
- Error Explainer
- Hint Mode
- Code Playground
- Smart Chat
- Voice Input
- Learning History



---

# 🚀 Code Learning Assistant

### On-Device AI Powered Coding Companion (React Native)

An advanced **on-device AI coding assistant** built with React Native and RunAnywhere SDK.
The app helps developers understand errors, solve problems step-by-step, execute code, and interact with AI — all **without requiring internet access**.

---

## 📱 Features

### 🐛 Error Explainer

* Paste programming errors
* Choose between **Simple** or **Technical** explanations
* Supports multiple programming languages
* Voice input support
* Text-to-Speech explanation playback
* Saves explanations to learning history

---

### 💡 Hint Mode (Step-by-Step Learning)

* Guided 4-step hint system:

  1. Strategy Hint
  2. Pseudocode
  3. Partial Code
  4. Full Solution
* Locked progression (no skipping)
* Visual progress bar
* "Try This Code" button to open solution in Playground
* Saves completed sessions to history

---

### 💬 Smart Chat

* Context-aware AI chat
* Continue from Error Explainer or Hint Mode
* Code block detection & syntax highlighting
* Voice input support
* Fully on-device inference

---

### ⚡ Code Playground

* JavaScript execution engine (safe sandboxed execution)
* Python execution support (via native module)
* Sample code templates
* Output console with execution time
* Error handling display

---

### 📚 Learning History

* Stores all:

  * Error explanations
  * Hint sessions
  * AI interactions
* Displays:

  * Total queries
  * Errors explained
  * Problems solved
  * Common topics
* Tap to view full details
* Delete individual items
* Pull-to-refresh support

---

## 🔥 On-Device AI Advantages

This app demonstrates the power of **on-device AI**:

* ✅ No internet required
* ✅ Zero API cost
* ✅ Low latency responses
* ✅ Complete data privacy
* ✅ Secure local execution
* ✅ Works offline

All AI inference runs locally using the RunAnywhere SDK.

---

## 🛠 Tech Stack

* React Native (TypeScript)
* RunAnywhere SDK (On-device LLM)
* React Navigation (Stack + Tabs)
* Native Modules (Python execution)
* Custom Code Parser for code block detection
* Syntax Highlighting
* Voice Input (Audio Streaming)
* Text-to-Speech
* Safe JavaScript Execution Engine

---

## 🧠 Architecture Overview

```
User Input
   ↓
On-Device LLM (RunAnywhere)
   ↓
Response Parser (Code Block Detection)
   ↓
UI Rendering (FormattedResponse + CodeBlock)
   ↓
Optional: Run in Playground
```

All processing happens locally on device.

---

## 📂 Project Structure

```
src/
 ├── components/
 │    ├── CodeBlock.tsx
 │    ├── FormattedResponse.tsx
 │    ├── VoiceButton.tsx
 │    └── SpeakerButton.tsx
 │
 ├── screens/
 │    ├── ErrorExplainerScreen.tsx
 │    ├── HintModeScreen.tsx
 │    ├── SmartChatScreen.tsx
 │    ├── CodePlaygroundScreen.tsx
 │    └── LearningHistoryScreen.tsx
 │
 ├── hooks/
 ├── services/
 │    └── ExecutionEngine.ts
 │
 ├── utils/
 └── navigation/
```

---

## 🚀 How to Run

### 1️⃣ Install dependencies

```
npm install
```

### 2️⃣ Clean Android build

```
cd android
./gradlew clean
cd ..
```

### 3️⃣ Run the app

```
npx react-native run-android
```

Make sure emulator or device is running.

---

## 📈 Why This Project Matters

This project demonstrates:

* Real-world React Native architecture
* AI integration in mobile apps
* Native module integration
* Code execution sandboxing
* Streaming LLM responses
* TypeScript usage
* Complex state management
* UX-focused learning design

## 🎯 Use Case

This app helps:

* Beginner programmers understand errors clearly
* Students learn step-by-step problem solving
* Developers test logic instantly
* Learners practice without internet dependency

Perfect for:

* Offline learning
* Low connectivity areas
* Privacy-sensitive environments
* Cost-efficient AI solutions

---

## 📌 Hackathon Focus

Built as a fully on-device AI coding assistant demonstrating:

* Privacy-first AI
* Zero cloud dependency
* Real-time local inference
* Offline developer tooling

---
## Future Improvements

* Monaco editor integration
* Cloud execution environment
* Multi-language expansion
* User authentication
* Cloud sync history
* iOS Python execution

👨‍💻 Authors
One For Code
B.Tech CSE | AI + Full Stack Enthusiasts
Focused on building intelligent developer tools.

⭐ If you found this interesting, feel free to star the repo!







# RunAnywhere React Native Starter App

A comprehensive starter app demonstrating the capabilities of the [RunAnywhere SDK](https://www.npmjs.com/org/runanywhere) - a privacy-first, on-device AI SDK for React Native.

![RunAnywhere](https://img.shields.io/badge/RunAnywhere-0.16.10-00D9FF)
![React Native](https://img.shields.io/badge/React%20Native-0.76.5-61DAFB)
![Platforms](https://img.shields.io/badge/Platforms-iOS%20%7C%20Android-green)

## ✨ Features

This starter app showcases four main capabilities of the RunAnywhere SDK:

### 💬 Chat (LLM Text Generation)
- Streaming text generation with token-by-token output
- Performance metrics (tokens/second, total tokens)
- Cancel generation mid-stream
- Suggested prompts for quick testing
- Beautiful chat UI with message bubbles

### 🎤 Speech-to-Text (STT)
- Real-time audio recording
- On-device transcription using Whisper models
- Audio level visualization
- Transcription history
- Privacy-first: all processing happens on device

### 🔊 Text-to-Speech (TTS)
- Neural voice synthesis with Piper TTS
- Adjustable speech rate (0.5x - 2.0x)
- Sample texts for quick testing
- Audio playback controls
- High-quality, natural-sounding voices

### ✨ Voice Pipeline (Voice Agent)
- Full voice assistant experience
- Seamless integration: Speak → Transcribe → Generate → Speak
- Real-time status updates
- Conversation history
- Complete end-to-end voice interaction

## 📦 SDK Packages Used

This app uses three RunAnywhere packages:

| Package | Purpose | NPM |
|---------|---------|-----|
| `@runanywhere/core` | Core SDK with infrastructure | [View on NPM](https://www.npmjs.com/package/@runanywhere/core) |
| `@runanywhere/llamacpp` | LLM backend (LlamaCpp) | [View on NPM](https://www.npmjs.com/package/@runanywhere/llamacpp) |
| `@runanywhere/onnx` | STT/TTS/VAD backend (ONNX) | [View on NPM](https://www.npmjs.com/package/@runanywhere/onnx) |

## 🚀 Getting Started

### Quick Start

```bash
# Clone and install
git clone https://github.com/RunanywhereAI/react-native-starter-app.git
cd react-native-starter-app
npm install

# iOS (requires pod install first)
cd ios && pod install && cd ..
npx react-native run-ios

# Android (no additional setup needed)
npx react-native run-android
```

### Prerequisites

- **Node.js** 18 or higher
- **React Native CLI** development environment ([setup guide](https://reactnative.dev/docs/environment-setup))
- **iOS:** Xcode 14+, CocoaPods, macOS
- **Android:** 
  - Android Studio
  - JDK 17+
  - Android SDK 36 (compileSdk)
  - NDK 27.1.12297006 (install via Android Studio → SDK Manager → SDK Tools → NDK)
  - Build Tools 36.0.0
- **Physical device recommended** for best performance (AI models run slowly on simulators)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/RunanywhereAI/react-native-starter-app.git
   cd react-native-starter-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   > **Note:** This runs `patch-package` automatically via postinstall to apply necessary compatibility fixes.

3. **iOS Setup**
   ```bash
   cd ios
   pod install
   cd ..
   ```
   > **Known Issue (RN 0.83):** The `@runanywhere` SDK packages use `podspecPath` in their React Native config, which the RN 0.83 CLI no longer allows. To work around this, `automaticPodsInstallation` is set to `false` in `react-native.config.js`. This means you **must always run `pod install` manually** (as shown above) before building for iOS. You may see warnings about `podspecPath` when running `run-ios` — these are harmless and can be ignored. This will be fixed in a future SDK release.

4. **Android Setup** (verify your environment)
   
   No additional setup is needed if you have Android Studio installed with the required SDK components. To verify:
   
   ```bash
   # Check that ANDROID_HOME is set (should point to your Android SDK)
   echo $ANDROID_HOME
   # Expected: /Users/<username>/Library/Android/sdk (macOS) or similar
   
   # Verify ADB is available
   adb --version
   
   # Check installed NDK versions (need 27.1.12297006)
   ls $ANDROID_HOME/ndk/
   ```
   
   If NDK 27 is missing, install it via Android Studio:
   - Open Android Studio → Settings → SDK Manager → SDK Tools tab
   - Check "Show Package Details" → expand "NDK (Side by side)"
   - Select version **27.1.12297006** and click Apply

5. **Run the app**

   **For iOS:**
   ```bash
   npx react-native run-ios
   ```

   **For Android:**
   ```bash
   npx react-native run-android
   ```

### Running with Two Terminals (Recommended)

For better control and visibility of logs, run Metro bundler and the app build in separate terminals:

**Terminal 1 - Start Metro Bundler:**
```bash
cd react-native-starter-app
npx react-native start
```

Wait until you see "Dev server ready", then in a second terminal:

**Terminal 2 - Build & Run the App:**
```bash
cd react-native-starter-app

# For iOS
npx react-native run-ios

# For Android
npx react-native run-android
```

> **Note:** The first Android build takes 5-10 minutes as it compiles native C++ code. Subsequent builds are much faster.

### Running on Physical Android Device

When running on a physical Android device, you need to set up port forwarding for the Metro bundler:

```bash
# Connect your device via USB and verify it's detected
adb devices

# Set up port forwarding (required for each USB session)
adb reverse tcp:8081 tcp:8081

# Start Metro bundler in one terminal
npx react-native start

# Run the app in another terminal
npx react-native run-android
```

> **Tip:** If you see "Could not connect to development server", run `adb reverse tcp:8081 tcp:8081` again.

### iOS Permissions

The app requires microphone access. Permissions are already configured in `ios/RunAnywhereStarter/Info.plist`:

```xml
<key>NSMicrophoneUsageDescription</key>
<string>This app needs microphone access for speech recognition and voice agent features</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>This app uses on-device speech recognition to transcribe your voice</string>
```

### Android Permissions

Required permissions are configured in `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
```

## 🏗️ Architecture

```
src/
├── App.tsx                      # Main app entry, SDK initialization
├── theme/
│   └── colors.ts               # Color palette and theme
├── services/
│   └── ModelService.tsx        # Model management (download, load, state)
├── components/
│   ├── FeatureCard.tsx         # Home screen feature cards
│   ├── ModelLoaderWidget.tsx   # Model download/load UI
│   ├── ChatMessageBubble.tsx   # Chat message UI
│   └── AudioVisualizer.tsx     # Audio level visualization
├── screens/
│   ├── HomeScreen.tsx          # Main navigation screen
│   ├── ChatScreen.tsx          # LLM chat interface
│   ├── SpeechToTextScreen.tsx  # STT interface
│   ├── TextToSpeechScreen.tsx  # TTS interface
│   └── VoicePipelineScreen.tsx # Voice agent interface
└── navigation/
    └── types.ts                # Navigation type definitions
```

## 🤖 Default Models

The app comes preconfigured with these models:

| Model | Purpose | Size | Source |
|-------|---------|------|--------|
| SmolLM2 360M Q8_0 | Text generation | ~400MB | HuggingFace |
| Sherpa ONNX Whisper Tiny EN | Speech recognition | ~80MB | RunAnywhere |
| Piper TTS (US English) | Voice synthesis | ~100MB | RunAnywhere |

## 🎨 Customization

### Using Different Models

You can modify `src/services/ModelService.tsx` to use different models:

```typescript
// LLM Model - Example with a larger model
await LlamaCpp.addModel({
  id: 'qwen2-1.5b-q4',
  name: 'Qwen2 1.5B Q4',
  url: 'https://huggingface.co/...',
  memoryRequirement: 1500000000,
});

// STT Model - Example with multilingual support
await Onnx.addModel({
  id: 'whisper-small-multi',
  name: 'Whisper Small Multilingual',
  url: 'https://...',
  modality: ModelCategory.speechRecognition,
});
```

### Theming

The app uses a custom dark theme defined in `src/theme/colors.ts`. You can customize:

```typescript
export const AppColors = {
  primaryDark: '#0A0E1A',
  accentCyan: '#00D9FF',
  accentViolet: '#8B5CF6',
  // ... more colors
};
```

## 🔒 Privacy

All AI processing happens **on-device**. No data is sent to external servers. The models are downloaded once and stored locally on the device.

- ✅ No internet required after model download
- ✅ All inference runs locally
- ✅ Your conversations never leave your device
- ✅ No API keys or cloud services needed

## 🐛 Troubleshooting

### "Could not connect to development server" (Android)
This happens on physical Android devices because they can't reach `localhost` on your computer.

```bash
# Set up port forwarding
adb reverse tcp:8081 tcp:8081

# Verify Metro is running
curl http://localhost:8081/status  # Should return "packager-status:running"
```

### CMake Error: "add_subdirectory given source which is not an existing directory"
This happens when codegen hasn't run yet. Simply run the build again:

```bash
cd android && ./gradlew assembleDebug
```

The second run will succeed as codegen completes.

### Models not downloading
- Check your internet connection
- Ensure sufficient storage space (models can be 100MB-1GB)
- Check iOS/Android permissions
- Clear app data and try again

### Microphone not working
- Grant microphone permission in device settings
- Restart the app after granting permission
- On Android, check if permission is granted in AndroidManifest.xml

### Low performance
- Smaller models (like SmolLM2 360M) work better on mobile devices
- Close other apps to free up memory
- Use quantized models (Q4/Q8) for better performance
- Ensure you're running on a physical device (simulators are slow)

### Build errors
- Clear cache: `cd android && ./gradlew clean` or `cd ios && rm -rf Pods Podfile.lock`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- For iOS: `cd ios && pod install --repo-update`
- For Android: Delete `android/app/build` and `android/.gradle` folders, then rebuild

### Android NDK not found
If you see errors about NDK not found:
```bash
# Check if NDK 27 is installed
ls ~/Library/Android/sdk/ndk/

# If missing, install via Android Studio SDK Manager or:
sdkmanager "ndk;27.1.12297006"
```

### Android SDK location not found
Ensure `local.properties` exists in the `android/` folder with your SDK path:
```properties
sdk.dir=/Users/<username>/Library/Android/sdk
```
This file is auto-generated when you open the project in Android Studio.

### Patches not applied
If you see build errors related to `react-native-nitro-modules`, ensure patches are applied:

```bash
npx patch-package
```

This should run automatically via `postinstall`, but you can run it manually if needed.

## 📚 Documentation

- [RunAnywhere SDK Documentation](https://docs.runanywhere.ai)
- [React Native Documentation](https://reactnative.dev)
- [API Reference](https://docs.runanywhere.ai/api)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This starter app is provided under the MIT License. The RunAnywhere SDK is licensed under the [RunAnywhere License](https://runanywhere.ai/license).

For commercial licensing inquiries, contact: san@runanywhere.ai

## 🆘 Support

- **GitHub Issues**: [Report bugs](https://github.com/RunanywhereAI/runanywhere-sdks/issues)
- **Email**: san@runanywhere.ai
- **Documentation**: [runanywhere.ai](https://runanywhere.ai)
- **Discord**: [Join our community](https://discord.gg/runanywhere)

## 🎯 Next Steps

1. **Explore the code**: Check out each screen to understand how the SDK works
2. **Try different models**: Swap in your own models to see what works best
3. **Build your app**: Use this as a foundation for your own AI-powered app
4. **Share feedback**: Let us know what you think and what features you'd like to see

## ⭐ Acknowledgments

Built with:
- [React Native](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated)
- [React Native Linear Gradient](https://github.com/react-native-linear-gradient/react-native-linear-gradient)

Special thanks to the open-source community and the RunAnywhere team!

---

Made with ❤️ by the RunAnywhere team
