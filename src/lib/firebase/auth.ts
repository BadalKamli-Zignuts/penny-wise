import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

import { firebaseAuth } from "./config";

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(firebaseAuth, callback);
}

export async function signInWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(
    firebaseAuth,
    email.trim(),
    password,
  );

  // Check if email is verified
  if (!credential.user.emailVerified) {
    throw new Error("EMAIL_NOT_VERIFIED");
  }

  return credential;
}

export async function signUpWithEmail(email: string, password: string) {
  const credential = await createUserWithEmailAndPassword(
    firebaseAuth,
    email.trim(),
    password,
  );
  await sendEmailVerification(credential.user);
  return credential;
}

export async function checkEmailVerification(): Promise<boolean> {
  const user = firebaseAuth.currentUser;
  if (!user) return false;

  // Reload user to get latest emailVerified status
  await user.reload();
  return user.emailVerified;
}

export async function resendVerificationEmail(): Promise<void> {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("No user logged in");

  await sendEmailVerification(user);
}

export async function signOutUser() {
  await signOut(firebaseAuth);
}
