import React, { useState } from "react";
import { View, Text, StyleSheet, Modal, Pressable, Alert } from "react-native";
import { useCameraPermissions } from 'expo-camera'; // Use the hook for permissions

export default function GoodUrlWarning({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    // Using the useCameraPermissions hook to get and request permission
    const [permission, requestPermission] = useCameraPermissions();

    // Function to handle granting the camera permission
    const handleGrantPermission = async () => {
        if (!permission?.granted) {
            const { granted } = await requestPermission(); // Request permission
            if (granted) {
                onClose(); // Close the modal if permission is granted
            } else {
                Alert.alert("Permission Denied", "Camera permission is required to proceed.");
            }
        }
    };

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.description}>
                        Allow Fusion to access the camera?
                    </Text>
                    <Pressable style={styles.button} onPress={handleGrantPermission}>
                        <Text style={styles.buttonText}>Always Allow</Text>
                    </Pressable>

                    <Pressable
                        style={styles.button}
                        onPress={() => { }}
                    >
                        <Text style={styles.buttonText}>Don't Allow</Text>
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
        backgroundColor: "#FFFFFF",
        padding: 20,
        borderRadius: 20,
        alignItems: "center",
        width: 300,
    },
    description: {
        color: "black",
        fontSize: 16,
        textAlign: "center",
        marginVertical: 10,
    },
    button: {
        backgroundColor: "#D4D4D6",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        color: "black",
        fontSize: 16,
    },
});