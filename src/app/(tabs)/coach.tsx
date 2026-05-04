import { Send } from "lucide-react-native";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { ChatBubble } from "../../components/ui/ChatBubble";
import { Screen } from "../../components/ui/Screen";
import { useBudgetsWithSpending } from "../../features/budgets/hooks/useBudgetsWithSpending";
import { useCoachStore } from "../../features/coach/store";
import { useExpenseStore } from "../../features/expenses/hooks";
import { useSettingsStore } from "../../features/settings/store";
import { colors } from "../../theme/colors";

export default function CoachScreen() {
  const [value, setValue] = useState("");
  const messages = useCoachStore((state) => state.messages);
  const sendMessage = useCoachStore((state) => state.sendMessage);
  const pending = useCoachStore((state) => state.pending);
  const expenses = useExpenseStore((state) => state.expenses);
  const budgets = useBudgetsWithSpending();
  const currency = useSettingsStore((state) => state.currency);
  const tone = useSettingsStore((state) => state.tone);

  async function send() {
    if (!value.trim()) return;
    const content = value.trim();
    setValue("");
    await sendMessage({ content, expenses, budgets, currency, tone });
  }

  return (
    <Screen scroll={false} style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={100}
      >
        <View style={styles.header}>
          <View style={styles.pulse} />
          <View>
            <Text style={styles.title}>Penny Coach</Text>
            <Text style={styles.subtitle}>Financial coach mode · {tone}</Text>
          </View>
        </View>
        <ScrollView contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>
          {messages.map((message) => <ChatBubble key={message.id} role={message.role} content={message.content} />)}
          {pending && <Text style={styles.pending}>Thinking with your spending context...</Text>}
        </ScrollView>
        <View style={styles.inputBar}>
          <TextInput value={value} onChangeText={setValue} placeholder="Ask anything..." placeholderTextColor={colors.secondaryText} style={styles.input} />
          <Pressable style={styles.send} onPress={send}>
            <Send size={18} color={colors.primaryText} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: 10, paddingBottom: 64 },
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  pulse: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.violet },
  title: { color: colors.primaryText, fontSize: 18, fontWeight: "900" },
  subtitle: { color: colors.secondaryText, fontSize: 12 },
  messages: { gap: 14 },
  pending: { color: colors.secondaryText, fontSize: 13 },
  inputBar: { minHeight: 56, borderRadius: 28, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, flexDirection: "row", alignItems: "center", paddingLeft: 18, paddingRight: 8, gap: 8 },
  input: { flex: 1, color: colors.primaryText, fontSize: 15 },
  send: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.violet, alignItems: "center", justifyContent: "center" },
});
