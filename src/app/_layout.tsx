import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";

import { useAuthStore } from "../features/auth/store";
import { subscribeToAuth } from "../lib/firebase/auth";
import { colors } from "../theme/colors";

export default function RootLayout() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = subscribeToAuth((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, [setUser]);

  return (
    <ThemeProvider value={DarkTheme}>
      <StatusBar style="light" backgroundColor={colors.bg} />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="onboarding/index" />
        <Stack.Screen name="(tabs)" options={{
          title: "Home"
        }} />
        <Stack.Screen name="expense/new" options={{ presentation: "modal" }} />
        <Stack.Screen name="expense/[id]" options={{ presentation: "modal" }} />
        <Stack.Screen name="activity" options={{
            headerShown: true,
            headerBackButtonDisplayMode: "minimal",
            headerTitle: "Activities",
            headerTintColor: colors.violet
          }}
        />
        <Stack.Screen name="settings" options={{
            headerShown: true,
            headerBackButtonMenuEnabled: false,
            headerBackButtonDisplayMode: "minimal",
            headerTitle: "Settings",
            headerTintColor: colors.violet
          }}
        />
        <Stack.Screen name="insights" options={{
            headerShown: true,
            headerBackButtonDisplayMode: "minimal",
            headerTitle: "AI Insights",
            headerTintColor: colors.violet
          }}
        />
        <Stack.Screen name="budget-income" options={{
            headerShown: true,
            headerBackButtonDisplayMode: "minimal",
            headerTitle: "Budget & Income",
            headerTintColor: colors.violet
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
