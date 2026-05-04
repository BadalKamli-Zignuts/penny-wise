import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { env, getMissingFirebaseKeys } from "../env";

const missingKeys = getMissingFirebaseKeys();

if (__DEV__ && missingKeys.length > 0) {
  console.warn(`Missing Firebase env values: ${missingKeys.join(", ")}. Copy .env.example to .env and fill Firebase config.`);
}

const app = getApps().length ? getApps()[0] : initializeApp(env.firebase);

export const firebaseAuth = (() => {
  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
})();
export const firestore = getFirestore(app);
