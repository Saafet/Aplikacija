import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import LoggedInView from "@/components/auth/LoggedInView";
import LoggedOutView from "@/components/auth/LoggedOutView";
import { auth, firestore } from "@/firebase";

type Profile = {
    name: string;
    age: string;
    bio: string;
    city: string;
};

const getFirestoreProfileErrorMessage = (
    error: { code?: string; message?: string },
    operation: "load" | "save"
) => {
    if (error.code === "permission-denied") {
        return `Cannot ${operation} profile because Firestore denied access.`;
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
        city: "",
    });

    const emptyProfile: Profile = {
        name: "",
        age: "",
        bio: "",
        city: "",
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
            alert("Podaci su spremljeni u Firestore.");
        } catch (error: any) {
            setErrorMsg(getFirestoreProfileErrorMessage(error, "save"));
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
            <LoggedInView
                profile={profile}
                errorMessage={errorMsg}
                onChangeName={(value) => setProfile({ ...profile, name: value })}
                onChangeAge={(value) => setProfile({ ...profile, age: value })}
                onChangeBio={(value) => setProfile({ ...profile, bio: value })}
                onChangeCity={(value) => setProfile({ ...profile, city: value })}
                onSaveProfile={handleSaveProfile}
                onLogout={handleLogout}

            />
        );
    }

    return (
        <LoggedOutView
            email={email}
            password={password}
            errorMessage={errorMsg}
            setEmail={setEmail}
            setPassword={setPassword}
            onLogin={handleLogin}
        />
    );
}