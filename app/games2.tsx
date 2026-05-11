import { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserScore } from "@/services/scoreService";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CELL = 20;
const COLS = Math.floor(Math.min(SCREEN_WIDTH - 32, 560) / CELL);
const ROWS = 22;
const GRID_W = COLS * CELL;
const GRID_H = ROWS * CELL;

type Point = { x: number; y: number };
type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

const randFood = (snake: Point[]): Point => {
    let p: Point;
    do { p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
    while (snake.some(s => s.x === p.x && s.y === p.y));
    return p;
};

const DPadButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <TouchableOpacity style={dpadStyles.btn} onPress={onPress} activeOpacity={0.7}>
        <Text style={dpadStyles.arrow}>{label}</Text>
    </TouchableOpacity>
);

export default function Games2Screen() {
    const { user, isLoggedIn } = useAuth();

    const [snake, setSnake] = useState<Point[]>([{ x: 5, y: 10 }]);
    const [food, setFood] = useState<Point>({ x: 15, y: 10 });
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [phase, setPhase] = useState<"idle" | "playing" | "over">("idle");
    const [speed, setSpeed] = useState(140);
    const [message, setMessage] = useState("");
    const [scoreSubmitted, setScoreSubmitted] = useState(false);

    const dirRef = useRef<Dir>("RIGHT");
    const nextDirRef = useRef<Dir>("RIGHT");
    const snakeRef = useRef<Point[]>([{ x: 5, y: 10 }]);
    const foodRef = useRef<Point>({ x: 15, y: 10 });
    const scoreRef = useRef(0);
    const loop = useRef<any>(null);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            const map: Record<string, Dir> = {
                ArrowUp: "UP", ArrowDown: "DOWN",
                ArrowLeft: "LEFT", ArrowRight: "RIGHT",
                w: "UP", s: "DOWN", a: "LEFT", d: "RIGHT",
            };
            const d = map[e.key];
            if (!d) return;
            e.preventDefault();
            const opp: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
            if (opp[d] !== dirRef.current) nextDirRef.current = d;
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, []);

    const startGame = () => {
        const s = [{ x: 5, y: 10 }];
        const f = { x: 15, y: 10 };
        snakeRef.current = s;
        foodRef.current = f;
        dirRef.current = "RIGHT";
        nextDirRef.current = "RIGHT";
        scoreRef.current = 0;
        setSnake(s);
        setFood(f);
        setScore(0);
        setSpeed(140);
        setMessage("");
        setScoreSubmitted(false);
        setPhase("playing");
    };

    const changeDir = (d: Dir) => {
        const opp: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
        if (opp[d] !== dirRef.current) nextDirRef.current = d;
    };

    const submitScore = async (finalScore: number) => {
        if (!isLoggedIn || !user || scoreSubmitted) {
            if (!isLoggedIn) setMessage("Prijavi se za spremanje bodova!");
            return;
        }
        try {
            const points = await updateUserScore(user, finalScore > 0);
            setScoreSubmitted(true);
            setMessage(`Bodovi spremljeni! +${points}`);
        } catch {
            setMessage("Greška pri spremanju bodova.");
        }
    };

    useEffect(() => {
        if (phase !== "playing") return;

        loop.current = setInterval(() => {
            dirRef.current = nextDirRef.current;
            const s = snakeRef.current;
            const f = foodRef.current;
            const h = s[0];
            const d = dirRef.current;

            const moves: Record<Dir, Point> = {
                UP:    { x: h.x,     y: h.y - 1 },
                DOWN:  { x: h.x,     y: h.y + 1 },
                LEFT:  { x: h.x - 1, y: h.y     },
                RIGHT: { x: h.x + 1, y: h.y     },
            };
            const nh = moves[d];

            if (nh.x < 0 || nh.x >= COLS || nh.y < 0 || nh.y >= ROWS || s.some(p => p.x === nh.x && p.y === nh.y)) {
                clearInterval(loop.current);
                const finalScore = scoreRef.current;
                setHighScore(prev => Math.max(prev, finalScore));
                setPhase("over");
                submitScore(finalScore);
                return;
            }

            const ate = nh.x === f.x && nh.y === f.y;
            const ns = ate ? [nh, ...s] : [nh, ...s.slice(0, -1)];

            if (ate) {
                const nf = randFood(ns);
                foodRef.current = nf;
                setFood(nf);
                scoreRef.current += 10;
                setScore(scoreRef.current);
                if (scoreRef.current % 50 === 0) {
                    setSpeed(prev => Math.max(60, prev - 15));
                }
            }

            snakeRef.current = ns;
            setSnake([...ns]);
        }, speed);

        return () => clearInterval(loop.current);
    }, [phase, speed]);

    const getSegmentStyle = (i: number, total: number) => {
        const ratio = i / total;
        const green = Math.floor(255 - ratio * 120);
        return {
            backgroundColor: i === 0 ? "#00ff88" : `rgb(0, ${green}, ${Math.floor(green * 0.5)})`,
            borderRadius: i === 0 ? 8 : 5,
            opacity: i === 0 ? 1 : Math.max(0.4, 1 - ratio * 0.5),
        };
    };

    return (
        <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.scoreBox}>
                        <Text style={styles.scoreLabel}>SCORE</Text>
                        <Text style={styles.scoreValue}>{score}</Text>
                    </View>
                    <Text style={styles.titleEmoji}>🐍</Text>
                    <View style={styles.scoreBox}>
                        <Text style={styles.scoreLabel}>BEST</Text>
                        <Text style={styles.scoreValue}>{highScore}</Text>
                    </View>
                </View>

                {/* Grid */}
                <View style={styles.gridWrapper}>
                    <View style={{ width: GRID_W, height: GRID_H, position: "relative", borderRadius: 12, overflow: "hidden", backgroundColor: "#080f0f" }}>

                        {/* Grid dots */}
                        {Array.from({ length: ROWS }).map((_, row) =>
                            Array.from({ length: COLS }).map((_, col) => (
                                <View key={`${row}-${col}`} style={{
                                    position: "absolute",
                                    left: col * CELL + CELL / 2 - 1,
                                    top: row * CELL + CELL / 2 - 1,
                                    width: 2, height: 2,
                                    borderRadius: 1,
                                    backgroundColor: "rgba(0,255,136,0.06)",
                                }} />
                            ))
                        )}

                        {/* Food */}
                        <View style={[styles.foodGlow, { left: food.x * CELL - 6, top: food.y * CELL - 6, width: CELL + 12, height: CELL + 12 }]} />
                        <View style={[styles.food, { left: food.x * CELL + 3, top: food.y * CELL + 3, width: CELL - 6, height: CELL - 6 }]}>
                            <Text style={{ fontSize: CELL - 8, lineHeight: CELL - 6 }}>🍎</Text>
                        </View>

                        {/* Snake */}
                        {snake.map((s, i) => (
                            <View key={i} style={[
                                styles.segment,
                                getSegmentStyle(i, snake.length),
                                { left: s.x * CELL + 2, top: s.y * CELL + 2, width: CELL - 4, height: CELL - 4 }
                            ]}>
                                {i === 0 && (
                                    <>
                                        <View style={styles.eyeLeft} />
                                        <View style={styles.eyeRight} />
                                    </>
                                )}
                            </View>
                        ))}

                        {/* Overlay */}
                        {phase !== "playing" && (
                            <View style={styles.overlay}>
                                {phase === "idle" ? (
                                    <>
                                        <Text style={{ fontSize: 56 }}>🐍</Text>
                                        <Text style={styles.overlayTitle}>SNAKE</Text>
                                        <Text style={styles.overlayHint}>Strelice / WASD za upravljanje</Text>
                                        <TouchableOpacity style={styles.btn} onPress={startGame}>
                                            <Text style={styles.btnText}>▶  ZAPOČNI</Text>
                                        </TouchableOpacity>
                                    </>
                                ) : (
                                    <>
                                        <Text style={{ fontSize: 52 }}>💀</Text>
                                        <Text style={styles.overlayTitle}>GAME OVER</Text>
                                        <Text style={styles.overlayScore}>{score} bodova</Text>
                                        {score > 0 && score >= highScore && (
                                            <Text style={styles.newRecord}>🏆 Novi rekord!</Text>
                                        )}
                                        {message ? <Text style={styles.msgText}>{message}</Text> : null}
                                        <TouchableOpacity style={styles.btn} onPress={startGame}>
                                            <Text style={styles.btnText}>↺  IGRAJ PONOVO</Text>
                                        </TouchableOpacity>
                                    </>
                                )}
                            </View>
                        )}
                    </View>
                </View>

                {/* D-Pad */}
                <View style={dpadStyles.wrapper}>
                    <View style={dpadStyles.row}>
                        <View style={dpadStyles.spacer} />
                        <DPadButton label="▲" onPress={() => changeDir("UP")} />
                        <View style={dpadStyles.spacer} />
                    </View>
                    <View style={dpadStyles.row}>
                        <DPadButton label="◀" onPress={() => changeDir("LEFT")} />
                        <View style={dpadStyles.center}>
                            <Text style={dpadStyles.centerDot}>●</Text>
                        </View>
                        <DPadButton label="▶" onPress={() => changeDir("RIGHT")} />
                    </View>
                    <View style={dpadStyles.row}>
                        <View style={dpadStyles.spacer} />
                        <DPadButton label="▼" onPress={() => changeDir("DOWN")} />
                        <View style={dpadStyles.spacer} />
                    </View>
                </View>

                <Text style={styles.hint}>⌨️ Strelice ili WASD na tipkovnici</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scroll: { flexGrow: 1, backgroundColor: "#070d0d" },
    container: { flex: 1, backgroundColor: "#070d0d", alignItems: "center", paddingTop: 16, paddingBottom: 24 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: GRID_W, marginBottom: 14 },
    scoreBox: {
        alignItems: "center", backgroundColor: "#0d1a1a",
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12,
        borderWidth: 1, borderColor: "#0a3a2a", minWidth: 85,
    },
    scoreLabel: { fontSize: 10, color: "#2a6a4a", fontWeight: "bold", letterSpacing: 2 },
    scoreValue: { fontSize: 24, color: "#00ff88", fontWeight: "bold" },
    titleEmoji: { fontSize: 40 },
    gridWrapper: {
        borderRadius: 14, borderWidth: 2, borderColor: "#0a3a2a",
        shadowColor: "#00ff88", shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4, shadowRadius: 24, elevation: 12,
    },
    segment: { position: "absolute" },
    eyeLeft: { position: "absolute", width: 4, height: 4, borderRadius: 2, backgroundColor: "#000", top: 3, left: 3 },
    eyeRight: { position: "absolute", width: 4, height: 4, borderRadius: 2, backgroundColor: "#000", top: 3, right: 3 },
    foodGlow: { position: "absolute", backgroundColor: "rgba(255,60,60,0.15)", borderRadius: 50 },
    food: { position: "absolute", justifyContent: "center", alignItems: "center" },
    overlay: {
        ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.9)",
        justifyContent: "center", alignItems: "center", gap: 14, borderRadius: 12,
    },
    overlayTitle: { fontSize: 38, fontWeight: "bold", color: "#00ff88", letterSpacing: 5 },
    overlayHint: { fontSize: 13, color: "#2a6a4a", textAlign: "center" },
    overlayScore: { fontSize: 26, color: "#ffffff", fontWeight: "bold" },
    newRecord: { fontSize: 18, color: "#fbbf24", fontWeight: "bold" },
    msgText: { fontSize: 14, color: "#00ff88", textAlign: "center", paddingHorizontal: 20 },
    btn: {
        backgroundColor: "#00ff88", paddingHorizontal: 40, paddingVertical: 14,
        borderRadius: 14, marginTop: 8,
    },
    btnText: { color: "#070d0d", fontSize: 16, fontWeight: "bold", letterSpacing: 2 },
    hint: { marginTop: 14, fontSize: 12, color: "#1a4a2a" },
});

const dpadStyles = StyleSheet.create({
    wrapper: { marginTop: 24, alignItems: "center", gap: 0 },
    row: { flexDirection: "row", alignItems: "center" },
    spacer: { width: 70 },
    btn: {
        width: 70, height: 70,
        backgroundColor: "#0d1a1a",
        borderWidth: 1, borderColor: "#0a3a2a",
        justifyContent: "center", alignItems: "center",
        borderRadius: 8,
    },
    arrow: { fontSize: 28, color: "#00ff88" },
    center: {
        width: 70, height: 70,
        backgroundColor: "#0a1414",
        borderWidth: 1, borderColor: "#0a3a2a",
        justifyContent: "center", alignItems: "center",
    },
    centerDot: { color: "#0a3a2a", fontSize: 20 },
});