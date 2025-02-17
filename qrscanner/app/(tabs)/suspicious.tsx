import React from "react";
import { View, Text, StyleSheet, Modal, Pressable, Linking } from "react-native";
import { Link } from "expo-router";
import { useRouter } from "expo-router";
import { qrCodeUrl } from '../(tabs)'

export default function BadUrlWarning({ visible, onClose }: { visible: boolean; onClose: () => void }) {

    setTimeout(async () => {
        if (typeof qrCodeUrl === "string") {
            await Linking.openURL(qrCodeUrl);
        } else {
            console.error("qrCodeUrl is not a valid string");
            console.log(qrCodeUrl);
        }
    }, 500);

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Safety Warning</Text>
                    <Text style={styles.description}>
                        This site is unsafe and may steal your information—proceed with caution.
                    </Text>
                    <Pressable style={styles.button} onPress={qrCodeUrl}>
                        <Text style={styles.buttonText}>Proceed Anyways</Text>
                    </Pressable>

                    {/* Go to Camera Button with Link */}
                    <Pressable
                        style={styles.button}
                        onPress={() => {
                            onClose(); // Close the modal first
                        }}
                    >
                        <Link href="/tabs/camera">
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