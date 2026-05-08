import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import GameActionButton from "@/components/game-one/GameActionButton";
import NumberDisplay from "@/components/game-one/NumberDisplay";
import SumAnswerInput from "@/components/game-one/SumAnswerInput";

export default function GameOneScreen() {
    const [numbers, setNumbers] = useState<number[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [sum, setSum] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [message, setMessage] = useState("");
    const [gameStarted, setGameStarted] = useState(false);

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
        }, 800);

        return () => clearTimeout(timer);
    }, [gameStarted, numbers, currentIndex, showInput]);

    const handleSubmit = () => {
        const userSum = parseInt(userInput, 10);

        if (userSum === sum) {
            setMessage("Točan odgovor, bravo samo tako nastavi!");
        } else {
            setMessage("Netočan odgovor, pokušaj ponovo!");
        }
    };

    return (
        <View style={styles.container}>
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
                </View>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
