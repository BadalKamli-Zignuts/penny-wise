import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from "date-fns";
import { router } from "expo-router";
import { AlertTriangle, ChevronLeft, ChevronRight, Plus, Sparkles } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getCategory } from "@/constants/categories";
import { GlassCard } from "../../components/ui/GlassCard";
import { useExpenseStore } from "../../features/expenses/hooks";
import { useSettingsStore } from "../../features/settings/store";
import { colors } from "../../theme/colors";

type DayData = {
  date: Date;
  total: number;
  expenses: any[];
  categories: string[];
  isOverBudget: boolean;
  hasAnomaly: boolean;
};

function DayBottomSheet({ 
  visible,
  onClose,
  dayData, 
  currency 
}: { 
  visible: boolean;
  onClose: () => void;
  dayData: DayData | null;
  currency: string;
}) {
  const [aiInsight, setAiInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Generate AI insight for the day
  useEffect(() => {
    if (!visible || !dayData || dayData.expenses.length === 0) {
      setAiInsight("");
      return;
    }

    const currentDayData = dayData; // Capture for closure

    async function generateDailyInsight() {
      setLoadingInsight(true);
      try {
        const response = await fetch("/api/ai/insights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currency,
            dailyData: {
              date: format(currentDayData.date, "EEEE, MMMM d"),
              total: currentDayData.total,
              transactionCount: currentDayData.expenses.length,
              categories: currentDayData.expenses.reduce((acc, exp) => {
                const cat = getCategory(exp.categoryId);
                if (!acc[exp.categoryId]) {
                  acc[exp.categoryId] = { name: cat.name, total: 0, count: 0 };
                }
                acc[exp.categoryId].total += exp.amount;
                acc[exp.categoryId].count += 1;
                return acc;
              }, {} as Record<string, { name: string; total: number; count: number }>),
              topExpenses: currentDayData.expenses.slice(0, 3).map(e => ({
                merchant: e.merchant,
                amount: e.amount,
                category: getCategory(e.categoryId).name,
              })),
            },
            requestType: "daily_insight",
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawInsight = data.raw;
          
          // Extract insight text from AI response
          try {
            const match = rawInsight.match(/"insight":\s*"([^"]+)"/);
            if (match) {
              setAiInsight(match[1]);
            } else {
              // Fallback: use the whole response if it's plain text
              setAiInsight(rawInsight.replace(/[{}"]/g, "").trim());
            }
          } catch (e) {
            setAiInsight("");
          }
        }
      } catch (error) {
        console.error("Failed to generate daily insight:", error);
        setAiInsight("");
      } finally {
        setLoadingInsight(false);
      }
    }

    generateDailyInsight();
  }, [visible, dayData, currency]);

  if (!dayData) return null;

  const categoryBreakdown = dayData.expenses.reduce((acc, exp) => {
    const cat = getCategory(exp.categoryId);
    if (!acc[exp.categoryId]) {
      acc[exp.categoryId] = { name: cat.name, color: cat.color, total: 0, count: 0 };
    }
    acc[exp.categoryId].total += exp.amount;
    acc[exp.categoryId].count += 1;
    return acc;
  }, {} as Record<string, { name: string; color: string; total: number; count: number }>);

  const sortedCategories = (Object.entries(categoryBreakdown) as [string, { name: string; color: string; total: number; count: number }][]).sort((a, b) => b[1].total - a[1].total);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={sh.overlay} onPress={onClose}>
        <View style={sh.sheet} onStartShouldSetResponder={() => true}>
          <View style={sh.handle} />
          
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sh.content}>
            {/* Date Header */}
            <View style={sh.dateHeader}>
              <Text style={sh.dateTitle}>{format(dayData.date, "EEEE, MMM d")}</Text>
              <Text style={sh.dateTotal}>{currency}{dayData.total.toLocaleString("en-IN")}</Text>
            </View>

            {/* AI Insight */}
            {(aiInsight || loadingInsight) && (
              <GlassCard style={sh.aiCard}>
                <View style={sh.aiHeader}>
                  <Sparkles size={16} color={colors.violet} />
                  <Text style={sh.aiTitle}>AI Insight</Text>
                </View>
                {loadingInsight ? (
                  <Text style={sh.aiBody}>Analyzing your spending for this day...</Text>
                ) : (
                  <Text style={sh.aiBody}>{aiInsight}</Text>
                )}
              </GlassCard>
            )}

            {/* Category Breakdown */}
            {sortedCategories.length > 0 && (
              <View style={sh.section}>
                <Text style={sh.sectionTitle}>Categories</Text>
                {sortedCategories.map(([catId, data]) => (
                  <View key={catId} style={sh.categoryRow}>
                    <View style={[sh.categoryDot, { backgroundColor: data.color }]} />
                    <Text style={sh.categoryName}>{data.name}</Text>
                    <Text style={sh.categoryCount}>{data.count} {data.count === 1 ? 'transaction' : 'transactions'}</Text>
                    <Text style={sh.categoryAmount}>{currency}{data.total.toLocaleString("en-IN")}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Transactions */}
            <View style={sh.section}>
              <Text style={sh.sectionTitle}>Transactions</Text>
              {dayData.expenses.map((exp) => {
                const cat = getCategory(exp.categoryId);
                const Icon = cat.icon;
                const isIncome = exp.categoryId === "income";
                return (
                  <Pressable 
                    key={exp.id} 
                    style={sh.transactionCard} 
                    onPress={() => { 
                      onClose();
                      setTimeout(() => router.push(`/expense/${exp.id}`), 300);
                    }}
                  >
                    <View style={[sh.transactionIcon, { backgroundColor: `${cat.color}1F`, borderColor: `${cat.color}55` }]}>
                      <Icon size={18} color={cat.color} />
                    </View>
                    <View style={sh.transactionMeta}>
                      <Text style={sh.transactionMerchant}>{exp.merchant}</Text>
                      <Text style={sh.transactionTime}>{format(new Date(exp.spentAt), "h:mm a")}</Text>
                    </View>
                    <Text style={[sh.transactionAmount, isIncome && { color: colors.mint }]}>
                      {isIncome ? "+" : "-"}{currency}{exp.amount.toLocaleString("en-IN")}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Quick Actions */}
            <View style={sh.actions}>
              <Pressable 
                style={sh.actionBtn} 
                onPress={() => { 
                  onClose();
                  setTimeout(() => router.push({
                    pathname: "/expense/new",
                    params: { date: dayData.date.toISOString() }
                  }), 300);
                }}
              >
                <Plus size={20} color={colors.primaryText} />
                <Text style={sh.actionText}>Add Expense</Text>
              </Pressable>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

export default function TimelineScreen() {
  const expenses = useExpenseStore((s) => s.expenses);
  const currency = useSettingsStore((s) => s.currency);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [showDaySheet, setShowDaySheet] = useState(false);

  // Calculate month data (excluding income)
  const monthStart = startOfMonth(selectedMonth);
  const monthEnd = endOfMonth(selectedMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Calculate monthly total (excluding income)
  const monthlyExpenses = expenses.filter((e) => {
    const date = new Date(e.spentAt);
    return date >= monthStart && date <= monthEnd && e.categoryId !== "income";
  });
  const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group expenses by day (excluding income)
  const expensesByDay = expenses
    .filter(e => e.categoryId !== "income")
    .reduce((acc, exp) => {
      const dateKey = format(new Date(exp.spentAt), "yyyy-MM-dd");
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(exp);
      return acc;
    }, {} as Record<string, any[]>);

  // Calculate day data
  const getDayData = (date: Date): DayData => {
    const dateKey = format(date, "yyyy-MM-dd");
    const dayExpenses = expensesByDay[dateKey] || [];
    const total = dayExpenses.reduce((sum, e) => sum + e.amount, 0);
    const categories = [...new Set(dayExpenses.map((e) => e.categoryId))].filter((id): id is string => typeof id === 'string');
    
    // Simple anomaly detection: spending > 2x average
    const avgDailySpend = monthlyTotal / 30;
    const hasAnomaly = total > avgDailySpend * 2 && total > 0;

    return {
      date,
      total,
      expenses: dayExpenses,
      categories,
      isOverBudget: false, // TODO: implement budget check
      hasAnomaly,
    };
  };

  function handleDayPress(date: Date) {
    if (!isSameMonth(date, selectedMonth)) return;
    
    // Prevent adding expenses for future dates
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    if (date > today) return;
    
    const dayData = getDayData(date);
    if (dayData.expenses.length === 0) {
      // If no expenses, open add expense with this date
      router.push({
        pathname: "/expense/new",
        params: { date: date.toISOString() }
      });
      return;
    }
    setSelectedDay(dayData);
    setShowDaySheet(true);
  }

  // Get intensity for heatmap effect
  const getIntensity = (total: number) => {
    if (total === 0) return 0;
    const max = Math.max(...Object.values(expensesByDay).map((exps) => exps.reduce((sum, e) => sum + e.amount, 0)));
    return Math.min((total / max) * 100, 100);
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <View style={s.headerTop}>
          <Text style={s.title}>Timeline</Text>
        </View>
        
        {/* Month Selector */}
        <View style={s.monthSelector}>
          <Pressable style={s.monthBtn} onPress={() => setSelectedMonth(subMonths(selectedMonth, 1))}>
            <ChevronLeft size={20} color={colors.primaryText} />
          </Pressable>
          <View style={s.monthInfo}>
            <Text style={s.monthText}>{format(selectedMonth, "MMMM yyyy")}</Text>
            <Text style={s.monthSpent}>{currency}{monthlyTotal.toLocaleString("en-IN")} spent</Text>
          </View>
          <Pressable style={s.monthBtn} onPress={() => setSelectedMonth(addMonths(selectedMonth, 1))}>
            <ChevronRight size={20} color={colors.primaryText} />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {/* Calendar */}
        <GlassCard style={s.calendar}>
          {/* Weekday Headers */}
          <View style={s.weekdays}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Text key={day} style={s.weekday}>{day}</Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={s.grid}>
            {calendarDays.map((date) => {
              const dayData = getDayData(date);
              const isCurrentMonth = isSameMonth(date, selectedMonth);
              const isToday = isSameDay(date, new Date());
              const intensity = getIntensity(dayData.total);
              const hasExpenses = dayData.expenses.length > 0;
              
              // Check if date is in the future
              const today = new Date();
              today.setHours(23, 59, 59, 999);
              const isFuture = date > today;

              return (
                <Pressable
                  key={date.toISOString()}
                  style={[
                    s.day,
                    !isCurrentMonth && s.dayOtherMonth,
                    isToday && s.dayToday,
                    isFuture && s.dayFuture,
                    hasExpenses && intensity > 0 && !isFuture && {
                      backgroundColor: `rgba(139, 92, 246, ${intensity / 400})`,
                      borderColor: intensity > 50 ? `rgba(139, 92, 246, ${intensity / 200})` : colors.border,
                    },
                    dayData.isOverBudget && s.dayOverBudget,
                  ]}
                  onPress={() => handleDayPress(date)}
                  disabled={isFuture && !hasExpenses}
                >
                  <Text style={[s.dayNumber, !isCurrentMonth && s.dayNumberOther, isToday && s.dayNumberToday, isFuture && s.dayNumberFuture]}>
                    {format(date, "d")}
                  </Text>
                  
                  {/* Category Dots */}
                  {hasExpenses && isCurrentMonth && (
                    <View style={s.dots}>
                      {dayData.categories.slice(0, 3).map((catId, idx) => {
                        const cat = getCategory(catId as any);
                        return <View key={idx} style={[s.dot, { backgroundColor: cat.color }]} />;
                      })}
                      {dayData.categories.length > 3 && (
                        <Text style={s.dotOverflow}>+{dayData.categories.length - 3}</Text>
                      )}
                    </View>
                  )}

                  {/* Anomaly Indicator */}
                  {dayData.hasAnomaly && isCurrentMonth && !isFuture && (
                    <View style={s.anomalyBadge}>
                      <AlertTriangle size={8} color={colors.coral} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </GlassCard>

        {/* Legend */}
        <View style={s.legend}>
          <View style={s.legendItem}>
            <View style={[s.legendBox, { backgroundColor: "rgba(139, 92, 246, 0.1)" }]} />
            <Text style={s.legendText}>Low spending</Text>
          </View>
          <View style={s.legendItem}>
            <View style={[s.legendBox, { backgroundColor: "rgba(139, 92, 246, 0.3)" }]} />
            <Text style={s.legendText}>High spending</Text>
          </View>
          <View style={s.legendItem}>
            <AlertTriangle size={12} color={colors.coral} />
            <Text style={s.legendText}>Anomaly</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <DayBottomSheet 
        visible={showDaySheet} 
        onClose={() => setShowDaySheet(false)} 
        dayData={selectedDay} 
        currency={currency} 
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, gap: 16 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { color: colors.primaryText, fontSize: 34, fontWeight: "900" },
  headerActions: { flexDirection: "row", gap: 8 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  monthSelector: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  monthBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  monthInfo: { alignItems: "center", gap: 4 },
  monthText: { color: colors.primaryText, fontSize: 18, fontWeight: "800" },
  monthSpent: { color: colors.secondaryText, fontSize: 13, fontWeight: "700" },
  scroll: { paddingHorizontal: 20, paddingBottom: 20 },
  calendar: { padding: 16, gap: 12 },
  weekdays: { flexDirection: "row", justifyContent: "space-around", marginBottom: 8 },
  weekday: { color: colors.secondaryText, fontSize: 11, fontWeight: "800", width: "12%", textAlign: "center" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 2 },
  day: { width: "13.5%", height: 56, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardSoft, alignItems: "center", justifyContent: "center", padding: 4, marginBottom: 4 },
  dayOtherMonth: { opacity: 0.3 },
  dayToday: { borderColor: colors.violet, borderWidth: 2 },
  dayFuture: { opacity: 0.4 },
  dayOverBudget: { borderColor: colors.coral },
  dayNumber: { color: colors.primaryText, fontSize: 15, fontWeight: "800", marginBottom: 2 },
  dayNumberOther: { color: colors.secondaryText },
  dayNumberToday: { color: colors.violet },
  dayNumberFuture: { color: colors.secondaryText },
  dots: { flexDirection: "row", gap: 2, alignItems: "center", flexWrap: "wrap", justifyContent: "center" },
  dot: { width: 4, height: 4, borderRadius: 2 },
  dotOverflow: { color: colors.secondaryText, fontSize: 8, fontWeight: "800" },
  anomalyBadge: { position: "absolute", top: 2, right: 2, width: 14, height: 14, borderRadius: 7, backgroundColor: `${colors.coral}1F`, alignItems: "center", justifyContent: "center" },
  legend: { flexDirection: "row", justifyContent: "center", gap: 16, marginTop: 16 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendBox: { width: 16, height: 16, borderRadius: 4 },
  legendText: { color: colors.secondaryText, fontSize: 12, fontWeight: "700" },
});

const sh = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "flex-end" },
  sheet: { backgroundColor: colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, borderTopWidth: 1, borderColor: colors.border, maxHeight: "80%" },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.2)", alignSelf: "center", marginTop: 12, marginBottom: 12 },
  content: { paddingBottom: 20 },
  dateHeader: { alignItems: "center", marginBottom: 20, gap: 8 },
  dateTitle: { color: colors.primaryText, fontSize: 20, fontWeight: "800" },
  dateTotal: { color: colors.violet, fontSize: 32, fontWeight: "900" },
  aiCard: { padding: 14, marginBottom: 20 },
  aiHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  aiTitle: { color: colors.violet, fontSize: 13, fontWeight: "800" },
  aiBody: { color: colors.secondaryText, fontSize: 13, lineHeight: 18 },
  section: { marginBottom: 20 },
  sectionTitle: { color: colors.secondaryText, fontSize: 12, fontWeight: "800", textTransform: "uppercase", marginBottom: 12 },
  categoryRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  categoryDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  categoryName: { color: colors.primaryText, fontSize: 14, fontWeight: "700", flex: 1 },
  categoryCount: { color: colors.secondaryText, fontSize: 12, marginRight: 12 },
  categoryAmount: { color: colors.primaryText, fontSize: 14, fontWeight: "800" },
  transactionCard: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  transactionIcon: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center", marginRight: 12 },
  transactionMeta: { flex: 1, gap: 2 },
  transactionMerchant: { color: colors.primaryText, fontSize: 14, fontWeight: "700" },
  transactionTime: { color: colors.secondaryText, fontSize: 12 },
  transactionAmount: { color: colors.primaryText, fontSize: 14, fontWeight: "800" },
  actions: { flexDirection: "row", gap: 12, marginTop: 8 },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 48, borderRadius: 16, backgroundColor: colors.violet, borderWidth: 1, borderColor: `${colors.violet}55` },
  actionText: { color: colors.primaryText, fontSize: 15, fontWeight: "800" },
});
