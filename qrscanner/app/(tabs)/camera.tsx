import { Camera, CameraView } from "expo-camera";
import { Stack } from "expo-router";
import {
    AppState,
    Linking,
    Platform,
    SafeAreaView,
    StatusBar,
    StyleSheet, View, Text, Pressable
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Link } from "expo-router";

export default function Home() {
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null); // State to store the QR code URL

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
                onBarcodeScanned={({ data }) => {
                    if (data && !qrLock.current) {
                        qrLock.current = true;
                        setQrCodeUrl(data);

                        /*
                        setTimeout(async () => {
                            await Linking.openURL(data);
                        }, 500);
                        */
                    }
                }}

            />
            <Pressable>
                <Text style={styles.urlStyle}>
                    Scanned QR URL: {qrCodeUrl}
                </Text>
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    urlContainer: {
        position: "absolute",
        bottom: 20,
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
});