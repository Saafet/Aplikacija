import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { fetchLeaderboard } from "@/services/scoreService";
import type { LeaderboardUser } from "@/types/leaderboard";

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            const data = await fetchLeaderboard();
            setLeaderboard(data);
            setErrorMessage("");
        } catch (error: any) {
            setErrorMessage(error.message ?? "Greška pri učitavanju leaderboard-a.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadLeaderboard();
    }, []);

    if (loading) {
        return <ActivityIndicator size="small" color="#2563EB" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Leaderboard</Text>

            {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

            <FlatList
                data={leaderboard}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item, index }) => (
                    <View style={styles.row}>
                        <Text style={styles.rank}>{index + 1}.</Text>
                        <Text style={styles.username}>{item.username}</Text>
                        <Text style={styles.score}>{item.score} bodova</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
        paddingTop: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 10,
        textAlign: "center",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: "#F3F4F6",
    },
    rank: {
        width: 32,
        fontWeight: "700",
        color: "#111827",
    },
    username: {
        flex: 1,
        color: "#111827",
    },
    score: {
        fontWeight: "700",
        color: "#2563EB",
    },
    error: {
        color: "#DC2626",
        marginBottom: 8,
    },
});