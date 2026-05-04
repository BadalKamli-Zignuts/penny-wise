import { StyleSheet, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Stop, Text as SvgText } from "react-native-svg";

import { colors } from "../../theme/colors";

export function SpendingLineChart({
  values,
  labels,
  dates
}: {
  values: number[];
  labels?: string[];
  dates?: string[];
}) {
  const max = Math.max(...values, 1);
  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * 320;
    const y = 110 - (value / max) * 90;
    return { x, y };
  });
  const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");
  const area = `${path} L320,120 L0,120 Z`;
  const last = points[points.length - 1] ?? { x: 0, y: 110 };

  // Use provided labels or generate default ones
  const displayLabels = labels || values.map((_, i) => `${i + 1}`);

  return (
    <View style={styles.container}>
      <Svg width="100%" height={160} viewBox="0 0 320 160">
        <Defs>
          <LinearGradient id="line" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={colors.violet} />
            <Stop offset="1" stopColor={colors.cyan} />
          </LinearGradient>
          <LinearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.violet} stopOpacity="0.24" />
            <Stop offset="1" stopColor={colors.cyan} stopOpacity="0" />
          </LinearGradient>
        </Defs>
        <Path d={area} fill="url(#area)" />
        <Path d={path} fill="none" stroke="url(#line)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx={last.x} cy={last.y} r={5} fill={colors.bg} stroke={colors.cyan} strokeWidth={2} />

        {points.map((point, i) => (
          <SvgText
            key={`label-${i}`}
            x={point.x}
            y={145}
            fill={colors.secondaryText}
            fontSize="10"
            fontWeight="600"
            textAnchor="middle"
          >
            {displayLabels[i]}
          </SvgText>
        ))}

        {dates && points.map((point, i) => (
          <SvgText
            key={`date-${i}`}
            x={point.x}
            y={157}
            fill={colors.secondaryText}
            fontSize="9"
            fontWeight="500"
            textAnchor="middle"
            opacity="0.7"
          >
            {dates[i]}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginBottom: 10,
  },
});

