import React from "react";
import { View, Text, StyleSheet, Modal, Pressable, Linking } from "react-native";
import { useRouter } from "expo-router";
import { Link } from "expo-router";

export default function GoodUrlWarning({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const router = useRouter();

    // List of random URLs to redirect to
    const randomUrls = [
        "https://www.example.com",
        "https://www.random.com",
        "https://www.test.com",
    ];

    // Function to pick a random URL and navigate to it
    const redirectToRandomUrl = async () => {
        const randomUrl = randomUrls[Math.floor(Math.random() * randomUrls.length)];
        await Linking.openURL(randomUrl); // Open external URL
        onClose(); // Close the modal after redirecting
    };
    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Secure Access</Text>
                    <Text style={styles.description}>
                        This site is secure and protects your information—you can proceed safely.
                    </Text>
                    <Pressable style={styles.button} onPress={redirectToRandomUrl}>
                        <Text style={styles.buttonText}>Proceed</Text>
                    </Pressable>

                    {/* Go to Camera Button with Link */}
                    <Pressable
                        style={styles.button}
                        onPress={() => {
                            onClose(); // Close the modal first
                        }}
                    >
                        <Link href="/(tabs)/camera">
                            <Text style={styles.buttonText}>Go to Camera</Text>
                        </Link>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        backgroundColor: "#00BF63",
        padding: 20,
        borderRadius: 20,
        alignItems: "center",
        width: 300,
    },
    title: {
        color: "white",
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 10,
    },
    description: {
        color: "white",
        fontSize: 16,
        textAlign: "center",
        marginVertical: 10,
    },
    button: {
        backgroundColor: "white",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        color: "black",
        fontSize: 16,
        fontWeight: "bold",
    },
});