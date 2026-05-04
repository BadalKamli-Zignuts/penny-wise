import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../theme/colors";

export function ChatBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";

  return (
    <View style={[styles.bubble, isUser ? styles.user : styles.assistant]}>
      <Text style={styles.text}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "88%",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderWidth: 1,
  },
  user: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderColor: "rgba(255,255,255,0.12)",
    borderTopRightRadius: 6,
  },
  assistant: {
    alignSelf: "flex-start",
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderTopLeftRadius: 6,
  },
  text: {
    color: colors.primaryText,
    fontSize: 15,
    lineHeight: 21,
  },
});
