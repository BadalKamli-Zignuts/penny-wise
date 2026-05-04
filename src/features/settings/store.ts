import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CoachTone } from "../coach/types";

type SettingsState = {
  name: string;
  currency: string;
  tone: CoachTone;
  onboardingComplete: boolean;
  setName: (name: string) => void;
  setCurrency: (currency: string) => void;
  setTone: (tone: CoachTone) => void;
  completeOnboarding: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      name: "",
      currency: "₹",
      tone: "casual",
      onboardingComplete: false,
      setName: (name) => set({ name }),
      setCurrency: (currency) => set({ currency }),
      setTone: (tone) => set({ tone }),
      completeOnboarding: () => set({ onboardingComplete: true }),
    }),
    {
      name: "penny-wise-settings",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
