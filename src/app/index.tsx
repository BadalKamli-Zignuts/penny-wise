import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

import { useAuthStore } from "../features/auth/store";
import { useSettingsStore } from "../features/settings/store";

export default function Index() {
  // Initialise from the synchronous hasHydrated() check so we don't flash
  // a redirect if hydration already completed (e.g. hot reload / fast refresh).
  const [hydrated, setHydrated] = useState(
    () => useSettingsStore.persist.hasHydrated()
  );
  const onboardingComplete = useSettingsStore((s) => s.onboardingComplete);
  const user = useAuthStore((s) => s.user);
  const authReady = useAuthStore((s) => s.ready);

  useEffect(() => {
    // Subscribe so we re-render the moment AsyncStorage finishes loading.
    const unsub = useSettingsStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    return unsub;
  }, []);

  // Render nothing (blank splash) until the store is ready.
  if (!hydrated || !authReady) return null;

  if (!onboardingComplete) return <Redirect href="/onboarding" />;
  if (!user) return <Redirect href="/(auth)/sign-in" />;

  // Check if email is verified
  if (!user.emailVerified) return <Redirect href="/(auth)/verify" />;

  return <Redirect href="/(tabs)" />;
}

