import { View, Text, StyleSheet, SafeAreaView, Pressable, Image } from "react-native";
import { Link, Stack, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useCameraPermissions } from "expo-camera";

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const router = useRouter(); // Router for navigation

  // Check if permission is granted and navigate to the camera page
  useEffect(() => {
    if (isPermissionGranted) {
      const timer = setTimeout(() => {
        router.replace("/(tabs)/camera"); // Navigate to the camera page
      }, 1000); // 1-second delay

      return () => clearTimeout(timer); // Cleanup to prevent memory leaks
    }
  }, [isPermissionGranted]); // Runs when permission changes

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Overview", headerShown: false }} />
      {/* Logo and Title */}
      <View style={styles.logoContainer}>
        <Image source={require("../../assets/images/Qusion_logo.png")} style={styles.logo} />
      </View>

      <View style={{ gap: 20 }}>
        <Pressable onPress={requestPermission}>
          <Text style={styles.buttonStyle}>Request Permissions</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#020f54",
    justifyContent: "space-around",
    paddingVertical: 80,
  },
  logoContainer: {
    flexDirection: "row", // Arrange logo and text side by side
    alignItems: "center",
    gap: 10, // Space between logo and text
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  buttonStyle: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  title: {
    color: "white",
    fontSize: 40,
  },
});