import { StyleSheet, Text } from "react-native";

type ErrorMessageProps = {
    message: string;
};

export default function ErrorMessage({ message }: ErrorMessageProps) {
    if (!message) {
        return null;
    }

    return <Text style={styles.error}>{message}</Text>;
}

const styles = StyleSheet.create({
    error: {
        width: "100%",
        color: "#DC2626",
        marginBottom: 12,
        textAlign: "left",
    },
});