import type { ComponentType } from "react";
import { Pressable, StyleSheet, type PressableProps, type ViewStyle } from "react-native";
import type { LucideProps } from "lucide-react-native";

import { colors } from "../../theme/colors";

type IconButtonProps = Omit<PressableProps, "style"> & {
  icon: ComponentType<LucideProps>;
  active?: boolean;
  style?: ViewStyle;
};

export function IconButton({ icon: Icon, active = false, style, ...props }: IconButtonProps) {
  return (
    <Pressable {...props} style={({ pressed }) => [styles.button, active && styles.active, pressed && styles.pressed, style]}>
      <Icon size={22} color={active ? colors.primaryText : colors.secondaryText} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: colors.border,
  },
  active: {
    backgroundColor: "rgba(139,92,246,0.18)",
    borderColor: "rgba(139,92,246,0.45)",
  },
  pressed: {
    opacity: 0.75,
  },
});
