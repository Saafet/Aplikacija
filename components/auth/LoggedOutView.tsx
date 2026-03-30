import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AuthButton from "@/components/ui/AuthButton";
import AuthInput from "@/components/ui/AuthInput";
import ErrorMessage from "@/components/ui/ErrorMessage";

type LoggedOutViewProps = {
    email: string;
    password: string;
    errorMessage: string;
    setEmail: (value: string) => void;
    setPassword: (value: string) => void;
    onLogin: () => void;
};

export default function LoggedOutView({
                                          email,
                                          password,
                                          errorMessage,
                                          setEmail,
                                          setPassword,
                                          onLogin,
                                      }: LoggedOutViewProps) {
    return (
        <View style={styles.screen}>
            <View style={styles.card}>
                <Ionicons name="person-circle-outline" size={72} color="#2563EB" />
                <Text style={styles.title}>Prijava</Text>

                <AuthInput
                    placeholder="Unesite email adresu"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <AuthInput
                    placeholder="Unesite lozinku"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <ErrorMessage message={errorMessage} />

                <AuthButton title="Prijava" onPress={onLogin} />
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