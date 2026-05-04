import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import { StyleSheet, type PressableProps, type ViewStyle } from "react-native";

import { colors } from "../../theme/colors";

type GradientBackgroundViewProps = PropsWithChildren<
  PressableProps & {
    label?: string;
    style?: ViewStyle;
  }
>;

export function GradientBackgroundView({ children, label, style, ...props }: GradientBackgroundViewProps) {
  return (
      <LinearGradient colors={[colors.violet, colors.indigo, colors.cyan]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.view, style]}>
        {children}
      </LinearGradient>
  );
}

const styles = StyleSheet.create({
  view: {
    padding: 2,
    borderRadius: 100,
  },  
});
