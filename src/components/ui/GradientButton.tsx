import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text, type PressableProps, type ViewStyle } from "react-native";

import { colors } from "../../theme/colors";

type GradientButtonProps = PropsWithChildren<
  PressableProps & {
    label?: string;
    style?: ViewStyle;
    disabled?: boolean;
  }
>;

export function GradientButton({ children, label, style, disabled, ...props }: GradientButtonProps) {
  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={({ pressed }) => [
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style
      ]}
    >
      <LinearGradient
        colors={disabled ? [colors.border, colors.border, colors.border] : [colors.violet, colors.indigo, colors.cyan]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        {children ?? <Text style={[styles.label, disabled && styles.labelDisabled]}>{label}</Text>}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 22,
  },
  label: {
    color: colors.primaryText,
    fontSize: 17,
    fontWeight: "700",
  },
  labelDisabled: {
    color: colors.secondaryText,
  },
  pressed: {
    opacity: 0.78,
  },
  disabled: {
    opacity: 0.5,
  },
});
