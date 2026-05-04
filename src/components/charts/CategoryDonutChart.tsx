import Svg, { Circle, G, Text as SvgText } from "react-native-svg";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

export type DonutItem = {
  name: string;
  value: number;
  color: string;
  percentage: number;
};

export function CategoryDonutChart({ data }: { data: DonutItem[] }) {
  const size = 160;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let currentOffset = 0;

  return (
    <View style={styles.container}>
      <View style={styles.chartWrap}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Background track */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.cardSoft}
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Slices */}
            {data.map((item, index) => {
              const strokeDashoffset = circumference - (item.percentage / 100) * circumference;
              const rotation = (currentOffset / 100) * 360;
              currentOffset += item.percentage;
              
              return (
                <Circle
                  key={index}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={item.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  transform={`rotate(${rotation}, ${size / 2}, ${size / 2})`}
                />
              );
            })}
          </G>
          {/* Center text */}
          <View style={styles.centerTextWrap}>
            <Text style={styles.centerTitle}>{data.length}</Text>
            <Text style={styles.centerSub}>CATS</Text>
          </View>
        </Svg>
      </View>

      <View style={styles.legend}>
        {data.slice(0, 5).map((item, index) => (
          <View key={index} style={styles.legendRow}>
            <View style={styles.legendLeft}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <Text style={styles.legendName}>{item.name}</Text>
            </View>
            <Text style={styles.legendValue}>{Math.round(item.percentage)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    gap: 20,
  },
  chartWrap: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  centerTextWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  centerTitle: {
    color: colors.primaryText,
    fontSize: 24,
    fontWeight: "900",
  },
  centerSub: {
    color: colors.secondaryText,
    fontSize: 10,
    fontWeight: "800",
    marginTop: -2,
  },
  legend: {
    flex: 1,
    gap: 12,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  legendLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendName: {
    color: colors.secondaryText,
    fontSize: 14,
    fontWeight: "700",
  },
  legendValue: {
    color: colors.primaryText,
    fontSize: 14,
    fontWeight: "800",
  },
});
