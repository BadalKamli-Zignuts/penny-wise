import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { GradientBackgroundView } from "@/components/ui/GradientBackgroundView";
import { GradientText } from "@/components/ui/GradientText";
import { GradientButton } from "../../components/ui/GradientButton";
import { useSettingsStore } from "../../features/settings/store";
import { colors } from "../../theme/colors";

const { width: SCREEN_W } = Dimensions.get("window");

// ─── Slide 1 illustration ─────────────────────────────────────────────────────
function TransactionCard() {
  return (
    <View style={il.cardWrapper}>
      <View style={il.cardTiltedBg} />
      <View style={il.txCardOuter}>
        <GradientBackgroundView style={{
          position: 'absolute',
          top: -20,
          right: 0,
          borderRadius: 100,
          padding: 1,
        }}>
          <View style={il.badge}>
            <Text style={il.badgeStarText}>✦</Text>
            <Text style={il.badgeText}>auto-categorized</Text>
          </View>
        </GradientBackgroundView>
        <View style={il.txCard}>
          <View style={il.txIconWrap}>
            <Text style={il.txIcon}>☕</Text>
          </View>
          <View style={il.txBody}>
            <View style={il.txRow}>
              <Text style={il.txName}>Blue …</Text>
              <Text style={il.txAmount}>$5.40</Text>
            </View>
            <Text style={il.txDate}>Today · 8:14 AM</Text>
            <View style={il.txTag}>
              <Text style={il.txTagText}>Coffee · Food &amp; Drink</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

// ─── Slide 2 illustration ─────────────────────────────────────────────────────
function InsightCard() {
  return (
    <View style={il.insightWrapper}>
      <View style={il.insightCard}>
        <View style={il.insightHeader}>
          <GradientBackgroundView>
            <View style={il.insightIconLeft}>
              <Text style={il.insightIconText}>✦</Text>
            </View>
          </GradientBackgroundView>
          <GradientBackgroundView>
             <View style={il.insightIconRight}>
              <Text style={il.insightHeartText}>♥</Text>
            </View>
          </GradientBackgroundView>
        </View>
        <Text style={il.insightTitle}>Dining spike detected</Text>
        <Text style={il.insightBody}>
          You spent 32% more on dining this week — mostly Friday nights.
        </Text>
        <Text style={il.insightLink}>See breakdown →</Text>
      </View>
    </View>
  );
}

// ─── Slide 3 illustration ─────────────────────────────────────────────────────
function GlowOrb() {
  return (
    <View style={il.orbWrapper}>
      <View style={il.orbAmbient} />
      <View style={il.orbCircle}>
        <LinearGradient
          colors={["#C4B5FD", "#67E8F9", "#818CF8"]}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
          style={il.orbInner}
        />
      </View>
    </View>
  );
}

function SlideHeading({
  titlePlain,
  titleAccent,
  titlePlain2,
}: {
  titlePlain: string;
  titleAccent: string;
  titlePlain2?: string;
}) {
  return (
    <Text style={headingBase}>
      <Text style={headingPlain}>{titlePlain}</Text>
      <GradientText label={titleAccent} textStyle={HEADING_SHARED} />
      {titlePlain2 ? <Text style={headingPlain}>{titlePlain2}</Text> : null}
    </Text>
  );
}

function Dots({
  active,
  total,
  onPress,
}: {
  active: number;
  total: number;
  onPress: (i: number) => void;
}) {
  return (
    <View style={styles.dots}>
      {Array.from({ length: total }).map((_, i) => (
        <Pressable
          key={i}
          onPress={() => onPress(i)}
          hitSlop={{ top: 14, bottom: 14, left: 10, right: 10 }}
          style={[
            styles.dot,
            i === active ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

// ─── Slide data ───────────────────────────────────────────────────────────────
const SLIDES: Array<{
  key: string;
  illustration: React.ReactElement;
  titlePlain: string;
  titleAccent: string;
  titlePlain2?: string;
  subtitle: string;
  isLast: boolean;
}> = [
  {
    key: "capture",
    illustration: <TransactionCard />,
    titlePlain: "Capture spending\nin a ",
    titleAccent: "tap.",
    subtitle:
      "Snap a receipt, speak it, or let Lumen detect it. Every transaction sorts itself.",
    isLast: false,
  },
  {
    key: "coach",
    illustration: <InsightCard />,
    titlePlain: "An AI ",
    titleAccent: "coach",
    titlePlain2: " in\nyour pocket.",
    subtitle:
      "Lumen learns your habits and tells you what's worth knowing — clearly, kindly, daily.",
    isLast: false,
  },
  {
    key: "smarter",
    illustration: <GlowOrb />,
    titlePlain: "Spend smarter,\n",
    titleAccent: "automatically.",
    subtitle:
      "Lumen is your AI financial coach. We analyze your habits to uncover insights you didn't know about yourself.",
    isLast: true,
  },
];

// ─── Main component ───────────────────────────────────────────────────────────
export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);

  // FIX 3: Two separate animated values.
  // slideProgress → drives the illustration strip (continuous 0→1→2).
  // textOpacity + textSlide → drives the bottom text so it cross-fades in
  // sync with the illustration instead of snapping after animation ends.
  const slideProgress = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(1)).current;
  const textSlide = useRef(new Animated.Value(0)).current;

  const complete = useSettingsStore((s) => s.completeOnboarding);

  function animateTo(next: number) {
    const direction = next > activeIndex ? 1 : -1;

    // Step 1 — fade out current bottom text quickly
    Animated.parallel([
      Animated.timing(textOpacity, {
        toValue: 0,
        duration: 110,
        useNativeDriver: true,
      }),
      Animated.timing(textSlide, {
        toValue: -direction * 24,
        duration: 110,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Step 2 — swap text content instantly while invisible, prep entry position
      setActiveIndex(next);
      textSlide.setValue(direction * 24);

      // Step 3 — slide illustration + fade in new text simultaneously
      Animated.parallel([
        Animated.timing(slideProgress, {
          toValue: next,
          duration: 370,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 260,
          delay: 50,
          useNativeDriver: true,
        }),
        Animated.timing(textSlide, {
          toValue: 0,
          duration: 260,
          delay: 50,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    });
  }

  function handleContinue() {
    if (activeIndex < SLIDES.length - 1) animateTo(activeIndex + 1);
  }
  function handleGetStarted() {
    complete();
    router.replace("/(auth)/sign-up");
  }
  function handleSignIn() {
    complete();
    router.replace("/(auth)/sign-in");
  }
  function handleSkip() {
    complete();
    router.replace("/(auth)/sign-up");
  }

  const slide = SLIDES[activeIndex];

  const illustrationTranslateX = slideProgress.interpolate({
    inputRange: SLIDES.map((_, i) => i),
    outputRange: SLIDES.map((_, i) => -i * SCREEN_W),
  });

  return (
    <SafeAreaView style={styles.safe}>
      {/* Skip */}
      <Pressable style={styles.skip} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </Pressable>

      {/* Illustration strip */}
      <Animated.View
        style={[
          styles.slidesRow,
          { transform: [{ translateX: illustrationTranslateX }] },
        ]}
      >
        
        {SLIDES.map((s) => (
          <View key={s.key} style={styles.slide}>
            <LinearGradient colors={[colors.violet, colors.card]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={il.gradientBg}/>
            <BlurView intensity={80} tint="dark" style={il.blurOverlay} />
            <View style={styles.ilContainer}>{s.illustration}</View>
          </View>
        ))}
      </Animated.View>

      {/* Bottom panel — animates in sync with illustration */}
      <Animated.View
        style={[
          styles.bottom,
          { opacity: textOpacity, transform: [{ translateX: textSlide }] },
        ]}
      >
        <LinearGradient colors={[colors.violet, colors.card]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />
        <SlideHeading
          titlePlain={slide.titlePlain}
          titleAccent={slide.titleAccent}
          titlePlain2={slide.titlePlain2}
        />

        <Text style={styles.subtitle}>{slide.subtitle}</Text>

        <Dots
          active={activeIndex}
          total={SLIDES.length}
          onPress={(i) => { if (i !== activeIndex) animateTo(i); }}
        />

        {slide.isLast ? (
          <>
            <GradientButton label="Get Started" onPress={handleGetStarted} />
            <Pressable style={styles.secondaryBtn} onPress={handleSignIn}>
              <Text style={styles.secondaryText}>I already have an account</Text>
            </Pressable>
          </>
        ) : (
          <GradientButton label="Continue" onPress={handleContinue} />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

// ─── Heading style atoms (defined outside StyleSheet so they can be used
//     directly in the SlideHeading component without going through styles.*) ───
const HEADING_SHARED = {
  fontSize: 36,
  fontWeight: "900" as const,
  lineHeight: 44,
  letterSpacing: -0.5,
  paddingTop: 4
};
const headingBase = { ...HEADING_SHARED, color: colors.primaryText };
const headingPlain = { ...HEADING_SHARED, color: colors.primaryText };

// ─── Component styles ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  skip: {
    position: "absolute",
    top: 56,
    right: 24,
    zIndex: 10,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  skipText: { color: colors.secondaryText, fontSize: 16, fontWeight: "500", paddingTop: 10 },
  slidesRow: {
    flexDirection: "row",
    width: SCREEN_W * SLIDES.length,
    flex: 1,
  },
  slide: {
    width: SCREEN_W,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  ilContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  bottom: {
    paddingHorizontal: 24,
    paddingBottom: 36,
    gap: 14,
  },
  subtitle: {
    color: colors.secondaryText,
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 4,
  },
  dots: { flexDirection: "row", gap: 6, marginBottom: 4 },
  dot: { height: 6, borderRadius: 3 },
  dotActive: { width: 28, backgroundColor: colors.violet },
  dotInactive: { width: 6, backgroundColor: "rgba(255,255,255,0.2)" },
  secondaryBtn: {
    minHeight: 56,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  secondaryText: { color: colors.primaryText, fontSize: 17, fontWeight: "600" },
});

// ─── Illustration styles ──────────────────────────────────────────────────────
const il = StyleSheet.create({
  // Slide 1
  cardWrapper: {
    alignItems: "center",
    width: "100%",
    height: 220,
    justifyContent: "center",
  },
  cardTiltedBg: {
    position: "absolute",
    width: "92%",
    height: 200,
    backgroundColor: "#16192A",
    opacity: 0.6,
    borderRadius: 22,
    borderColor: "rgba(255,255,255,0.06)",
  },
  txCardOuter: {
    width: "100%",
    backgroundColor: "#16192A",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    padding: 16,
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-end",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.35)",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  badgeStarText: { color: colors.cyan, fontSize: 12 },
  badgeText: {
    color: colors.primaryText,
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.2,
  },
  txCard: { flexDirection: "row", alignItems: "center", gap: 14 },
  txIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(6,182,212,0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(6,182,212,0.2)",
  },
  txIcon: { fontSize: 22 },
  txBody: { flex: 1, gap: 4 },
  txRow: { flexDirection: "row", justifyContent: "space-between" },
  txName: { color: colors.primaryText, fontSize: 16, fontWeight: "700" },
  txAmount: { color: colors.primaryText, fontSize: 16, fontWeight: "700" },
  txDate: { color: colors.secondaryText, fontSize: 13 },
  txTag: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  txTagText: { color: colors.secondaryText, fontSize: 12 },

  // Slide 2
  insightWrapper: { width: "100%" },
  insightCard: {
    backgroundColor: "#16192A",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
    borderRadius: 22,
    padding: 20,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  insightHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  insightIconLeft: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  insightIconRight: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  insightIconText: { color: colors.primaryText, fontSize: 24 },
  insightHeartText: { color: colors.primaryText, fontSize: 24 },
  insightTitle: {
    color: colors.primaryText,
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  insightBody: { color: colors.secondaryText, fontSize: 14, lineHeight: 22 },
  insightLink: { color: colors.violet, fontSize: 14, fontWeight: "600", marginTop: 2 },

  // Slide 3
  orbWrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: 240,
    height: 240,
  },
  orbAmbient: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "transparent",
    shadowColor: colors.violet,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 60,
    elevation: 0,
  },
  orbCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#12111E",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.violet,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 50,
    elevation: 20,
  },
  orbInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 24,
  },
  gradientBg: {
    position: "absolute",
    width: "100%",
    height: "80%",
    borderRadius: '80%',
    opacity: 0.1
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 100,
  }
});