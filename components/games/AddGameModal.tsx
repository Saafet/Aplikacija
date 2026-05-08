import { Modal, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type AddGameModalProps = {
    visible: boolean;
    title: string;
    description: string;
    imageUrl: string;
    route: string;
    onChangeTitle: (value: string) => void;
    onChangeDescription: (value: string) => void;
    onChangeImageUrl: (value: string) => void;
    onChangeRoute: (value: string) => void;
    onClose: () => void;
    onSubmit: () => void;
};

export default function AddGameModal({
                                         visible,
                                         title,
                                         description,
                                         imageUrl,
                                         route,
                                         onChangeTitle,
                                         onChangeDescription,
                                         onChangeImageUrl,
                                         onChangeRoute,
                                         onClose,
                                         onSubmit,
                                     }: AddGameModalProps) {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.backdrop}>
                <View style={styles.content}>
                    <Text style={styles.modalTitle}>Dodaj igru</Text>

                    <TextInput
                        placeholder="Naslov igre"
                        value={title}
                        onChangeText={onChangeTitle}
                        style={styles.input}
                    />

                    <TextInput
                        placeholder="Opis igre"
                        value={description}
                        onChangeText={onChangeDescription}
                        style={[styles.input, styles.textArea]}
                        multiline
                    />

                    <TextInput
                        placeholder="URL slike"
                        value={imageUrl}
                        onChangeText={onChangeImageUrl}
                        style={styles.input}
                        autoCapitalize="none"
                    />

                    <TextInput
                        placeholder="Route igre, npr. /game-one"
                        value={route}
                        onChangeText={onChangeRoute}
                        style={styles.input}
                        autoCapitalize="none"
                    />

                    <Pressable style={styles.primaryButton} onPress={onSubmit}>
                        <Text style={styles.primaryButtonText}>Dodaj</Text>
                    </Pressable>

                    <Pressable style={styles.secondaryButton} onPress={onClose}>
                        <Text style={styles.secondaryButtonText}>Zatvori</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.45)",
        padding: 20,
    },
    content: {
        width: "100%",
        maxWidth: 420,
        backgroundColor: "#ffffff",
        borderRadius: 18,
        padding: 22,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111827",
        marginBottom: 14,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginBottom: 12,
        backgroundColor: "#ffffff",
        color: "#111827",
    },
    textArea: {
        minHeight: 96,
        textAlignVertical: "top",
    },
    primaryButton: {
        backgroundColor: "#2563EB",
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
        backgroundColor: "#ffffff",
        borderWidth: 1,
        borderColor: "#cbd5e1",
        paddingVertical: 13,
        borderRadius: 12,
        alignItems: "center",
        marginTop: 10,
    },
    secondaryButtonText: {
        color: "#111827",
        fontWeight: "600",
    },
});
