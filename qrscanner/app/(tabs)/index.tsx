import { View, Text, StyleSheet, SafeAreaView, Pressable, Image, Platform } from "react-native";
import { Link, Stack } from "expo-router";
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { useCameraPermissions } from "expo-camera";


export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();

  const isPermissionGranted = Boolean(permission?.granted);

  return (
    <SafeAreaView
      style={styles.titleContainer}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Fusion</ThemedText>
      </ThemedView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 160,
    gap: 8,
    backgroundColor: '#A1CEDC',
  },
});
