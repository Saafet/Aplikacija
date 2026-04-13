import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import ErrorMessage from "./ErrorMessage";
import { useAuth } from "@/contexts/AuthContext";

export default function LoggedOutView() {
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async () => {
        try {
            await login(email, password);
            setErrorMessage("");
        } catch (error: any) {
            setErrorMessage(error.message ?? "Prijava nije uspjela.");
        }
    };

    return (
        <View style={styles.screen}>
            <View style={styles.card}>
                <Ionicons name="person-circle-outline" size={72} color="#2563EB" />
                <Text style={styles.title}>Prijava</Text>

                <AuthInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <AuthInput
                    placeholder="Lozinka"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <ErrorMessage message={errorMessage} />
                <AuthButton title="Prijava" onPress={handleLogin} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    card: {
        width: "100%",
        maxWidth: 380,
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#111827",
        marginTop: 10,
        marginBottom: 18,
    },
});
