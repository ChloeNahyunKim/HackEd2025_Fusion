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
import { Link, useRouter } from "expo-router";

export default function Home() {
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const router = useRouter();

    const checkBadQRCodeUrl = (url: string | null) => {
        if (url) {
            return url === "https://www.g00gle.com";
        }
        return false;
    };
    const checkGoodQRCodeUrl = (url: string | null) => {
        if (url) {
            return url === "https://www.canada.ca/";
        }
        return false;
    };

    const checkUnverifiedQRCodeUrl = (url: string | null) => {
        if (url) {
            return url === "https://www.riavashguneetchloe.com";
        }
        return false;
    };

    useEffect(() => {
        if (qrCodeUrl && checkBadQRCodeUrl(qrCodeUrl)) {
            router.push("/(tabs)/suspicious"); // Automatically navigate to the new page
        }
    }, [qrCodeUrl]); // Only run this when qrCodeUrl changes

    useEffect(() => {
        if (qrCodeUrl && checkGoodQRCodeUrl(qrCodeUrl)) {
            router.push("/(tabs)/not_suspicious"); // Automatically navigate to the new page
        }
    }, [qrCodeUrl]); // Only run this when qrCodeUrl changes

    useEffect(() => {
        if (qrCodeUrl && checkUnverifiedQRCodeUrl(qrCodeUrl)) {
            router.push("/(tabs)/unverified"); // Automatically navigate to the new page
        }
    }, [qrCodeUrl]); // Only run this when qrCodeUrl changes

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
                    }
                }}
            />
            {qrCodeUrl && checkBadQRCodeUrl(qrCodeUrl) && (
                <View style={styles.urlContainer}>
                    <Link href="/(tabs)/suspicious" style={styles.urlStyle}>
                    </Link>
                </View>
            )}
            {qrCodeUrl && checkGoodQRCodeUrl(qrCodeUrl) && (
                <View style={styles.urlContainer}>
                    <Link href="/(tabs)/not_suspicious" style={styles.urlStyle}>
                    </Link>
                </View>
            )}
            {qrCodeUrl && checkUnverifiedQRCodeUrl(qrCodeUrl) && (
                <View style={styles.urlContainer}>
                    <Link href="/(tabs)/unverified" style={styles.urlStyle}>
                    </Link>
                </View>
            )}

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