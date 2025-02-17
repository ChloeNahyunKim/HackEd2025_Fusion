import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Linking } from "react-native";
import { useRouter } from "expo-router";
import { Link } from "expo-router";

export default function GoodUrlWarning({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const router = useRouter();

    // List of random URLs to redirect to
    const randomUrls = [
        "www.riavashguneetchloe.com",
        "www.riavashguneetchloe.com",
        "www.riavashguneetchloe.com",
    ];

    const [reportCount, setReportCount] = useState(0);

    // Function to pick a random URL and navigate to it
    const redirectToRandomUrl = async () => {
        const randomUrl = randomUrls[Math.floor(Math.random() * randomUrls.length)];
        await Linking.openURL(randomUrl); // Open external URL
        onClose(); // Close the modal after redirecting
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
                    <Text style={styles.title}>Unverified Site</Text>
                    <Text style={styles.description}>
                        This site is unverified, it may pose security risks.
                    </Text>
                    <Pressable style={styles.button} onPress={redirectToRandomUrl}>
                        <Text style={styles.buttonText}>Proceed</Text>
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
        backgroundColor: "#F1D253",
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