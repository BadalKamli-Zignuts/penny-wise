import type { PropsWithChildren } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

import { colors } from "../../theme/colors";

export function GlassCard({ children, style }: PropsWithChildren<{ style?: ViewStyle }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 24,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 8,
  },
});
