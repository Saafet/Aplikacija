import { useEffect, useState } from "react";
import {
    Alert,
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { addDoc, collection, getDocs } from "firebase/firestore";
import AddGameModal from "@/components/games/AddGameModal";
import GameCard from "@/components/games/GameCard";
import { useAuth } from "@/contexts/AuthContext";
import { firestore } from "@/firebase";
import type { Game } from "@/types/game";

export default function GamesScreen() {
    const { isLoggedIn } = useAuth();

    const [games, setGames] = useState<Game[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [gameTitle, setGameTitle] = useState("");
    const [gameDescription, setGameDescription] = useState("");
    const [gameImageUrl, setGameImageUrl] = useState("");

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const gamesCollection = collection(firestore, "games");
                const gamesSnapshot = await getDocs(gamesCollection);

                const gamesList = gamesSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...(doc.data() as Omit<Game, "id">),
                }));

                setGames(gamesList);
            } catch (error) {
                console.error("Error loading games:", error);
                Alert.alert("Greška", "Došlo je do greške pri učitavanju igara.");
            }
        };

        fetchGames();
    }, []);

    const resetForm = () => {
        setGameTitle("");
        setGameDescription("");
        setGameImageUrl("");
    };

    const handleAddGame = async () => {
        if (!gameTitle || !gameDescription || !gameImageUrl) {
            Alert.alert("Nedostaju podaci", "Molimo unesite sve podatke o igri.");
            return;
        }

        if (!isLoggedIn) {
            Alert.alert("Prijava je potrebna", "Za dodavanje nove igre prvo se prijavite u Auth tabu.");
            return;
        }

        const newGame = {
            title: gameTitle,
            description: gameDescription,
            imageUrl: gameImageUrl,
        };

        try {
            const docRef = await addDoc(collection(firestore, "games"), newGame);
            setGames((prev) => [...prev, { id: docRef.id, ...newGame }]);
            setModalVisible(false);
            resetForm();
            Alert.alert("Uspjeh", "Nova igra je uspješno dodana.");
        } catch (error) {
            console.error("Error adding game:", error);
            Alert.alert("Greška", "Došlo je do greške pri dodavanju igre.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Games</Text>
            <Text style={styles.subtitle}>
                Pregled dostupnih igara i dodavanje novih unosa u Firestore.
            </Text>

            <Pressable style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>Dodaj igru</Text>
            </Pressable>

            <FlatList
                data={games}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <GameCard game={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />

            <AddGameModal
                visible={modalVisible}
                title={gameTitle}
                description={gameDescription}
                imageUrl={gameImageUrl}
                onChangeTitle={setGameTitle}
                onChangeDescription={setGameDescription}
                onChangeImageUrl={setGameImageUrl}
                onClose={() => setModalVisible(false)}
                onSubmit={handleAddGame}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#eef3f8",
        paddingHorizontal: 18,
        paddingTop: 18,
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 14,
        color: "#4b5563",
        marginBottom: 16,
    },
    addButton: {
        backgroundColor: "#2563EB",
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
        marginBottom: 16,
    },
    addButtonText: {
        color: "#ffffff",
        fontWeight: "700",
        fontSize: 16,
    },
    listContent: {
        paddingBottom: 24,
    },
});