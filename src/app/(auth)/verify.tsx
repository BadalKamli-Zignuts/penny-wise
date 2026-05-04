import { router } from "expo-router";
import { MailCheck } from "lucide-react-native";
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import { GradientButton } from "../../components/ui/GradientButton";
import { Screen } from "../../components/ui/Screen";
import { useAuthStore } from "../../features/auth/store";
import { checkEmailVerification, resendVerificationEmail } from "../../lib/firebase/auth";
import { colors } from "../../theme/colors";

export default function VerifyScreen() {
  const user = useAuthStore((s) => s.user);
  const [checking, setChecking] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleContinue() {
    if (!user) return;

    setChecking(true);
    try {
      const isVerified = await checkEmailVerification();

      if (isVerified) {
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Email not verified",
          "Please check your email and click the verification link before continuing."
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to check verification status. Please try again.");
    } finally {
      setChecking(false);
    }
  }

  async function handleResend() {
    if (!user) return;

    setResending(true);
    try {
      await resendVerificationEmail();
      Alert.alert(
        "Email sent",
        "We've sent another verification email. Please check your inbox."
      );
    } catch (error) {
      Alert.alert("Error", "Failed to resend email. Please try again later.");
    } finally {
      setResending(false);
    }
  }

  return (
    <Screen scroll={false} style={styles.screen}>
      <View style={styles.icon}>
        <MailCheck size={32} color={colors.primaryText} />
      </View>
      <Text style={styles.title}>Verify your email</Text>
      <Text style={styles.subtitle}>
        We've sent a verification email to {user?.email}. Click the link in the email to verify your account.
      </Text>
      <GradientButton
        label={checking ? "Checking..." : "I've verified my email"}
        onPress={handleContinue}
        disabled={checking || resending}
      />
      <GradientButton
        label={resending ? "Sending..." : "Resend verification email"}
        onPress={handleResend}
        disabled={checking || resending}
        style={styles.resendBtn}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { justifyContent: "center", gap: 16 },
  icon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.indigo,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  title: {
    color: colors.primaryText,
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: 0,
  },
  subtitle: {
    color: colors.secondaryText,
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 8,
  },
  resendBtn: {
    marginTop: 8,
  },
});
