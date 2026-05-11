import { StyleSheet, Text, View } from "react-native";

type SensorValueRowProps = {
    label: string;
    value: number | string;
};

export default function SensorValueRow({ label, value }: SensorValueRowProps) {
    const displayValue = typeof value === "number" ? value.toFixed(3) : value;

    return (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{displayValue}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
    },
    label: {
        color: "#4b5563",
        fontWeight: "600",
    },
    value: {
        color: "#111827",
        fontVariant: ["tabular-nums"],
    },
});