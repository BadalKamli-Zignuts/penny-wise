# Penny Wise Mobile App

AI-powered expense tracker and financial behavior coach built with Expo SDK 55, Expo Router, Firebase, Zustand, NativeWind, and Groq.

Video recording: https://drive.google.com/file/d/1uNAq11dzmxaTTpsB0UlompbUXTZKT6Bt/view?usp=sharing

## Setup

1. Copy `.env.example` to `.env`.
2. Create a Firebase project and enable Email/Password auth.
3. Create Firestore in test mode for local development.
4. Fill the Firebase `EXPO_PUBLIC_*` values.
5. Create a Groq API key and set `GROQ_API_KEY`.
6. Run `npm install`.
7. Run `npx expo start --clear`.

## Scripts

- `npm run start` starts Expo.
- `npm run test` runs unit tests.
- `npm run typecheck` runs TypeScript.
- `npm run lint` runs Expo lint.

## Notes

Firebase credentials are required to sign in and reach onboarding. Groq credentials are required for live AI responses. Production calls are separated correctly: Firebase code lives under `src/lib/firebase`, and Groq requests go through `src/app/api/ai`.
