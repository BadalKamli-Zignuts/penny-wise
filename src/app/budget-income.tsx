import { Plus, TrendingDown, TrendingUp } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { CATEGORIES, getCategory } from "@/constants/categories";
import { ExpenseCategoryId } from "@/features/expenses/types";
import { GlassCard } from "../components/ui/GlassCard";
import { GradientButton } from "../components/ui/GradientButton";
import { useAuthStore } from "../features/auth/store";
import { useBudgetStore, useBudgetsWithSpending } from "../features/budgets/hooks/useBudgetsWithSpending";
import { useExpenseStore } from "../features/expenses/hooks";
import { useSettingsStore } from "../features/settings/store";
import { colors } from "../theme/colors";

type TabType = "budgets" | "income";

export default function BudgetIncomeScreen() {
  const user = useAuthStore((s) => s.user);
  const currency = useSettingsStore((s) => s.currency);
  const budgets = useBudgetsWithSpending();
  const expenses = useExpenseStore((s) => s.expenses);
  const addExpense = useExpenseStore((s) => s.addExpense);

  const [activeTab, setActiveTab] = useState<TabType>("budgets");
  const [showAddBudget, setShowAddBudget] = useState(false);
  const [showAddIncome, setShowAddIncome] = useState(false);

  // Calculate total income this month
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const incomeExpenses = expenses.filter((e) =>
    e.categoryId === "income" && new Date(e.spentAt) >= monthStart
  );
  const totalIncome = incomeExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Calculate total budget and spending
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const budgetRemaining = totalBudget - totalSpent;

  return (
    <View style={s.safe}>
      {/* Tabs */}
      <View style={s.tabs}>
        <Pressable
          style={[s.tab, activeTab === "budgets" && s.tabActive]}
          onPress={() => setActiveTab("budgets")}
        >
          <TrendingDown size={20} color={activeTab === "budgets" ? colors.primaryText : colors.secondaryText} />
          <Text style={[s.tabText, activeTab === "budgets" && s.tabTextActive]}>Budgets</Text>
        </Pressable>
        <Pressable
          style={[s.tab, activeTab === "income" && s.tabActive]}
          onPress={() => setActiveTab("income")}
        >
          <TrendingUp size={20} color={activeTab === "income" ? colors.primaryText : colors.secondaryText} />
          <Text style={[s.tabText, activeTab === "income" && s.tabTextActive]}>Income</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {activeTab === "budgets" ? (
          <>
            {/* Budget Overview */}
            <GlassCard style={s.overviewCard}>
              <View style={s.overviewRow}>
                <View style={s.overviewItem}>
                  <Text style={s.overviewLabel}>Total Budget</Text>
                  <Text style={s.overviewAmount}>{currency}{totalBudget.toLocaleString("en-IN")}</Text>
                </View>
                <View style={s.overviewDivider} />
                <View style={s.overviewItem}>
                  <Text style={s.overviewLabel}>Spent</Text>
                  <Text style={[s.overviewAmount, { color: colors.coral }]}>{currency}{totalSpent.toLocaleString("en-IN")}</Text>
                </View>
                <View style={s.overviewDivider} />
                <View style={s.overviewItem}>
                  <Text style={s.overviewLabel}>Remaining</Text>
                  <Text style={[s.overviewAmount, { color: budgetRemaining >= 0 ? colors.mint : colors.coral }]}>
                    {currency}{Math.abs(budgetRemaining).toLocaleString("en-IN")}
                  </Text>
                </View>
              </View>
            </GlassCard>

            {/* Budget List */}
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <Text style={s.sectionTitle}>Category Budgets</Text>
                <Pressable style={s.addBtn} onPress={() => setShowAddBudget(true)}>
                  <Plus size={18} color={colors.violet} />
                  <Text style={s.addBtnText}>Add Budget</Text>
                </Pressable>
              </View>

              {budgets.length === 0 ? (
                <GlassCard style={s.emptyCard}>
                  <Text style={s.emptyTitle}>No budgets set</Text>
                  <Text style={s.emptyBody}>Set budgets for different categories to track your spending</Text>
                  <GradientButton label="Set First Budget" onPress={() => setShowAddBudget(true)} />
                </GlassCard>
              ) : (
                budgets.map((budget) => {
                  const cat = getCategory(budget.categoryId);
                  const Icon = cat.icon;
                  const percentage = budget.percentage;
                  const isOver = budget.isOverBudget;

                  return (
                    <GlassCard key={budget.id} style={s.budgetCard}>
                      <View style={s.budgetHeader}>
                        <View style={[s.budgetIcon, { backgroundColor: `${cat.color}1F`, borderColor: `${cat.color}55` }]}>
                          <Icon size={20} color={cat.color} />
                        </View>
                        <View style={s.budgetMeta}>
                          <Text style={s.budgetName}>{cat.name}</Text>
                          <Text style={s.budgetSubtext}>
                            {currency}{budget.spent.toLocaleString("en-IN")} of {currency}{budget.amount.toLocaleString("en-IN")}
                          </Text>
                        </View>
                        <View style={s.budgetRight}>
                          <Text style={[s.budgetPercentage, isOver && { color: colors.coral }]}>
                            {Math.round(percentage)}%
                          </Text>
                          <Text style={[s.budgetRemaining, { color: isOver ? colors.coral : colors.mint }]}>
                            {currency}{Math.abs(budget.remaining).toLocaleString("en-IN")} {isOver ? "over" : "left"}
                          </Text>
                        </View>
                      </View>
                      {/* Progress Bar */}
                      <View style={s.progressBar}>
                        <View
                          style={[
                            s.progressFill,
                            {
                              width: `${Math.min(percentage, 100)}%`,
                              backgroundColor: isOver ? colors.coral : percentage > 80 ? colors.amber : colors.violet
                            }
                          ]}
                        />
                      </View>
                    </GlassCard>
                  );
                })
              )}
            </View>
          </>
        ) : (
          <>
            {/* Income Overview */}
            <GlassCard style={s.overviewCard}>
              <View style={s.incomeHeader}>
                <View>
                  <Text style={s.overviewLabel}>Total Income This Month</Text>
                  <Text style={[s.overviewAmount, { color: colors.mint, fontSize: 36 }]}>
                    {currency}{totalIncome.toLocaleString("en-IN")}
                  </Text>
                </View>
                <View style={[s.incomeIcon, { backgroundColor: `${colors.mint}1F` }]}>
                  <TrendingUp size={32} color={colors.mint} />
                </View>
              </View>
            </GlassCard>

            {/* Income List */}
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <Text style={s.sectionTitle}>Income Entries</Text>
                <Pressable style={s.addBtn} onPress={() => setShowAddIncome(true)}>
                  <Plus size={18} color={colors.mint} />
                  <Text style={[s.addBtnText, { color: colors.mint }]}>Add Income</Text>
                </Pressable>
              </View>

              {incomeExpenses.length === 0 ? (
                <GlassCard style={s.emptyCard}>
                  <Text style={s.emptyTitle}>No income recorded</Text>
                  <Text style={s.emptyBody}>Track your income sources to get a complete financial picture</Text>
                  <GradientButton label="Add First Income" onPress={() => setShowAddIncome(true)} />
                </GlassCard>
              ) : (
                incomeExpenses.map((income) => (
                  <GlassCard key={income.id} style={s.incomeCard}>
                    <View style={s.incomeRow}>
                      <View style={[s.incomeIconSmall, { backgroundColor: `${colors.mint}1F` }]}>
                        <TrendingUp size={18} color={colors.mint} />
                      </View>
                      <View style={s.incomeMeta}>
                        <Text style={s.incomeName}>{income.merchant}</Text>
                        <Text style={s.incomeDate}>
                          {new Date(income.spentAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </Text>
                      </View>
                      <Text style={[s.incomeAmount, { color: colors.mint }]}>
                        +{currency}{income.amount.toLocaleString("en-IN")}
                      </Text>
                    </View>
                  </GlassCard>
                ))
              )}
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Budget Modal */}
      <AddBudgetModal
        visible={showAddBudget}
        onClose={() => setShowAddBudget(false)}
        onAdd={async (categoryId, amount) => {
          if (!user) return;
          const now = new Date();
          const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

          await useBudgetStore.getState().addBudget(user.uid, {
            categoryId,
            amount,
            currency,
            period: "monthly",
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          });
          setShowAddBudget(false);
        }}
      />

      {/* Add Income Modal */}
      <AddIncomeModal
        visible={showAddIncome}
        onClose={() => setShowAddIncome(false)}
        onAdd={async (amount, source, date) => {
          if (!user) return;
          await addExpense(user.uid, {
            amount,
            currency,
            categoryId: "income",
            merchant: source,
            note: "",
            recurring: false,
            spentAt: date.toISOString(),
          });
          setShowAddIncome(false);
        }}
      />
    </View>
  );
}

function AddBudgetModal({
  visible,
  onClose,
  onAdd
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (categoryId: ExpenseCategoryId, amount: number) => Promise<void>;
}) {
  const currency = useSettingsStore((s) => s.currency);
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategoryId>("food");

  async function handleAdd() {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) return;

    await onAdd(selectedCategory, amountNum);
    setAmount("");
    setSelectedCategory("food");
  }

  // Filter out income and other categories
  const budgetCategories = CATEGORIES.filter(c => c.id !== "income" && c.id !== "other");

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={m.overlay}>
        <Pressable style={m.backdrop} onPress={onClose} />
        <View style={m.modal}>
          <View style={m.handle} />
          <Text style={m.modalTitle}>Set Budget</Text>

          <View style={m.amountWrap}>
            <Text style={[m.currency, { color: colors.violet }]}>{currency}</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.secondaryText}
              style={m.amountInput}
            />
          </View>

          <Text style={m.label}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={m.categories}
          >
            {budgetCategories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  style={m.category}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <View style={[
                    m.categoryIcon,
                    {
                      backgroundColor: isSelected ? `${cat.color}1F` : colors.cardSoft,
                      borderColor: isSelected ? cat.color : colors.border
                    }
                  ]}>
                    <Icon size={20} color={isSelected ? cat.color : colors.secondaryText} />
                  </View>
                  <Text style={[m.categoryName, isSelected && { color: colors.primaryText }]}>
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <GradientButton label="Set Budget" onPress={handleAdd} />
          <Pressable onPress={onClose}>
            <Text style={m.cancel}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function AddIncomeModal({
  visible,
  onClose,
  onAdd
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (amount: number, source: string, date: Date) => Promise<void>;
}) {
  const currency = useSettingsStore((s) => s.currency);
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState("");

  async function handleAdd() {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0 || !source.trim()) return;

    await onAdd(amountNum, source.trim(), new Date());
    setAmount("");
    setSource("");
  }

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={m.overlay}>
        <Pressable style={m.backdrop} onPress={onClose} />
        <View style={m.modal}>
          <View style={m.handle} />
          <Text style={m.modalTitle}>Add Income</Text>

          <View style={m.amountWrap}>
            <Text style={m.currency}>{currency}</Text>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.secondaryText}
              style={m.amountInput}
            />
          </View>

          <View style={m.field}>
            <TextInput
              value={source}
              onChangeText={setSource}
              placeholder="Income source (e.g., Salary, Freelance)"
              placeholderTextColor={colors.secondaryText}
              style={m.input}
            />
          </View>

          <GradientButton label="Add Income" onPress={handleAdd} />
          <Pressable onPress={onClose}>
            <Text style={m.cancel}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  tabs: { flexDirection: "row", marginHorizontal: 10, marginVertical: 16, backgroundColor: colors.card, borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 4 },
  tab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 12, borderRadius: 12 },
  tabActive: { backgroundColor: colors.cardSoft },
  tabText: { color: colors.secondaryText, fontSize: 14, fontWeight: "800" },
  tabTextActive: { color: colors.primaryText },
  scroll: { paddingHorizontal: 10 },
  overviewCard: { padding: 20, marginBottom: 24 },
  overviewRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-around" },
  overviewItem: { alignItems: "center", gap: 8 },
  overviewDivider: { width: 1, height: 40, backgroundColor: colors.border },
  overviewLabel: { color: colors.secondaryText, fontSize: 13, fontWeight: "700" },
  overviewAmount: { color: colors.primaryText, fontSize: 24, fontWeight: "900" },
  incomeHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  incomeIcon: { width: 64, height: 64, borderRadius: 32, alignItems: "center", justifyContent: "center" },
  section: { gap: 12 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  sectionTitle: { color: colors.primaryText, fontSize: 20, fontWeight: "900" },
  addBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: colors.cardSoft, borderWidth: 1, borderColor: colors.border },
  addBtnText: { color: colors.violet, fontSize: 14, fontWeight: "800" },
  emptyCard: { padding: 32, alignItems: "center", gap: 12 },
  emptyTitle: { color: colors.primaryText, fontSize: 20, fontWeight: "800" },
  emptyBody: { color: colors.secondaryText, fontSize: 14, textAlign: "center", lineHeight: 20 },
  budgetCard: { padding: 16, gap: 12 },
  budgetHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  budgetIcon: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  budgetMeta: { flex: 1, gap: 4 },
  budgetName: { color: colors.primaryText, fontSize: 16, fontWeight: "800" },
  budgetSubtext: { color: colors.secondaryText, fontSize: 13 },
  budgetRight: { alignItems: "flex-end", gap: 2 },
  budgetPercentage: { color: colors.primaryText, fontSize: 18, fontWeight: "900" },
  budgetRemaining: { fontSize: 12, fontWeight: "700" },
  progressBar: { height: 6, backgroundColor: colors.cardSoft, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },
  incomeCard: { padding: 14 },
  incomeRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  incomeIconSmall: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  incomeMeta: { flex: 1, gap: 2 },
  incomeName: { color: colors.primaryText, fontSize: 15, fontWeight: "700" },
  incomeDate: { color: colors.secondaryText, fontSize: 12 },
  incomeAmount: { fontSize: 16, fontWeight: "800" },
});

const m = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.6)" },
  modal: { backgroundColor: colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, borderTopWidth: 1, borderColor: colors.border, gap: 16, minHeight: "65%" },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.2)", alignSelf: "center", marginBottom: 8 },
  modalTitle: { color: colors.primaryText, fontSize: 22, fontWeight: "900", textAlign: "center" },
  amountWrap: { flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8 },
  currency: { color: colors.mint, fontSize: 34, fontWeight: "800" },
  amountInput: { color: colors.primaryText, fontSize: 56, fontWeight: "900", minWidth: 150, textAlign: "center" },
  label: { color: colors.secondaryText, fontSize: 13, fontWeight: "800", textTransform: "uppercase", marginTop: 8 },
  categories: { flexDirection: "row", gap: 12, paddingVertical: 8 },
  category: { alignItems: "center", gap: 6, width: 68 },
  categoryIcon: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  categoryName: { color: colors.secondaryText, fontSize: 11, fontWeight: "800", textAlign: "center" },
  field: { height: 54, borderRadius: 18, borderColor: colors.border, borderWidth: 1, backgroundColor: colors.cardSoft, paddingHorizontal: 14, justifyContent: "center" },
  input: { color: colors.primaryText, fontSize: 15 },
  cancel: { color: colors.secondaryText, fontSize: 15, fontWeight: "800", textAlign: "center", paddingVertical: 12 },
});
