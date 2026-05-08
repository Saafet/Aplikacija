import { Pressable, StyleSheet, Text } from "react-native";

type GameActionButtonProps = {
    title: string;
    onPress: () => void;
    variant?: "start" | "restart";
};

export default function GameActionButton({
                                             title,
                                             onPress,
                                             variant = "start",
                                         }: GameActionButtonProps) {
    return (
        <Pressable
            style={[styles.button, variant === "restart" && styles.restartButton]}
            onPress={onPress}
        >
            <Text style={[styles.text, variant === "restart" && styles.restartText]}>
                {title}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 18,
        borderRadius: 12,
        backgroundColor: "green",
        alignItems: "center",
        minWidth: 200,
    },
    restartButton: {
        backgroundColor: "#dbeafe",
    },
    text: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "700",
    },
    restartText: {
        color: "#1d4ed8",
    },
});