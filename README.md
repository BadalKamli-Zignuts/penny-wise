# Penny Wise 🪙

An AI-powered expense tracker and financial behavior coach built with **Expo SDK 55**, **Expo Router**, **Firebase (Auth & Firestore)**, **Zustand**, **NativeWind**, and **Groq AI**.

Penny Wise is not just a generic expense tracker with a chat interface attached—it is a comprehensive AI financial coach designed to help users understand *what* changed, *what* is risky, and *what* to do next with their money.

Video recording: https://drive.google.com/file/d/1uNAq11dzmxaTTpsB0UlompbUXTZKT6Bt/view?usp=sharing


---

## 🌟 Key Features

### 1. Interactive Onboarding
- A premium, multi-slide introduction explaining key features (automatic categorization, AI coaching, smart spending).
- State persistence ensuring it is only shown once to first-time users.

### 2. Live Dashboard & Analytics
- **Mini Spending Graph**: Visualizes weekly/monthly trends directly on the dashboard.
- **Victory Native Charts**: Provides breakdown donut charts and line series comparing current and previous month spending.
- **Budget Tracking**: Live progress bars displaying remaining thresholds per category.

### 3. Expense & Income Management
- **Optimistic UI Updates**: Local state updates instantly when adding/updating/deleting expenses, syncing with Firestore in the background.
- **Categories**: Automatically tags expenses and supports custom monthly budgets.
- **Budget & Income Modal**: Easy-to-use, bottom-sheet style overlays for defining monthly budgets and recording new income sources.

### 4. AI Financial Behavior Coach (Lumen)
- **AI Chat Screen**: Chat with Lumen, a behavior coach powered by Groq LLM API.
- **Contextual Awareness**: Lumen knows your exact numbers (current/previous month totals, budgets, categories, anomalies) and answers directly.
- **Actionable AI Insights**: Scans daily and monthly spending to deliver customized, non-judgmental advice.

### 5. Custom Settings
- Manage user profile, name, currency (INR `₹`, USD `$`, EUR `€`), and choose the AI's response tone (`casual`, `strict`, `advisor`).
- Complete Firebase Sign-out functionality.

---

## 🛠️ Tech Stack

- **Framework**: [Expo SDK 55](https://expo.dev/) (React Native)
- **Routing**: [Expo Router v3](https://docs.expo.dev/router/introduction/) (File-based navigation + API Routes)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Utility-first styling for React Native)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) + [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) for local persistence
- **Backend / DB**: [Firebase v12](https://firebase.google.com/) (Authentication and Firestore database)
- **AI Service**: [Groq LLM API](https://groq.com/) (using serverless Expo Router API Routes to keep API keys secure)
- **Data Visualization**: [Victory Native](https://formidable.com/open-source/victory-native/)

---

## 📁 Architecture & File Structure

```text
src/
├── app/                  # Expo Router navigation and screens
│   ├── (auth)/          # Authentication routes (Sign-In, Sign-Up, Verify Email)
│   ├── (tabs)/          # Main Tab navigation (Dashboard, Analytics, Coach Chat, Timeline)
│   ├── api/ai/          # Serverless API routes (+api.ts) for Groq integration
│   ├── expense/         # Screens for adding/editing expenses
│   ├── onboarding/      # Onboarding slide flow
│   ├── index.tsx        # App entry point (controls auth and onboarding redirects)
│   └── settings.tsx     # Settings Screen
├── components/          # Reusable UI primitives (GlassCard, Buttons, etc.)
├── constants/           # Global constants (Category lists, limits, etc.)
├── features/            # Feature-sliced modules (stores, logic, types)
│   ├── auth/            # Auth Zustand store & Firebase hooks
│   ├── budgets/         # Budget & Income components, styling & rules
│   ├── coach/           # AI chat state and widgets
│   ├── dashboard/       # Dashboard components and layout
│   ├── expenses/        # CRUD state and components for expenses
│   └── settings/        # Settings Zustand store
├── lib/                 # Core utilities (Firebase config, helpers)
└── theme/               # Harmonious color tokens and CSS configurations
```

---

## 🚀 Setup & Installation

Follow these steps to run Penny Wise locally on your development machine:

### Prerequisites
* **Node.js**: Make sure you have **Node.js >= 20.19.4** installed (RSC/Server Functions require this version or higher to compile).
* **Device / Emulator**: Install the Expo Go app on your physical iOS/Android device, or set up a local simulator/emulator.

### 1. Clone & Install Dependencies
Install the package dependencies, including the peer package dependency required for React Server Functions:
```bash
# Install core package dependencies
npm install

# Install the server dom package with legacy peer deps to resolve React 19 dependency tree conflicts
npm install react-server-dom-webpack --legacy-peer-deps
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```
Open `.env` and fill in your credentials:

#### Firebase Config (from Firebase Console):
1. Create a Firebase project.
2. Register a new Web App in your project settings to obtain these values:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```
3. Enable **Email/Password** authentication under Auth.
4. Enable **Cloud Firestore** in test mode.

#### Groq API Config (from Groq Console):
Get a Groq API key and choose a model (e.g. `llama3-70b-8192` or `llama3-8b-8192`):
```env
GROQ_API_KEY=gsk_your_groq_key
GROQ_MODEL=llama3-70b-8192
```

> [!IMPORTANT]
> The `GROQ_API_KEY` is referenced only in server-side files (like [chat+api.ts](file:///Users/ztlab131/Desktop/penny-wise-main/src/app/api/ai/chat+api.ts) or the server function [actions.ts](file:///Users/ztlab131/Desktop/penny-wise-main/src/features/coach/actions.ts)). It is never loaded into the client bundle, keeping your API key safe.

### 3. Run the App
Launch the Expo development server:
```bash
npx expo start --clear
```
- Press **i** to run on the iOS Simulator.
- Press **a** to run on the Android Emulator.
- Scan the QR code with your device camera (iOS) or Expo Go app (Android) to run on a physical device.

---

## 🧪 NPM Scripts

Run the following commands inside the root directory to verify code health:

- **Start Expo**: `npm run start` (or `npx expo start`)
- **Run Tests**: `npm run test` (Runs Jest unit tests for state stores, analytics, and helper logic)
- **Type Checking**: `npm run typecheck` (Runs `tsc` to verify TypeScript compile health)
- **Linting**: `npm run lint` (Checks project syntax and format conventions)

---

## 💡 Developer Notes

### Expo Server Functions (React Server Components)
We use **Expo Server Functions** (`"use server"`) to power the AI Coach chat. This feature is enabled in [app.json](file:///Users/ztlab131/Desktop/penny-wise-main/app.json) by:
- Setting `web.output` to `"server"` (instead of `"static"`).
- Adding `reactServerFunctions: true` to the `experiments` object.

If you need to switch back to traditional REST API routes, you can toggle the implementation inside `sendMessage` in [store.ts](file:///Users/ztlab131/Desktop/penny-wise-main/src/features/coach/store.ts).

### Resetting Onboarding
Because the onboarding screen persists its completion state under `onboardingComplete` in `AsyncStorage`, it only runs once per device/installation. 

To reset it for testing, choose one of the following options:
1. **Programmatic Reset**: Temporarily add the following line inside `src/app/index.tsx`:
   ```typescript
   useSettingsStore.setState({ onboardingComplete: false });
   ```
2. **Clear Cache**: In Expo Go, long-press the project and select **Clear client data**. On emulators, clear the app's cache/storage from app settings.
