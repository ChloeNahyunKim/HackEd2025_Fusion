import { Camera, CameraView } from "expo-camera";
import { Stack } from "expo-router";
import {
    AppState,
    Linking,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet, View, Text, Pressable, Alert
} from "react-native";
import { useEffect, useRef, useState } from "react";

export default function Home() {
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null); // State to store the QR code URL
    const [result, setResult] = useState<string | null>(null); // State to store the result from the backend

    const qrLock = useRef(false);
    const appState = useRef(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", (nextAppState) => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === "active"
            ) {
                qrLock.current = false;
            }
            appState.current = nextAppState;
        });

        return () => {
            subscription.remove();
        };
    }, []);

    // Function to send the QR code URL to the backend
    const sendUrlToBackend = async (url: string) => {
        try {
            const response = await fetch('http://127.0.0.1:5000/check-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url }), // Send the QR code URL in the request body
            });

            const data = await response.json();
            setResult(data.result); // Store the result from the backend
        } catch (error) {
            Alert.alert('Error', 'Unable to check URL');
            console.error(error);
        }
    };

    // Handle QR code scanning
    const handleBarcodeScanned = ({ data }: { data: string }) => {
        if (data && !qrLock.current) {
            qrLock.current = true;
            setQrCodeUrl(data); // Update the QR code URL state
            sendUrlToBackend(data); // Send the URL to the backend
        }
    };

    return (
        <SafeAreaView style={StyleSheet.absoluteFillObject}>
            <Stack.Screen
                options={{
                    title: "Overview",
                    headerShown: false,
                }}
            />
            {Platform.OS === "ios" ? <StatusBar hidden /> : null}
            <CameraView
                style={StyleSheet.absoluteFillObject}
                facing="back"
                onBarcodeScanned={handleBarcodeScanned} // Use the updated handler
            />

            {/* Display the QR code URL and result */}
            {qrCodeUrl && (
                <View style={styles.urlContainer}>
                    <Text style={styles.urlStyle}>Scanned URL: {qrCodeUrl}</Text>
                </View>
            )}
            {result && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultStyle}>Result: {result}</Text>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    urlContainer: {
        position: "absolute",
        bottom: 100, // Adjust position to avoid overlap with the result
        left: 20,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: 10,
        borderRadius: 10,
    },
    urlStyle: {
        color: "white",
        fontSize: 16,
    },
    resultContainer: {
        position: "absolute",
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: 10,
        borderRadius: 10,
    },
    resultStyle: {
        color: "white",
        fontSize: 16,
    },
});