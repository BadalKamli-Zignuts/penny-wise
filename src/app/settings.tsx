import { router } from "expo-router";
import { Banknote, LogOut, User } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { GlassCard } from "../components/ui/GlassCard";
import { useAuthStore } from "../features/auth/store";
import { useSettingsStore } from "../features/settings/store";
import { signOutUser } from "../lib/firebase/auth";
import { colors } from "../theme/colors";

export default function SettingsScreen() {
  const { name, currency, tone, setName, setCurrency, setTone } = useSettingsStore();
  const user = useAuthStore((state) => state.user);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);

  function handleSaveName() {
    if (tempName.trim()) {
      setName(tempName.trim());
      setEditingName(false);
    }
  }

  return (
    <View style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <GlassCard style={styles.card}>
          <Text style={styles.label}>Your Name</Text>
          {editingName ? (
            <View style={styles.nameEdit}>
              <TextInput
                value={tempName}
                onChangeText={setTempName}
                style={styles.nameInput}
                placeholder="Enter your name"
                placeholderTextColor={colors.secondaryText}
                autoFocus
                onSubmitEditing={handleSaveName}
              />
              <Pressable onPress={handleSaveName} style={styles.saveBtn}>
                <Text style={styles.saveBtnText}>Save</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable onPress={() => { setTempName(name); setEditingName(true); }} style={styles.nameDisplay}>
              <User size={18} color={colors.secondaryText} />
              <Text style={styles.nameText}>{name || "Tap to set your name"}</Text>
              <Text style={styles.editHint}>Tap to edit</Text>
            </Pressable>
          )}
        </GlassCard>

        <GlassCard style={styles.card}>
          <Text style={styles.label}>Currency</Text>
          <View style={styles.row}>
            {["₹", "$", "€"].map((item) => <Pressable key={item} onPress={() => setCurrency(item)}><Text style={[styles.pill, currency === item && styles.active]}>{item}</Text></Pressable>)}
          </View>
        </GlassCard>
        <GlassCard style={styles.card}>
          <Text style={styles.label}>AI tone</Text>
          <View style={styles.row}>
            {(["casual", "strict", "advisor"] as const).map((item) => <Pressable key={item} onPress={() => setTone(item)}><Text style={[styles.pill, tone === item && styles.active]}>{item}</Text></Pressable>)}
          </View>
        </GlassCard>
        <GlassCard style={styles.card}>
          <Text style={styles.label}>Budget & Income</Text>
          <Pressable
            style={styles.manageButton}
            onPress={() => router.push("/budget-income")}>
            <Banknote size={18} color={colors.violet} />
            <Text style={styles.manageButtonText}>
              Manage Budgets & Income
            </Text>
          </Pressable>
        </GlassCard>

        <Pressable
          style={styles.signOut}
          onPress={async () => {
            await signOutUser().catch(() => undefined);
            router.replace("/(auth)/sign-in");
          }}>
          <LogOut size={18} color={colors.coral} />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { backgroundColor: colors.bg },
  scroll: { paddingVertical: 20, paddingHorizontal: 10, gap: 20 },
  card: { padding: 18, gap: 14 },
  label: { color: colors.primaryText, fontSize: 16, fontWeight: "900" },
  body: { color: colors.secondaryText, fontSize: 14, lineHeight: 20 },
  nameDisplay: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, backgroundColor: colors.cardSoft, borderRadius: 12 },
  nameText: { flex: 1, color: colors.primaryText, fontSize: 16, fontWeight: "700" },
  editHint: { color: colors.secondaryText, fontSize: 13 },
  nameEdit: { flexDirection: "row", gap: 8 },
  nameInput: { flex: 1, height: 48, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardSoft, paddingHorizontal: 14, color: colors.primaryText, fontSize: 16 },
  saveBtn: { height: 48, paddingHorizontal: 20, borderRadius: 12, backgroundColor: colors.violet, alignItems: "center", justifyContent: "center" },
  saveBtnText: { color: colors.primaryText, fontSize: 15, fontWeight: "700" },
  row: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  pill: { color: colors.secondaryText, borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8, overflow: "hidden", fontWeight: "800" },
  active: { color: colors.bg, backgroundColor: colors.primaryText },
  manageButton: { flexDirection: "row", gap: 8, alignItems: "center", padding: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.cardSoft },
  manageButtonText: { color: colors.violet, fontWeight: "700" },
  signOut: { flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "center", padding: 14 },
  signOutText: { color: colors.coral, fontWeight: "900" },
});
