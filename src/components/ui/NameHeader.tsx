import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { dashboardStyles as styles } from "../../features/dashboard/styles";

import { useSettingsStore } from "@/features/settings/store";

export default function NameHeader() {
    const name = useSettingsStore((state) => state.name);

    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Pressable onPress={() => router.push("/settings")}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {name ? name.slice(0, 2).toUpperCase() : "👤"}
                        </Text>
                    </View>
                </Pressable>
                <View>
                    <Text style={styles.muted}>Good morning,</Text>
                    <Text style={styles.name}>{name || "User"}</Text>
                </View>
            </View>
        </View>
    );
}
