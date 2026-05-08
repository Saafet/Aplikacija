import { Image, StyleSheet, Text, View } from "react-native";
import type { Game } from "@/types/game";

export default function GameCard({ game }: { game: Game }) {
    return (
        <View style={styles.card}>
            <Image source={{ uri: game.imageUrl }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title}>{game.title}</Text>
                <Text style={styles.description}>{game.description}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
        padding: 12,
        backgroundColor: "#ffffff",
        borderRadius: 14,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    image: {
        width: 68,
        height: 68,
        borderRadius: 10,
        marginRight: 12,
        backgroundColor: "#e5e7eb",
    },
    info: {
        flex: 1,
    },
    title: {
        fontSize: 17,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: "#4b5563",
    },
});