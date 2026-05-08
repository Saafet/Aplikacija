import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SumAnswerInputProps = {
    value: string;
    onChangeText: (text: string) => void;
    onSubmit: () => void;
};

export default function SumAnswerInput({
                                           value,
                                           onChangeText,
                                           onSubmit,
                                       }: SumAnswerInputProps) {
    return (
        <View style={styles.row}>
            <TextInput
                placeholder="Unesite zbroj brojeva"
                value={value}
                onChangeText={onChangeText}
                keyboardType="numeric"
                style={styles.input}
                placeholderTextColor="#6B7280"
            />
            <Pressable style={styles.iconButton} onPress={onSubmit}>
                <Ionicons name="checkmark-circle-outline" size={32} color="green" />
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
    },
    input: {
        flex: 1,
        height: 50,
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 12,
        paddingHorizontal: 14,
        backgroundColor: "#ffffff",
        color: "#111827",
    },
    iconButton: {
        marginLeft: 12,
    },
});