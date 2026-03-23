import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    Alert,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, firestore } from "../../firebaseConfig";

type Profile = {
    name: string;
    age: string;
    bio: string;
};

const getFirestoreProfileErrorMessage = (
    error: { code?: string; message?: string },
    operation: "load" | "save"
) => {
    if (error.code === "permission-denied") {
        return `Cannot ${operation} profile because Firestore denied access. Update your Firebase rules to allow signed-in users to read and write users/{uid}.`;
    }

    return error.message ?? `Failed to ${operation} profile.`;
};

export default function AuthScreen() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    const [profile, setProfile] = useState<Profile>({
        name: "",
        age: "",
        bio: "",
    });

    const emptyProfile: Profile = {
        name: "",
        age: "",
        bio: "",
    };

    const loadProfile = async (userId: string) => {
        const docRef = doc(firestore, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data() as Profile;
        }

        await setDoc(doc(firestore, "users", userId), emptyProfile);
        return emptyProfile;
    };

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            setErrorMsg("");
            setLoggedIn(true);

            const userId = userCredential.user.uid;
            try {
                const loadedProfile = await loadProfile(userId);
                setProfile(loadedProfile);
            } catch (error: any) {
                setProfile(emptyProfile);
                setErrorMsg(getFirestoreProfileErrorMessage(error, "load"));
            }
        } catch (error: any) {
            setLoggedIn(false);
            setErrorMsg(error.message ?? "Failed to sign in.");
        }
    };

    const handleSaveProfile = async () => {
        const userId = auth.currentUser?.uid;

        if (!userId) {
            return;
        }

        try {
            await setDoc(doc(firestore, "users", userId), profile);
            setErrorMsg("");
            Alert.alert("Uspjeh", "Podaci su spremljeni u Firestore.");
        } catch (error: any) {
            const message = getFirestoreProfileErrorMessage(error, "save");
            setErrorMsg(message);
            Alert.alert("Greška", message);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        setLoggedIn(false);
        setErrorMsg("");
        setProfile(emptyProfile);
    };

    if (loggedIn) {
        return (
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.card}>
                    <Ionicons name="person-circle-outline" size={72} color="#1f6feb" />
                    <Text style={styles.title}>Moj profil</Text>

                    <TextInput
                        placeholder="Ime"
                        value={profile.name}
                        onChangeText={(text) => setProfile({ ...profile, name: text })}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Dob"
                        value={profile.age}
                        onChangeText={(text) => setProfile({ ...profile, age: text })}
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="O meni"
                        value={profile.bio}
                        onChangeText={(text) => setProfile({ ...profile, bio: text })}
                        multiline
                        style={[styles.input, styles.textArea]}
                    />

                    {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

                    <Pressable style={styles.primaryButton} onPress={handleSaveProfile}>
                        <Text style={styles.primaryButtonText}>Spremi profil</Text>
                    </Pressable>

                    <Pressable style={styles.secondaryButton} onPress={handleLogout}>
                        <Text style={styles.secondaryButtonText}>Odjavi se</Text>
                    </Pressable>
                </View>
            </ScrollView>
        );

    }

    return (
        <View style={styles.screen}>
            <View style={styles.card}>
                <Ionicons name="person-circle-outline" size={72} color="#1f6feb" />
                <Text style={styles.title}>Prijava</Text>

                <TextInput
                    placeholder="Unesite email adresu"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={styles.input}
                />

                <TextInput
                    placeholder="Unesite lozinku"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.input}
                />

                {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

                <Pressable style={styles.primaryButton} onPress={handleLogin}>
                    <Text style={styles.primaryButtonText}>Prijava</Text>
                </Pressable>
            </View>
        </View>

    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#eef3f8",
    },
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#eef3f8",
    },
    card: {
        width: "100%",
        maxWidth: 420,
        backgroundColor: "#ffffff",
        borderRadius: 18,
        padding: 22,
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        marginTop: 8,
        marginBottom: 18,
        color: "#111827",
    },
    input: {
        width: "100%",
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#d0d7de",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 12,
        color: "#111827",
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: "top",
    },
    error: {
        width: "100%",
        color: "#b42318",
        marginBottom: 12,
    },
    primaryButton: {
        width: "100%",
        backgroundColor: "#1f6feb",
        paddingVertical: 13,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 4,
    },
    primaryButtonText: {
        color: "#ffffff",
        fontWeight: "700",
    },
    secondaryButton: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#cbd5e1",
        paddingVertical: 13,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
        backgroundColor: "#ffffff",
    },
    secondaryButtonText: {
        color: "#111827",
        fontWeight: "600",
    },
});