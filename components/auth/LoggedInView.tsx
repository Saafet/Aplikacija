import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { firestore } from "@/firebase";
import { useAuth } from "@/contexts/AuthContext";
import AuthInput from "./AuthInput";
import AuthButton from "./AuthButton";
import ErrorMessage from "./ErrorMessage";

type Profile = {
    name: string;
    age: string;
    bio: string;
};

const emptyProfile: Profile = {
    name: "",
    age: "",
    bio: "",
};

export default function LoggedInView() {
    const { user, logout } = useAuth();

    const [profile, setProfile] = useState<Profile>(emptyProfile);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;

            try {
                const docRef = doc(firestore, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProfile(docSnap.data() as Profile);
                } else {
                    await setDoc(doc(firestore, "users", user.uid), emptyProfile);
                    setProfile(emptyProfile);
                }
            } catch (error: any) {
                setErrorMessage(error.message ?? "Greška pri učitavanju profila.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    const handleSaveProfile = async () => {
        if (!user) return;

        try {
            await setDoc(doc(firestore, "users", user.uid), profile);
            setErrorMessage("");
            Alert.alert("Uspjeh", "Profil je spremljen.");
        } catch (error: any) {
            setErrorMessage(error.message ?? "Greška pri spremanju profila.");
        }
    };

    const handleLogout = async () => {
        await logout();
        setProfile(emptyProfile);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <Text>Učitavanje profila...</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Ionicons name="person-circle-outline" size={72} color="#2563EB" />
                <Text style={styles.title}>Moj profil</Text>

                <AuthInput
                    placeholder="Ime"
                    value={profile.name}
                    onChangeText={(text) => setProfile({ ...profile, name: text })}
                />

                <AuthInput
                    placeholder="Dob"
                    value={profile.age}
                    onChangeText={(text) => setProfile({ ...profile, age: text })}
                    keyboardType="numeric"
                />

                <AuthInput
                    placeholder="O meni"
                    value={profile.bio}
                    onChangeText={(text) => setProfile({ ...profile, bio: text })}
                    multiline
                />

                <ErrorMessage message={errorMessage} />
                <AuthButton title="Spremi profil" onPress={handleSaveProfile} />
                <AuthButton title="Odjavi se" onPress={handleLogout} variant="secondary" />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        backgroundColor: "#EEF3F8",
        justifyContent: "center",
        alignItems: "center",
    },
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
