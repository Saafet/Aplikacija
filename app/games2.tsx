import { useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { fetchLeaderboard, updateUserScore } from "@/services/scoreService";
import type { LeaderboardUser } from "@/types/leaderboard";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const CELL = 18;
const COLS = Math.floor(Math.min(SCREEN_WIDTH - 32, 500) / CELL);
const GRID_W = COLS * CELL;
const GRID_H = Math.floor((SCREEN_HEIGHT * 0.45) / CELL) * CELL;
const ROWS = GRID_H / CELL;

type Point = { x: number; y: number };
type Dir = "UP" | "DOWN" | "LEFT" | "RIGHT";

const randFood = (snake: Point[]): Point => {
    let p: Point;
    do { p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
    while (snake.some(s => s.x === p.x && s.y === p.y));
    return p;
};

const MEDALS = ["🥇", "🥈", "🥉"];

const DPadButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <TouchableOpacity style={dpadStyles.btn} onPress={onPress} activeOpacity={0.6}>
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
    const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);

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

    const loadLeaderboard = async () => {
        try {
            const data = await fetchLeaderboard();
            setLeaderboard(data.slice(0, 3));
        } catch {}
    };

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
        setPhase("playing");
    };

    const changeDir = (d: Dir) => {
        const opp: Record<Dir, Dir> = { UP: "DOWN", DOWN: "UP", LEFT: "RIGHT", RIGHT: "LEFT" };
        if (opp[d] !== dirRef.current) nextDirRef.current = d;
    };

    const handleGameOver = async (finalScore: number) => {
        setHighScore(prev => Math.max(prev, finalScore));
        await loadLeaderboard();
        if (isLoggedIn && user && finalScore > 0) {
            try {
                await updateUserScore(user, true);
                await loadLeaderboard();
            } catch {}
        }
        setPhase("over");
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

            if (nh.x < 0 || nh.x >= COLS || nh.y < 0 || nh.y >= ROWS ||
                s.some(p => p.x === nh.x && p.y === nh.y)) {
                clearInterval(loop.current);
                handleGameOver(scoreRef.current);
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

    const getSegmentColor = (i: number, total: number) => {
        const ratio = i / total;
        const g = Math.floor(255 - ratio * 130);
        return i === 0 ? "#00ff88" : `rgb(0,${g},${Math.floor(g * 0.4)})`;
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { width: GRID_W }]}>
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
                <View style={{ width: GRID_W, height: GRID_H, position: "relative", backgroundColor: "#080f0f", borderRadius: 10, overflow: "hidden" }}>
                    {/* Dot grid */}
                    {Array.from({ length: ROWS }).map((_, r) =>
                        Array.from({ length: COLS }).map((_, c) => (
                            <View key={`${r}-${c}`} style={{
                                position: "absolute",
                                left: c * CELL + CELL / 2 - 1,
                                top: r * CELL + CELL / 2 - 1,
                                width: 2, height: 2, borderRadius: 1,
                                backgroundColor: "rgba(0,255,136,0.05)",
                            }} />
                        ))
                    )}

                    {/* Food */}
                    <View style={[styles.foodGlow, { left: food.x * CELL - 5, top: food.y * CELL - 5, width: CELL + 10, height: CELL + 10 }]} />
                    <View style={[styles.food, { left: food.x * CELL + 1, top: food.y * CELL + 1, width: CELL - 2, height: CELL - 2 }]}>
                        <Text style={{ fontSize: CELL - 6 }}>🍎</Text>
                    </View>

                    {/* Snake */}
                    {snake.map((s, i) => (
                        <View key={i} style={{
                            position: "absolute",
                            left: s.x * CELL + 2, top: s.y * CELL + 2,
                            width: CELL - 4, height: CELL - 4,
                            backgroundColor: getSegmentColor(i, snake.length),
                            borderRadius: i === 0 ? 7 : 4,
                            opacity: Math.max(0.4, 1 - (i / snake.length) * 0.5),
                        }}>
                            {i === 0 && (
                                <>
                                    <View style={styles.eyeL} />
                                    <View style={styles.eyeR} />
                                </>
                            )}
                        </View>
                    ))}

                    {/* Overlay */}
                    {phase !== "playing" && (
                        <View style={styles.overlay}>
                            {phase === "idle" ? (
                                <>
                                    <Text style={{ fontSize: 44 }}>🐍</Text>
                                    <Text style={styles.overlayTitle}>SNAKE</Text>
                                    <Text style={styles.overlayHint}>Strelice / WASD</Text>
                                    <TouchableOpacity style={styles.btn} onPress={startGame}>
                                        <Text style={styles.btnText}>▶  ZAPOČNI</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <View style={styles.gameOverContent}>
                                    <Text style={{ fontSize: 40 }}>💀</Text>
                                    <Text style={styles.overlayTitle}>GAME OVER</Text>
                                    <Text style={styles.overlayScore}>{score} bodova</Text>
                                    {score > 0 && score >= highScore && (
                                        <Text style={styles.newRecord}>🏆 Novi rekord!</Text>
                                    )}

                                    {/* Leaderboard */}
                                    {leaderboard.length > 0 && (
                                        <View style={styles.lbBox}>
                                            <Text style={styles.lbTitle}>TOP 3</Text>
                                            {leaderboard.map((u, i) => (
                                                <View key={u.id} style={styles.lbRow}>
                                                    <Text style={styles.lbMedal}>{MEDALS[i]}</Text>
                                                    <Text style={styles.lbName} numberOfLines={1}>
                                                        {u.username.split("@")[0]}
                                                    </Text>
                                                    <Text style={styles.lbScore}>{u.score}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    )}

                                    <TouchableOpacity style={styles.btn} onPress={startGame}>
                                        <Text style={styles.btnText}>↺  IGRAJ PONOVO</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                </View>
            </View>

            {/* D-Pad */}
            <View style={dpadStyles.wrapper}>
                <View style={dpadStyles.row}>
                    <View style={dpadStyles.empty} />
                    <DPadButton label="▲" onPress={() => changeDir("UP")} />
                    <View style={dpadStyles.empty} />
                </View>
                <View style={dpadStyles.row}>
                    <DPadButton label="◀" onPress={() => changeDir("LEFT")} />
                    <View style={dpadStyles.center}><Text style={dpadStyles.dot}>●</Text></View>
                    <DPadButton label="▶" onPress={() => changeDir("RIGHT")} />
                </View>
                <View style={dpadStyles.row}>
                    <View style={dpadStyles.empty} />
                    <DPadButton label="▼" onPress={() => changeDir("DOWN")} />
                    <View style={dpadStyles.empty} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#070d0d", alignItems: "center", paddingTop: 12 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 },
    scoreBox: { alignItems: "center", backgroundColor: "#0d1a1a", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: "#0a3a2a", minWidth: 80 },
    scoreLabel: { fontSize: 9, color: "#2a6a4a", fontWeight: "bold", letterSpacing: 2 },
    scoreValue: { fontSize: 22, color: "#00ff88", fontWeight: "bold" },
    titleEmoji: { fontSize: 32 },
    gridWrapper: { borderRadius: 12, borderWidth: 2, borderColor: "#0a3a2a", shadowColor: "#00ff88", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.35, shadowRadius: 20, elevation: 10 },
    eyeL: { position: "absolute", width: 3, height: 3, borderRadius: 2, backgroundColor: "#000", top: 2, left: 2 },
    eyeR: { position: "absolute", width: 3, height: 3, borderRadius: 2, backgroundColor: "#000", top: 2, right: 2 },
    foodGlow: { position: "absolute", backgroundColor: "rgba(255,60,60,0.15)", borderRadius: 50 },
    food: { position: "absolute", justifyContent: "center", alignItems: "center" },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.92)", justifyContent: "center", alignItems: "center", borderRadius: 10 },
    gameOverContent: { alignItems: "center", gap: 8, width: "90%" },
    overlayTitle: { fontSize: 32, fontWeight: "bold", color: "#00ff88", letterSpacing: 4 },
    overlayHint: { fontSize: 12, color: "#2a6a4a" },
    overlayScore: { fontSize: 22, color: "#fff", fontWeight: "bold" },
    newRecord: { fontSize: 16, color: "#fbbf24", fontWeight: "bold" },
    lbBox: { width: "100%", backgroundColor: "#0d1a1a", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#0a3a2a", marginVertical: 4 },
    lbTitle: { fontSize: 11, color: "#2a6a4a", fontWeight: "bold", letterSpacing: 3, textAlign: "center", marginBottom: 8 },
    lbRow: { flexDirection: "row", alignItems: "center", paddingVertical: 4 },
    lbMedal: { fontSize: 18, width: 28 },
    lbName: { flex: 1, color: "#ccffdd", fontSize: 13 },
    lbScore: { color: "#00ff88", fontWeight: "bold", fontSize: 14 },
    btn: { backgroundColor: "#00ff88", paddingHorizontal: 32, paddingVertical: 12, borderRadius: 12, marginTop: 4 },
    btnText: { color: "#070d0d", fontSize: 14, fontWeight: "bold", letterSpacing: 2 },
});

const dpadStyles = StyleSheet.create({
    wrapper: { marginTop: 16, alignItems: "center" },
    row: { flexDirection: "row" },
    empty: { width: 56, height: 56 },
    btn: { width: 56, height: 56, backgroundColor: "#0d1a1a", borderWidth: 1, borderColor: "#0a3a2a", justifyContent: "center", alignItems: "center", borderRadius: 6 },
    arrow: { fontSize: 22, color: "#00ff88" },
    center: { width: 56, height: 56, backgroundColor: "#080f0f", borderWidth: 1, borderColor: "#0a3a2a", justifyContent: "center", alignItems: "center" },
    dot: { color: "#0a3a2a", fontSize: 16 },
});