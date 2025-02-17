import { View, Text, StyleSheet, SafeAreaView, Pressable } from "react-native";
import { Link, Stack } from "expo-router";
import React, { useEffect, useState } from 'react';
import { useCameraPermissions } from "expo-camera";
import { initializeApp } from 'firebase/app'; // Firebase v9 modular import
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Firestore v9 modular imports

// Firebase configuration (replace with your actual Firebase config)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const firestore = getFirestore(app);

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const isPermissionGranted = Boolean(permission?.granted);
  const [firestoreData, setFirestoreData] = useState<any[]>([]); // State to store Firestore data

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'yourCollection')); // Fetch data from 'yourCollection'
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFirestoreData(data); // Update state with fetched data
        console.log('Firestore data:', data); // Log data to console
      } catch (error) {
        console.error('Error fetching Firestore data:', error);
      }
    };

    fetchData(); // Call the fetch function
  }, []);

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

      {/* Display Firestore Data */}
      <View>
        <Text style={styles.firestoreTitle}>Firestore Data:</Text>
        {firestoreData.map(item => (
          <Text key={item.id} style={styles.firestoreText}>
            {JSON.stringify(item)}
          </Text>
        ))}
      </View>
    </SafeAreaView>
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
  firestoreTitle: {
    color: "white",
    fontSize: 20,
    marginTop: 20,
  },
  firestoreText: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },
});