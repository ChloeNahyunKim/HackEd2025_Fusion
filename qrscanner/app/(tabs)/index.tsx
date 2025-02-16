import { View, Text, StyleSheet, SafeAreaView, Pressable, Linking } from "react-native";
import { Link, Stack } from "expo-router";
import React, { useEffect } from 'react';
import { useCameraPermissions } from "expo-camera";

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);


  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />
      <Text style={styles.title}>QR Code Scanner</Text>
      <View style={{ gap: 20 }}>
        <Pressable onPress={requestPermission}>
          <Text style={styles.buttonStyle}>Request Permissions</Text>
        </Pressable>
        <Link href={"/(tabs)/camera"} asChild>
          <Pressable disabled={!isPermissionGranted}>
            <Text
              style={[
                styles.buttonStyle,
                { opacity: !isPermissionGranted ? 0.5 : 1 },
              ]}
            >
              Scan Code
            </Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
    justifyContent: "space-around",
    paddingVertical: 80,
  },
  buttonStyle: {
    color: "#0E7AFE",
    fontSize: 20,
    textAlign: "center",
  },
  title: {
    color: "white",
    fontSize: 40,
  },
});
