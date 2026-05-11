import { StyleSheet, Text, View } from "react-native";

type HardwareFeatureCardProps = {
    title: string;
    description: string;
    children?: React.ReactNode;
};

export default function HardwareFeatureCard({
                                                title,
                                                description,
                                                children,
                                            }: HardwareFeatureCardProps) {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
            {children ? <View style={styles.content}>{children}</View> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 18,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    title: {
        fontSize: 18,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 6,
    },
    description: {
        fontSize: 14,
        color: "#4b5563",
        lineHeight: 20,
    },
    content: {
        marginTop: 12,
    },
});