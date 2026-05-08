import { StyleSheet, Text, View } from "react-native";

export default function NumberDisplay({ value }: { value: number }) {
    return (
        <View style={styles.wrapper}>
            <Text style={styles.number}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: "center",
        justifyContent: "center",
        minHeight: 140,
    },
    number: {
        fontSize: 96,
        fontWeight: "700",
        color: "#111827",
    },
});