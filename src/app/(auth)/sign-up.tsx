import { Link, router } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";

import { GradientButton } from "../../components/ui/GradientButton";
import { Screen } from "../../components/ui/Screen";
import { useSettingsStore } from "../../features/settings/store";
import { signUpWithEmail } from "../../lib/firebase/auth";
import { colors } from "../../theme/colors";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const setUserName = useSettingsStore((state) => state.setName);

  async function signUp() {
    if (!name.trim()) {
      Alert.alert("Name required", "Please enter your name");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Email required", "Please enter your email");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Password too short", "Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await signUpWithEmail(email, password);
      // Save name to settings
      setUserName(name.trim());
      router.replace("/(auth)/verify");
    } catch (error: any) {
      Alert.alert(
        "Sign up failed",
        error.message || "Please check your Firebase configuration in .env",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen scroll={false} style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            Start tracking your expenses with AI-powered insights
          </Text>
          <View style={styles.form}>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={colors.secondaryText}
              style={styles.input}
              autoCapitalize="words"
            />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={colors.secondaryText}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password (min 6 characters)"
              placeholderTextColor={colors.secondaryText}
              style={styles.input}
              secureTextEntry
            />
            <GradientButton
              label={loading ? "Creating account..." : "Create account"}
              onPress={signUp}
              disabled={loading}
            />
            <Text style={styles.linkText}>
              Already have one?{" "}
              <Link href="/(auth)/sign-in" style={styles.link}>
                Sign in
              </Link>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { justifyContent: "center" },
  container: { flex: 1, justifyContent: "center" },
  content: { flex: 1, justifyContent: "center" },
  title: {
    color: colors.primaryText,
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: 0,
  },
  subtitle: { color: colors.secondaryText, fontSize: 16, lineHeight: 23 },
  form: { gap: 14, marginTop: 24 },
  input: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    color: colors.primaryText,
    fontSize: 16,
  },
  linkText: { textAlign: "center", color: colors.secondaryText, marginTop: 8 },
  link: { color: colors.cyan, fontWeight: "800" },
});
