import "../global.css";
import React, { useEffect, useState } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { LocationProvider } from "../context/LocationContext";
import { DonorProvider } from "../context/DonorContext";
function RootLayoutNav() {
  const { isLoading: authLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [loadingWelcome, setLoadingWelcome] = useState(true);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);

  // Check SecureStore on app launch
  useEffect(() => {
    async function checkWelcomeStatus() {
      try {
        const value = await SecureStore.getItemAsync("hasSeenWelcome");
        if (value === "true") {
          setHasSeenWelcome(true);
        }
      } catch (e) {
        console.error("Failed to fetch secure store status", e);
      } finally {
        setLoadingWelcome(false);
      }
    }
    checkWelcomeStatus();
  }, []);

  // Handle routing based on Welcome status
  useEffect(() => {
    if (authLoading || loadingWelcome) return;

    const inWelcomeScreen = segments[0] === "welcome";

    if (!hasSeenWelcome) {
      if (!inWelcomeScreen) {
        router.replace("/welcome");
      }
    } else {
      if (inWelcomeScreen || segments.length === 0) {
        router.replace("/(dashboard)");
      }
    }
  }, [hasSeenWelcome, authLoading, loadingWelcome, segments]);

  // Keep the native splash screen active while checks complete
  if (authLoading || loadingWelcome) {
    return null;
  }

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            contentStyle: { backgroundColor: "white" },
          }}
        >
          <Stack.Screen name="welcome" options={{ gestureEnabled: false }} />
          <Stack.Screen name="(dashboard)" />
          <Stack.Screen name="(authentication)" />
          <Stack.Screen name="(registration)" />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <DonorProvider>
        <LocationProvider>
          <RootLayoutNav />
        </LocationProvider>
      </DonorProvider>
    </AuthProvider>
  );
}
