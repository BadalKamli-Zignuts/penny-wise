import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";

import { colors } from "../../theme/colors";

type GradientTextProps = {
  label?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export function GradientText({ label, style, textStyle }: GradientTextProps) {
  return (
    <View style={style}>
      <MaskedView
        maskElement={
          <Text style={[styles.label, textStyle]}>
            {label}
          </Text>
        }
      >
        <LinearGradient
          colors={[colors.violet, colors.indigo, colors.cyan]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 0.8, y: 0.5 }} 
        >
          {/* Invisible text to size the gradient */}
          <Text style={[styles.label, textStyle, { opacity: 0 }]}>
            {label}
          </Text>
        </LinearGradient>
      </MaskedView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 24,
    fontWeight: "700",
  },
});