import { ActivityIndicator, View, StyleSheet } from "react-native";
import LoggedInView from "@/components/auth/LoggedInView";
import LoggedOutView from "@/components/auth/LoggedOutView";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthScreen() {
    const { isLoggedIn, authReady } = useAuth();

    if (!authReady) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return isLoggedIn ? <LoggedInView /> : <LoggedOutView />;
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        backgroundColor: "#EEF3F8",
        justifyContent: "center",
        alignItems: "center",
    },
});
