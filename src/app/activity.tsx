import { router } from "expo-router";
import { Pencil, RefreshCcw, Search, Tag, Trash2 } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { getCategory } from "@/constants/categories";
import { useAuthStore } from "@/features/auth/store";
import { useExpenseStore } from "@/features/expenses/hooks";
import { Expense, ExpenseCategoryId } from "@/features/expenses/types";
import { useSettingsStore } from "@/features/settings/store";
import { colors } from "@/theme/colors";

function getDateLabel(dateStr: string): string {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "TODAY";
  if (date.toDateString() === yesterday.toDateString()) return "YESTERDAY";
  return date
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    })
    .toUpperCase();
}

function groupByDate(expenses: Expense[]) {
  const groups: { label: string; data: Expense[] }[] = [];
  const map = new Map<string, Expense[]>();
  for (const exp of expenses) {
    const label = getDateLabel(exp.spentAt);
    if (!map.has(label)) {
      const arr: Expense[] = [];
      map.set(label, arr);
      groups.push({ label, data: arr });
    }
    map.get(label)!.push(exp);
  }
  return groups;
}

const CHIPS: { id: ExpenseCategoryId | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "food", label: "Food" },
  { id: "transport", label: "Transport" },
  { id: "subscriptions", label: "Subscriptions" },
  { id: "shopping", label: "Shopping" },
];

function ExpenseSheet({
  expense,
  visible,
  onClose,
}: {
  expense: Expense | null;
  visible: boolean;
  onClose: () => void;
}) {
  const slideY = useRef(new Animated.Value(500)).current;
  const user = useAuthStore((s) => s.user);
  const currency = useSettingsStore((s) => s.currency);
  const removeExpense = useExpenseStore((s) => s.deleteExpense);
  const updateExpense = useExpenseStore((s) => s.updateExpense);

  function show() {
    Animated.spring(slideY, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 4,
    }).start();
  }
  function hide(cb?: () => void) {
    Animated.timing(slideY, {
      toValue: 500,
      duration: 240,
      useNativeDriver: true,
    }).start(cb);
  }

  if (!expense) return null;
  const cat = getCategory(expense.categoryId);
  const Icon = cat.icon;

  async function handleToggleRecurring() {
    if (!user || !expense) return;
    try {
      await updateExpense(user.uid, expense.id, {
        recurring: !expense.recurring,
      });
      hide(onClose);
    } catch (error) {
      // Error handled by store
    }
  }

  async function handleDelete() {
    if (!user || !expense) return;
    try {
      await removeExpense(user.uid, expense.id);
      hide(onClose);
    } catch (error) {
      // Error handled by store
    }
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={() => hide(onClose)}
      onShow={show}
    >
      <Pressable style={sh.overlay} onPress={() => hide(onClose)}>
        <Animated.View
          style={[sh.sheet, { transform: [{ translateY: slideY }] }]}
        >
          <View style={sh.handle} />
          <View style={sh.card}>
            <View
              style={[
                sh.iconWrap,
                {
                  backgroundColor: `${cat.color}1F`,
                  borderColor: `${cat.color}55`,
                },
              ]}
            >
              <Icon size={20} color={cat.color} />
            </View>
            <View style={sh.cardMeta}>
              <Text style={sh.cardName}>{expense.merchant || cat.name}</Text>
              <Text style={sh.cardSub}>
                {cat.name} ·{" "}
                {new Date(expense.spentAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                ·{" "}
                {new Date(expense.spentAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              {expense.recurring && (
                <View style={sh.badge}>
                  <Text style={sh.badgeText}>🔄 Recurring</Text>
                </View>
              )}
            </View>
            <Text style={sh.cardAmount}>
              -{currency}
              {expense.amount.toLocaleString("en-IN")}
            </Text>
          </View>

          <Pressable
            style={sh.action}
            onPress={() => {
              hide(() => router.push(`/expense/${expense.id}`));
            }}
          >
            <Pencil size={18} color={colors.secondaryText} />
            <Text style={sh.actionLabel}>Edit details</Text>
            <Text style={sh.chevron}>›</Text>
          </Pressable>

          <Pressable style={sh.action} onPress={() => hide(onClose)}>
            <Tag size={18} color={colors.secondaryText} />
            <Text style={sh.actionLabel}>Change category</Text>
            <Text style={sh.chevron}>›</Text>
          </Pressable>

          <Pressable style={sh.action} onPress={handleToggleRecurring}>
            <RefreshCcw size={18} color={colors.secondaryText} />
            <Text style={sh.actionLabel}>
              {expense.recurring ? "Remove recurring" : "Mark as recurring"}
            </Text>
            <Text style={sh.chevron}>›</Text>
          </Pressable>

          <Pressable
            style={[sh.action, { borderBottomWidth: 0 }]}
            onPress={handleDelete}
          >
            <Trash2 size={18} color={colors.coral} />
            <Text style={[sh.actionLabel, { color: colors.coral }]}>
              Delete
            </Text>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

function LoadingDots() {
  const dot1 = useRef(new Animated.Value(0.3)).current;
  const dot2 = useRef(new Animated.Value(0.3)).current;
  const dot3 = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animate(dot1, 0);
    animate(dot2, 200);
    animate(dot3, 400);
  }, [dot1, dot2, dot3]);

  return (
    <View style={s.loadingContainer}>
      <Animated.View style={[s.loadingDot, { opacity: dot1 }]} />
      <Animated.View style={[s.loadingDot, { opacity: dot2 }]} />
      <Animated.View style={[s.loadingDot, { opacity: dot3 }]} />
    </View>
  );
}

export default function ActivityScreen() {
  const expenses = useExpenseStore((s) => s.expenses);
  const currency = useSettingsStore((s) => s.currency);
  const [query, setQuery] = useState("");
  const [chip, setChip] = useState<ExpenseCategoryId | "all">("all");
  const [selected, setSelected] = useState<Expense | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 20;

  // Calculate current month total (excluding income)
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthExpenses = expenses.filter(
    (e) =>
      new Date(e.spentAt) >= currentMonthStart && e.categoryId !== "income",
  );
  const total = currentMonthExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate previous month total for comparison (excluding income)
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const prevMonthExpenses = expenses.filter((e) => {
    const date = new Date(e.spentAt);
    return (
      date >= prevMonthStart &&
      date <= prevMonthEnd &&
      e.categoryId !== "income"
    );
  });
  const prevTotal = prevMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const diff = total - prevTotal;
  const hasComparison = prevTotal > 0;
  // For spending: increase is bad (red), decrease is good (green)
  const comparisonColor = diff > 0 ? colors.coral : colors.mint;

  const filtered = expenses.filter((e) => {
    const matchChip = chip === "all" || e.categoryId === chip;
    const q = query.toLowerCase();
    const matchQ =
      !q || e.merchant.toLowerCase().includes(q) || e.categoryId.includes(q);
    return matchChip && matchQ;
  });

  // Paginate filtered expenses
  const paginatedExpenses = filtered.slice(0, page * ITEMS_PER_PAGE);
  const hasMore = filtered.length > paginatedExpenses.length;

  const groups = groupByDate(paginatedExpenses);

  // Reset pagination when filters change
  const handleChipChange = (newChip: ExpenseCategoryId | "all") => {
    setChip(newChip);
    setPage(1);
  };

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      // Simulate async loading with small delay for smooth UX
      setTimeout(() => {
        setPage(prev => prev + 1);
        setIsLoadingMore(false);
      }, 300);
    }
  };

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 100;

    // Check if user scrolled near bottom
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
      handleLoadMore();
    }
  };

  return (
    <View>
      <View style={s.summary}>
        <View style={s.summaryLeft}>
          <Text style={s.summaryLabel}>This month</Text>
          <Text style={s.summaryTotal}>
            {currency}
            {total.toLocaleString("en-IN")}.00
          </Text>
          <View style={s.metaRow}>
            <Text style={s.metaMuted}>
              {currentMonthExpenses.length} transactions
            </Text>
            {hasComparison && (
              <>
                <Text style={s.metaMuted}> · </Text>
                <Text style={[s.metaMuted, { color: comparisonColor }]}>
                  {diff < 0 ? "↓" : "↑"} {currency}
                  {Math.abs(diff).toLocaleString("en-IN")} vs last month
                </Text>
              </>
            )}
          </View>
        </View>
        <View style={s.ring}>
          <View style={s.ringInner} />
        </View>
      </View>

      <View style={s.searchWrap}>
        <Search size={16} color={colors.secondaryText} />
        <TextInput
          value={query}
          onChangeText={handleQueryChange}
          placeholder="Search merchants, notes, categories"
          placeholderTextColor={colors.secondaryText}
          style={s.searchInput}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.chips}
        nestedScrollEnabled
        style={{ height: 36, minHeight: 36, maxHeight: 36, marginVertical: 10 }}
      >
        {CHIPS.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[s.chip, chip === c.id && s.chipActive]}
            onPress={() => handleChipChange(c.id)}
          >
            <Text style={[s.chipText, chip === c.id && s.chipTextActive]}>
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.list}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {groups.length === 0 ? (
          <View style={s.emptyState}>
            <Text style={s.emptyText}>No transactions found</Text>
            <Text style={s.emptySubtext}>
              {query || chip !== "all"
                ? "Try adjusting your filters"
                : "Start tracking your expenses"}
            </Text>
          </View>
        ) : (
          <>
            {groups.map((group) => (
              <View key={group.label}>
                <Text style={s.dateLabel}>{group.label}</Text>
                <View style={s.groupCard}>
                  {group.data.map((expense, idx) => {
                    const cat = getCategory(expense.categoryId);
                    const CatIcon = cat.icon;
                    return (
                      <Pressable
                        key={expense.id}
                        style={[s.row, idx < group.data.length - 1 && s.rowBorder]}
                        onPress={() => {
                          setSelected(expense);
                          setSheetOpen(true);
                        }}
                      >
                        <View
                          style={[
                            s.rowIcon,
                            {
                              backgroundColor: `${cat.color}1F`,
                              borderColor: `${cat.color}55`,
                            },
                          ]}
                        >
                          <CatIcon size={18} color={cat.color} />
                        </View>
                        <View style={s.rowMeta}>
                          <Text style={s.rowMerchant} numberOfLines={1}>
                            {expense.merchant || cat.name}
                          </Text>
                          <Text style={s.rowSub} numberOfLines={1}>
                            {cat.name} ·{" "}
                            {new Date(expense.spentAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                            {expense.recurring ? " · Auto-renewed" : ""}
                          </Text>
                        </View>
                        <Text
                          style={[
                            s.rowAmount,
                            expense.categoryId === "income" && {
                              color: colors.mint,
                            },
                          ]}
                        >
                          {expense.categoryId === "income" ? "+" : "-"}
                          {currency}
                          {expense.amount.toLocaleString("en-IN")}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}

            {/* Loading indicator */}
            {isLoadingMore && <LoadingDots />}

            {/* End of list message */}
            {!hasMore && filtered.length > ITEMS_PER_PAGE && (
              <View style={s.endMessage}>
                <Text style={s.endText}>
                  That's all · {filtered.length} transactions
                </Text>
              </View>
            )}
          </>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>

      <ExpenseSheet
        expense={selected}
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 14,
  },
  summaryLeft: { flex: 1, gap: 4 },
  summaryLabel: {
    color: colors.secondaryText,
    fontSize: 13,
    fontWeight: "600",
  },
  summaryTotal: {
    color: colors.primaryText,
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  metaRow: { flexDirection: "row" },
  metaMuted: { color: colors.secondaryText, fontSize: 13 },
  ring: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 5,
    borderColor: colors.violet,
    borderRightColor: colors.cyan,
    borderBottomColor: colors.indigo,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "-30deg" }],
  },
  ringInner: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.bg,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginHorizontal: 10,
    marginBottom: 12,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 14,
  },
  searchInput: { flex: 1, color: colors.primaryText, fontSize: 14 },
  chips: { maxHeight: 36, paddingHorizontal: 10, gap: 8 },
  chip: {
    maxHeight: 36,
    paddingHorizontal: 16,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: { backgroundColor: colors.violet, borderColor: colors.violet },
  chipText: { color: colors.secondaryText, fontSize: 13, fontWeight: "700" },
  chipTextActive: { color: colors.primaryText },
  list: { padding: 10, paddingBottom: 120 },
  dateLabel: {
    color: colors.secondaryText,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 18,
    marginBottom: 8,
  },
  groupCard: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  rowMeta: { flex: 1, gap: 3 },
  rowMerchant: { color: colors.primaryText, fontSize: 15, fontWeight: "700" },
  rowSub: { color: colors.secondaryText, fontSize: 12 },
  rowAmount: { color: colors.primaryText, fontSize: 15, fontWeight: "800" },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 8,
  },
  emptyText: {
    color: colors.primaryText,
    fontSize: 16,
    fontWeight: "700",
  },
  emptySubtext: {
    color: colors.secondaryText,
    fontSize: 14,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.violet,
    opacity: 0.6,
  },
  endMessage: {
    alignItems: "center",
    paddingVertical: 24,
  },
  endText: {
    color: colors.secondaryText,
    fontSize: 13,
    fontWeight: "600",
  },
});

const sh = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#16172A",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 18,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    padding: 14,
    gap: 12,
    marginBottom: 16,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardMeta: { flex: 1, gap: 3 },
  cardName: { color: colors.primaryText, fontSize: 15, fontWeight: "700" },
  cardSub: { color: colors.secondaryText, fontSize: 12 },
  badge: {
    alignSelf: "flex-start",
    marginTop: 4,
    backgroundColor: "rgba(139,92,246,0.12)",
    borderWidth: 1,
    borderColor: "rgba(139,92,246,0.3)",
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  badgeText: { color: colors.violet, fontSize: 11, fontWeight: "700" },
  cardAmount: { color: colors.primaryText, fontSize: 15, fontWeight: "800" },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  actionLabel: {
    flex: 1,
    color: colors.primaryText,
    fontSize: 15,
    fontWeight: "600",
  },
  chevron: { color: colors.secondaryText, fontSize: 20 },
});
