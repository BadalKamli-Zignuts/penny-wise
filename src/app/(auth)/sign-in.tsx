import { Link, router } from "expo-router";
import { LockKeyhole, Mail, Sparkles } from "lucide-react-native";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, View } from "react-native";

import { GradientButton } from "../../components/ui/GradientButton";
import { Screen } from "../../components/ui/Screen";
import { signInWithEmail } from "../../lib/firebase/auth";
import { colors } from "../../theme/colors";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    try {
      await signInWithEmail(email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      if (error.message === "EMAIL_NOT_VERIFIED") {
        Alert.alert(
          "Email not verified",
          "Please verify your email before signing in. Check your inbox for the verification link.",
          [
            { text: "OK" },
            {
              text: "Go to Verification",
              onPress: () => router.push("/(auth)/verify")
            }
          ]
        );
      } else {
        Alert.alert(
          "Sign in failed",
          "Check your email and password, or verify your Firebase configuration.",
        );
      }
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
          <View style={styles.brand}>
            <View style={styles.orb}>
              <Sparkles size={28} color={colors.primaryText} />
            </View>
            <Text style={styles.title}>Penny Wise</Text>
            <Text style={styles.subtitle}>Your AI financial behavior coach.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputWrap}>
              <Mail size={18} color={colors.secondaryText} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor={colors.secondaryText}
                style={styles.input}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputWrap}>
              <LockKeyhole size={18} color={colors.secondaryText} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor={colors.secondaryText}
                style={styles.input}
                secureTextEntry
              />
            </View>
            <GradientButton
              label={loading ? "Signing in..." : "Sign in"}
              onPress={signIn}
            />
            <Text style={styles.linkText}>
              New here?{" "}
              <Link href="/(auth)/sign-up" style={styles.link}>
                Create account
              </Link>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    justifyContent: "center",
  },
  container: { flex: 1, justifyContent: "center" },
  content: { flex: 1, justifyContent: "center" },
  brand: {
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },
  orb: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.violet,
  },
  title: {
    color: colors.primaryText,
    fontSize: 42,
    fontWeight: "900",
    letterSpacing: 0,
  },
  subtitle: {
    color: colors.secondaryText,
    fontSize: 16,
  },
  form: {
    gap: 14,
  },
  inputWrap: {
    height: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    color: colors.primaryText,
    fontSize: 16,
  },
  linkText: {
    textAlign: "center",
    color: colors.secondaryText,
    marginTop: 8,
  },
  link: {
    color: colors.cyan,
    fontWeight: "800",
  },
});
