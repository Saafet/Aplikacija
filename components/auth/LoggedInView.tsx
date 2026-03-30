import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import AuthButton from "@/components/ui/AuthButton";
import AuthInput from "@/components/ui/AuthInput";
import ErrorMessage from "@/components/ui/ErrorMessage";

type Profile = {
    name: string;
    age: string;
    bio: string;
    city: string;
};

type LoggedInViewProps = {
    profile: Profile;
    errorMessage: string;
    onChangeName: (value: string) => void;
    onChangeAge: (value: string) => void;
    onChangeBio: (value: string) => void;
    onChangeCity: (value: string) => void;
    onSaveProfile: () => void;
    onLogout: () => void;

};

export default function LoggedInView({
                                         profile,
                                         errorMessage,
                                         onChangeName,
                                         onChangeAge,
                                         onChangeBio,
                                         onChangeCity,
                                         onSaveProfile,
                                         onLogout,
                                     }: LoggedInViewProps) {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Ionicons name="person-circle-outline" size={72} color="#2563EB" />
                <Text style={styles.title}>Moj profil</Text>

                <AuthInput
                    placeholder="Ime"
                    value={profile.name}
                    onChangeText={onChangeName}
                />

                <AuthInput
                    placeholder="Dob"
                    value={profile.age}
                    onChangeText={onChangeAge}
                    keyboardType="numeric"
                />

                <AuthInput
                    placeholder="Grad"
                    value={profile.city}
                    onChangeText={onChangeCity}
                />

                <AuthInput
                    placeholder="O meni"
                    value={profile.bio}
                    onChangeText={onChangeBio}
                    multiline
                />

                <ErrorMessage message={errorMessage} />

                <AuthButton title="Spremi profil" onPress={onSaveProfile} />
                <AuthButton title="Odjavi se" onPress={onLogout} variant="secondary" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#EEF3F8",
    },
    card: {
        width: "100%",
        maxWidth: 420,
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 22,
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        color: "#111827",
        marginTop: 8,
        marginBottom: 18,
    },
});