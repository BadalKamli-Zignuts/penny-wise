import { QuickAction } from "@/components/ui/QuickAction"
import { router } from "expo-router"
import { Mic, Plus, ScanLine, Sparkles } from "lucide-react-native"
import { View } from "react-native"
import { dashboardStyles } from "../styles"

export const Actions = () => {
    return (
        <View style={dashboardStyles.actions}>
            <QuickAction icon={ScanLine} label="Scan" />
            <QuickAction icon={Mic} label="Voice" active />
            <QuickAction
                icon={Sparkles}
                label="Ask AI"
                onPress={() => router.push("/(tabs)/coach")}
            />
            <QuickAction
                icon={Plus}
                label="Manual"
                onPress={() => router.push("/expense/new")}
            />
        </View>
    )
}