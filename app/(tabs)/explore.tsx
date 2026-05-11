import { useEffect, useState } from "react";
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    Vibration,
    View,
} from "react-native";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { Accelerometer, Magnetometer } from "expo-sensors";
import { Ionicons } from "@expo/vector-icons";

import HardwareFeatureCard from "@/components/hardware/HardwareFeatureCard";
import SensorValueRow from "@/components/hardware/SensorValueRow";

type Vector3 = {
    x: number;
    y: number;
    z: number;
};

export default function ExploreScreen() {
    const [locationText, setLocationText] = useState("Lokacija još nije dohvaćena.");
    const [accelerometerEnabled, setAccelerometerEnabled] = useState(false);
    const [magnetometerEnabled, setMagnetometerEnabled] = useState(false);
    const [accelerometerData, setAccelerometerData] = useState<Vector3>({ x: 0, y: 0, z: 0 });
    const [magnetometerData, setMagnetometerData] = useState<Vector3>({ x: 0, y: 0, z: 0 });
    const [imageUri, setImageUri] = useState<string | null>(null);

    useEffect(() => {
        if (!accelerometerEnabled) {
            return;
        }

        Accelerometer.setUpdateInterval(500);
        const subscription = Accelerometer.addListener((data) => {
            setAccelerometerData(data);
        });

        return () => subscription.remove();
    }, [accelerometerEnabled]);

    useEffect(() => {
        if (!magnetometerEnabled) {
            return;
        }

        Magnetometer.setUpdateInterval(500);
        const subscription = Magnetometer.addListener((data) => {
            setMagnetometerData(data);
        });

        return () => subscription.remove();
    }, [magnetometerEnabled]);

    const getCurrentLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Dozvola odbijena", "Lokacija se ne može dohvatiti bez dozvole.");
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude, accuracy } = location.coords;

        setLocationText(
            `Lat: ${latitude.toFixed(6)}
Lng: ${longitude.toFixed(6)}
Točnost: ${Math.round(accuracy ?? 0)} m`
        );
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Dozvola odbijena", "Kamera se ne može otvoriti bez dozvole.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Dozvola odbijena", "Galerija se ne može otvoriti bez dozvole.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
        }
    };

    const vibrateDevice = () => {
        Vibration.vibrate([300, 150, 300]);
    };

    return (
        <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Ionicons name="hardware-chip-outline" size={42} color="#2563EB" />
                <Text style={styles.title}>Hardware funkcije</Text>
                <Text style={styles.subtitle}>
                    Primjeri rada s mogućnostima uređaja unutar React Native i Expo aplikacije.
                </Text>
            </View>

            <HardwareFeatureCard
                title="GPS i geolokacija"
                description="Dohvaća trenutnu lokaciju uređaja nakon što korisnik odobri dozvolu."
            >
                <Text style={styles.output}>{locationText}</Text>
                <ActionButton title="Dohvati lokaciju" onPress={getCurrentLocation} />
            </HardwareFeatureCard>

            <HardwareFeatureCard
                title="Akcelerometar"
                description="Prati promjene kretanja uređaja po x, y i z osi."
            >
                <SensorValueRow label="x" value={accelerometerData.x} />
                <SensorValueRow label="y" value={accelerometerData.y} />
                <SensorValueRow label="z" value={accelerometerData.z} />
                <ActionButton
                    title={accelerometerEnabled ? "Zaustavi akcelerometar" : "Pokreni akcelerometar"}
                    onPress={() => setAccelerometerEnabled((value) => !value)}
                />
            </HardwareFeatureCard>

            <HardwareFeatureCard
                title="Magnetometar / kompas"
                description="Prikazuje vrijednosti magnetskog polja uređaja. Može se koristiti kao osnova za kompas."
            >
                <SensorValueRow label="x" value={magnetometerData.x} />
                <SensorValueRow label="y" value={magnetometerData.y} />
                <SensorValueRow label="z" value={magnetometerData.z} />
                <ActionButton
                    title={magnetometerEnabled ? "Zaustavi magnetometar" : "Pokreni magnetometar"}
                    onPress={() => setMagnetometerEnabled((value) => !value)}
                />
            </HardwareFeatureCard>

            <HardwareFeatureCard
                title="Kamera i galerija"
                description="Kamera snima novu sliku, a galerija omogućava odabir postojeće slike s uređaja."
            >
                {imageUri ? <Image source={{ uri: imageUri }} style={styles.previewImage} /> : null}
                <View style={styles.buttonRow}>
                    <ActionButton title="Kamera" onPress={takePhoto} compact />
                    <ActionButton title="Galerija" onPress={pickImage} compact />
                </View>
            </HardwareFeatureCard>

            <HardwareFeatureCard
                title="Vibracije"
                description="React Native Vibration API omogućava kratke vibracijske obrasce za upozorenja i povratnu informaciju."
            >
                <ActionButton title="Pokreni vibraciju" onPress={vibrateDevice} />
            </HardwareFeatureCard>

            <HardwareFeatureCard
                title="Napredne funkcije: Bluetooth, NFC, zvuk i IoT"
                description="Bluetooth, NFC, napredni audio i IoT integracije često traže dodatne native module, fizički uređaj i development build. U ovoj vježbi ih prikazujemo kao nastavak teme za naprednije vježbe."
            >
                <Text style={styles.output}>
                    Bluetooth: react-native-ble-plx

                    NFC: react-native-nfc-manager

                    Zvuk/mikrofon: expo-av ili noviji Expo audio paketi

                    IoT: MQTT klijent i povezivanje s brokerom
                </Text>
            </HardwareFeatureCard>
        </ScrollView>
    );
}

function ActionButton({
                          title,
                          onPress,
                          compact = false,
                      }: {
    title: string;
    onPress: () => void;
    compact?: boolean;
}) {
    return (
        <Pressable style={[styles.button, compact && styles.compactButton]} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#eef3f8",
    },
    content: {
        padding: 18,
        paddingBottom: 32,
    },
    header: {
        alignItems: "center",
        marginBottom: 18,
    },
    title: {
        fontSize: 28,
        fontWeight: "800",
        color: "#111827",
        marginTop: 8,
    },
    subtitle: {
        marginTop: 6,
        fontSize: 14,
        color: "#4b5563",
        textAlign: "center",
        lineHeight: 20,
    },
    output: {
        backgroundColor: "#f8fafc",
        borderRadius: 12,
        padding: 12,
        color: "#111827",
        lineHeight: 20,
    },
    button: {
        marginTop: 12,
        backgroundColor: "#2563EB",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        alignItems: "center",
    },
    compactButton: {
        flex: 1,
        marginHorizontal: 4,
    },
    buttonText: {
        color: "#ffffff",
        fontWeight: "700",
    },
    buttonRow: {
        flexDirection: "row",
        marginHorizontal: -4,
    },
    previewImage: {
        width: "100%",
        height: 180,
        borderRadius: 14,
        marginBottom: 10,
        backgroundColor: "#e5e7eb",
    },
});