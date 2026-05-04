import { Brain, Sparkles, TrendingUp, Zap } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Modal, StyleSheet, Text, View } from "react-native";

import { colors } from "../../theme/colors";

const STEPS = [
  { icon: Brain, text: "Analyzing spending patterns", duration: 1200 },
  { icon: TrendingUp, text: "Detecting trends", duration: 1000 },
  { icon: Zap, text: "Generating insights", duration: 1000 },
  { icon: Sparkles, text: "Optimizing recommendations", duration: 800 },
];

export function AIAnalysisAnimation({ visible, onComplete }: { visible: boolean; onComplete: () => void }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const stepTextAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [currentStep, setCurrentStep] = useState(0);

  // Particle animations
  const particle1Anim = useRef(new Animated.Value(0)).current;
  const particle2Anim = useRef(new Animated.Value(0)).current;
  const particle3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setCurrentStep(0);
      
      // Initial entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous rotation for the outer ring
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();

      // Pulse animation for the center icon
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Floating particle animations
      Animated.loop(
        Animated.sequence([
          Animated.timing(particle1Anim, {
            toValue: 1,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particle1Anim, {
            toValue: 0,
            duration: 2000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(particle2Anim, {
            toValue: 1,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particle2Anim, {
            toValue: 0,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(particle3Anim, {
            toValue: 1,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particle3Anim, {
            toValue: 0,
            duration: 1800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Progress bar animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 4000,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
        useNativeDriver: false,
      }).start();

      // Step through each analysis phase
      const totalDuration = STEPS.reduce((sum, step) => sum + step.duration, 0);
      let elapsed = 0;

      STEPS.forEach((step, index) => {
        setTimeout(() => {
          setCurrentStep(index);
          // Fade out and in for text change
          Animated.sequence([
            Animated.timing(stepTextAnim, {
              toValue: 0,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(stepTextAnim, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }, elapsed);
        elapsed += step.duration;
      });

      // Complete animation
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.8,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          onComplete();
        });
      }, totalDuration + 200);
    }
  }, [visible]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const particle1Y = particle1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const particle2Y = particle2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 20],
  });

  const particle3Y = particle3Anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Animated rings */}
          <View style={styles.iconContainer}>
            <Animated.View
              style={[
                styles.outerRing,
                {
                  transform: [{ rotate }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.middleRing,
                {
                  transform: [{ rotate: rotate }],
                },
              ]}
            />
            <Animated.View
              style={[
                styles.innerCircle,
                {
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <Brain size={32} color={colors.violet} strokeWidth={2.5} />
            </Animated.View>
          </View>

          {/* Animated text */}
          <Animated.View style={{ opacity: stepTextAnim }}>
            <Text style={styles.title}>AI Analysis</Text>
            <Text style={styles.subtitle}>{STEPS[currentStep]?.text}</Text>
          </Animated.View>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>

          {/* Floating particles */}
          <View style={styles.particles}>
            <Animated.View
              style={[
                styles.particleWrapper,
                {
                  transform: [{ translateY: particle1Y }],
                  opacity: particle1Anim,
                },
              ]}
            >
              <Sparkles size={16} color={colors.cyan} />
            </Animated.View>
            <Animated.View
              style={[
                styles.particleWrapper2,
                {
                  transform: [{ translateY: particle2Y }],
                  opacity: particle2Anim,
                },
              ]}
            >
              <Sparkles size={12} color={colors.violet} />
            </Animated.View>
            <Animated.View
              style={[
                styles.particleWrapper3,
                {
                  transform: [{ translateY: particle3Y }],
                  opacity: particle3Anim,
                },
              ]}
            >
              <Sparkles size={14} color={colors.indigo} />
            </Animated.View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    alignItems: "center",
    gap: 24,
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  outerRing: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: colors.violet,
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
  },
  middleRing: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: colors.cyan,
    borderBottomColor: "transparent",
    borderRightColor: "transparent",
  },
  innerCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${colors.violet}1F`,
    borderWidth: 2,
    borderColor: `${colors.violet}55`,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: colors.primaryText,
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    color: colors.secondaryText,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 8,
  },
  progressContainer: {
    width: 240,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.violet,
    borderRadius: 2,
  },
  particles: {
    position: "absolute",
    width: 300,
    height: 300,
  },
  particleWrapper: {
    position: "absolute",
    top: 20,
    right: 40,
  },
  particleWrapper2: {
    position: "absolute",
    bottom: 40,
    left: 30,
  },
  particleWrapper3: {
    position: "absolute",
    top: 60,
    left: 50,
  },
});
