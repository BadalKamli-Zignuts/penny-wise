import { Tabs, router } from "expo-router";
import {
  CalendarDays,
  ChartPie,
  Home,
  MessageCircle,
  Plus,
} from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { useBudgetSync } from "../../features/budgets/hooks/useBudgetsWithSpending";
import { useExpenseSync } from "../../features/expenses/hooks";
import { colors } from "../../theme/colors";

function AddButton() {
  return (
    <Pressable
      style={styles.addButton}
      onPress={() => router.push("/expense/new")}
    >
      <Plus size={30} color={colors.primaryText} />
    </Pressable>
  );
}

export default function TabsLayout() {
  // Initialize real-time syncing with Firebase
  useExpenseSync();
  useBudgetSync();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primaryText,
        tabBarInactiveTintColor: colors.secondaryText,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="analytics"
        options={{
          tabBarIcon: ({ color }) => <ChartPie size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          tabBarButton: () => (
            <View style={styles.addWrap}>
              <AddButton />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          tabBarIcon: ({ color }) => <CalendarDays size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="coach"
        options={{
          tabBarIcon: ({ color }) => <MessageCircle size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    height: 82,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.tabBarBg,
  },
  addWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    top: -18,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.violet,
    borderWidth: 3,
    borderColor: colors.bg,
  },
});
