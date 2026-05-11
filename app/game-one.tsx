import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import GameActionButton from "@/components/game-one/GameActionButton";
import Leaderboard from "@/components/game-one/Leaderboard";
import NumberDisplay from "@/components/game-one/NumberDisplay";
import SumAnswerInput from "@/components/game-one/SumAnswerInput";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserScore } from "@/services/scoreService";


export default function GameOneScreen() {
    const { user, isLoggedIn } = useAuth();


    const [numbers, setNumbers] = useState<number[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sum, setSum] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [message, setMessage] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const [answerSubmitted, setAnswerSubmitted] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);


    const generateRandomNumbers = () => {
        const nums: number[] = [];
        let previousNum: number | null = null;


        for (let i = 0; i < 10; i++) {
            let newNum: number;


            do {
                newNum = Math.floor(Math.random() * 10);
            } while (newNum === previousNum);


            nums.push(newNum);
            previousNum = newNum;
        }


        setNumbers(nums);
        setSum(nums.reduce((acc, num) => acc + num, 0));
        setCurrentIndex(0);
        setShowInput(false);
        setUserInput("");
        setMessage("");
        setAnswerSubmitted(false);
    };


    const startGame = () => {
        setGameStarted(true);
        generateRandomNumbers();
    };


    useEffect(() => {
        if (!gameStarted || numbers.length === 0 || showInput) {
            return;
        }


        const timer = setTimeout(() => {
            if (currentIndex < numbers.length - 1) {
                setCurrentIndex((prev) => prev + 1);
            } else {
                setShowInput(true);
            }
        }, 1200);


        return () => clearTimeout(timer);
    }, [gameStarted, numbers, currentIndex, showInput]);


    const reloadComponent = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };
    const handleSubmit = async () => {
        if (answerSubmitted) {
            return;
        }


        if (!isLoggedIn || !user) {
            setMessage("Za spremanje bodova prvo se prijavite u Auth tabu.");
            return;
        }


        const userSum = parseInt(userInput, 10);


        if (Number.isNaN(userSum)) {
            setMessage("Unesite brojčani odgovor.");
            return;
        }


        const isCorrect = userSum === sum;


        try {
            const points = await updateUserScore(user, isCorrect);
            setAnswerSubmitted(true);


            if (isCorrect) {
                setMessage(`Točan odgovor! Osvojili ste ${points} bodova.`);


            } else {
                setMessage(`Netočan odgovor. Izgubili ste ${Math.abs(points)} bodova.`);
            }


            reloadComponent();
        } catch (error: any) {
            setMessage(error.message ?? "Greška pri spremanju bodova.");
        }
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            {!gameStarted ? (
                <GameActionButton title="Započni igricu" onPress={startGame} />
            ) : !showInput ? (
                <NumberDisplay value={numbers[currentIndex]} />
            ) : (
                <View style={styles.resultContainer}>
                    <SumAnswerInput
                        value={userInput}
                        onChangeText={setUserInput}
                        onSubmit={handleSubmit}
                    />


                    {message ? <Text style={styles.message}>{message}</Text> : null}


                    <View style={styles.restartWrapper}>
                        <GameActionButton
                            title="Restart"
                            onPress={generateRandomNumbers}
                            variant="restart"
                        />
                    </View>


                    <Leaderboard key={refreshKey}/>
                </View>
            )}
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: "#eef3f8",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    resultContainer: {
        width: "100%",
        maxWidth: 420,
        backgroundColor: "#ffffff",
        borderRadius: 18,
        padding: 22,
    },
    message: {
        marginTop: 14,
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        textAlign: "center",
    },
    restartWrapper: {
        marginTop: 18,
        alignItems: "center",
    },
});
