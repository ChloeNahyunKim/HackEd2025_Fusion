import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Linking, Modal } from "react-native";
import { Link } from "expo-router";

export default function BadUrlWarning({ visible, onClose }: { visible: boolean; onClose: () => void }) {

    // List of random URLs to redirect to
    const randomUrls = [
        "https://www.g00gle.com",
        "https://www.g00gle.com",
        "https://www.g00gle.com",
    ];

    const [reportCount, setReportCount] = useState(1); // Initial report count is 1

    const redirectToRandomUrl = async () => {
        const randomUrl = randomUrls[Math.floor(Math.random() * randomUrls.length)];
        await Linking.openURL(randomUrl);
        onClose();
    };

    const handleReportPress = () => {
        setTimeout(() => {
            setReportCount(reportCount + 1); // Increment report count after 1 second
        }, 1000);
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Safety Warning</Text>
                    <Text style={styles.description}>
                        This site is unsafe and may steal your information—proceed with caution.
                    </Text>
                    <Pressable style={styles.button} onPress={redirectToRandomUrl}>
                        <Text style={styles.buttonText}>Proceed Anyways</Text>
                    </Pressable>

                    {/* Go to Camera Button with Link */}
                    <Pressable
                        style={styles.button}
                        onPress={() => {
                        }}
                    >
                        <Link href="/(tabs)/camera">
                            <Text style={styles.buttonText}>Go to Camera</Text>
                        </Link>
                    </Pressable>

                    <Pressable
                        style={styles.button}
                        onPress={() => {
                            handleReportPress(); // Trigger report with delay
                        }}
                    >
                        <Text style={styles.buttonText}>
                            Report this webpage. Number of reports: {reportCount}
                        </Text>
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
        backgroundColor: "#D9534F",
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