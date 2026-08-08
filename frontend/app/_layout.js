// import "../global.css";
// import React, { useEffect, useState, useRef } from "react";
// import { Stack, useRouter, useSegments } from "expo-router";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { View, Text, Image, Animated, Easing, LogBox } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import * as SecureStore from "expo-secure-store";
// import { AuthProvider, useAuth } from "../context/AuthContext";
// import { LocationProvider } from "../context/LocationContext";
// import { DonorProvider } from "../context/DonorContext";
// import { SocketProvider } from "../context/SocketContext";
// import { AddressProvider } from "../context/AddressContext";

// // Ignore Expo Go push notification warning in SDK 53 dev mode
// LogBox.ignoreLogs([
//   "expo-notifications: Android Push notifications",
//   "Reading from `value` during component render",
// ]);

// // Custom Red Splash Screen Component
// function AppSplashScreen({ progress }) {
//   const widthInterpolate = progress.interpolate({
//     inputRange: [0, 100],
//     outputRange: ["0%", "100%"],
//   });

//   return (
//     <View className="flex-1 bg-red-900 justify-between items-center py-16 px-6">
//       <View className="flex-1 justify-center items-center">
//         {/* Replace with your app logo image path if available */}
//         <View className="w-28 h-28 bg-white/15 rounded-full justify-center items-center mb-4 border border-white/20">
//           <Ionicons name="water" size={60} color="#ffffff" />
//         </View>
//         <Text className="text-white text-2xl font-black tracking-widest uppercase text-center">
//           Blood Donation
//         </Text>
//         <Text className="text-red-200 text-xs mt-1 font-medium tracking-wide">
//           Connecting Life Savers
//         </Text>
//       </View>

//       {/* Progress Bar Container at Bottom */}
//       <View className="w-full max-w-xs items-center">
//         <View className="w-full h-2 bg-red-950/60 rounded-full overflow-hidden mb-2 border border-white/10">
//           <Animated.View
//             style={{ width: widthInterpolate }}
//             className="h-full bg-white rounded-full"
//           />
//         </View>
//       </View>
//     </View>
//   );
// }

// function RootLayoutNav() {
//   const { isLoading: authLoading } = useAuth();
//   const router = useRouter();
//   const segments = useSegments();
//   const [loadingWelcome, setLoadingWelcome] = useState(true);
//   const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
//   const progressAnim = useRef(new Animated.Value(0)).current;

//   // Animate progress bar from 0 to 100 during startup checks
//   useEffect(() => {
//     Animated.timing(progressAnim, {
//       toValue: 90,
//       duration: 1200,
//       easing: Easing.out(Easing.quad),
//       useNativeDriver: false,
//     }).start();
//   }, []);

//   // Check SecureStore status on app launch
//   useEffect(() => {
//     async function checkWelcomeStatus() {
//       try {
//         const value = await SecureStore.getItemAsync("hasSeenWelcome");
//         if (value === "true") {
//           setHasSeenWelcome(true);
//         }
//       } catch (e) {
//         console.error("Failed to fetch secure store status", e);
//       } finally {
//         // Complete progress bar animation before dismissing splash
//         Animated.timing(progressAnim, {
//           toValue: 100,
//           duration: 300,
//           useNativeDriver: false,
//         }).start(() => {
//           setLoadingWelcome(false);
//         });
//       }
//     }
//     checkWelcomeStatus();
//   }, []);

//   // Handle routing only once loading completely finishes
//   useEffect(() => {
//     if (authLoading || loadingWelcome) return;

//     const inWelcomeGroup = segments[0] === "welcome";

//     if (!hasSeenWelcome && !inWelcomeGroup) {
//       router.replace("/welcome");
//     } else if (hasSeenWelcome && inWelcomeGroup) {
//       router.replace("/(dashboard)");
//     }
//   }, [hasSeenWelcome, authLoading, loadingWelcome]);

//   // Show Red Splash Screen during initialization
//   if (authLoading || loadingWelcome) {
//     return <AppSplashScreen progress={progressAnim} />;
//   }

//   return (
//     <SafeAreaProvider style={{ flex: 1, backgroundColor: "white" }}>
//       <View style={{ flex: 1 }}>
//         <Stack
//           screenOptions={{
//             headerShown: false,
//             animation: "slide_from_right",
//             contentStyle: { backgroundColor: "white" },
//           }}
//         >
//           <Stack.Screen name="(dashboard)" />
//           <Stack.Screen name="(authentication)" />
//           <Stack.Screen name="(registration)" />
//           <Stack.Screen name="(manual)" />
//         </Stack>
//       </View>
//     </SafeAreaProvider>
//   );
// }

// export default function Layout() {
//   return (
//     <AuthProvider>
//       <SocketProvider>
//         <AddressProvider>
//           <DonorProvider>
//             <LocationProvider>
//               <RootLayoutNav />
//             </LocationProvider>
//           </DonorProvider>
//         </AddressProvider>
//       </SocketProvider>
//     </AuthProvider>
//   );
// }

import "../global.css";
import React, { useEffect, useState, useRef } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, Text, Animated, Easing, LogBox } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as SecureStore from "expo-secure-store";
import * as Notifications from "expo-notifications";

import { AuthProvider, useAuth } from "../context/AuthContext";
import { LocationProvider } from "../context/LocationContext";
import { DonorProvider } from "../context/DonorContext";
import { SocketProvider } from "../context/SocketContext";
import { AddressProvider } from "../context/AddressContext";
import { registerAndSyncPushToken } from "../services/api/notificationService";

LogBox.ignoreLogs([
  "expo-notifications: Android Push notifications",
  "Reading from `value` during component render",
]);

function AppSplashScreen({ progress }) {
  const widthInterpolate = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View className="flex-1 bg-red-900 justify-between items-center py-16 px-6">
      <View className="flex-1 justify-center items-center">
        <View className="w-28 h-28 bg-white/15 rounded-full justify-center items-center mb-4 border border-white/20">
          <Ionicons name="water" size={60} color="#ffffff" />
        </View>
        <Text className="text-white text-2xl font-black tracking-widest uppercase text-center">
          Blood Donation
        </Text>
        <Text className="text-red-200 text-xs mt-1 font-medium tracking-wide">
          Connecting Life Savers
        </Text>
      </View>

      <View className="w-full max-w-xs items-center">
        <View className="w-full h-2 bg-red-950/60 rounded-full overflow-hidden mb-2 border border-white/10">
          <Animated.View
            style={{ width: widthInterpolate }}
            className="h-full bg-white rounded-full"
          />
        </View>
      </View>
    </View>
  );
}

function RootLayoutNav() {
  const { isLoading: authLoading, token, user } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [loadingWelcome, setLoadingWelcome] = useState(true);
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const progressAnim = useRef(new Animated.Value(0)).current;

  // 1. Initial splash progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 90,
      duration: 1200,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();
  }, []);

  // 2. Read onboard status from SecureStore
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
        Animated.timing(progressAnim, {
          toValue: 100,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          setLoadingWelcome(false);
        });
      }
    }
    checkWelcomeStatus();
  }, []);

  // 3. Register push notifications when authenticated
  useEffect(() => {
    if (token && user) {
      registerAndSyncPushToken(token);
    }
  }, [token, user]);

  // 4. Handle notification tap deep-linking
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response?.notification?.request?.content?.data;
        if (data?.link) {
          router.push(data.link);
        } else if (data?.screen) {
          router.push(`/(dashboard)/${data.screen}`);
        }
      },
    );

    return () => subscription.remove();
  }, []);

  // 5. App navigation guard
  useEffect(() => {
    if (authLoading || loadingWelcome) return;

    const inWelcomeGroup = segments[0] === "welcome";

    if (!hasSeenWelcome && !inWelcomeGroup) {
      router.replace("/welcome");
    } else if (hasSeenWelcome && inWelcomeGroup) {
      router.replace("/(dashboard)");
    }
  }, [hasSeenWelcome, authLoading, loadingWelcome]);

  if (authLoading || loadingWelcome) {
    return <AppSplashScreen progress={progressAnim} />;
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
          <Stack.Screen name="(dashboard)" />
          <Stack.Screen name="(authentication)" />
          <Stack.Screen name="(registration)" />
          <Stack.Screen name="(manual)" />
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AddressProvider>
          <DonorProvider>
            <LocationProvider>
              <RootLayoutNav />
            </LocationProvider>
          </DonorProvider>
        </AddressProvider>
      </SocketProvider>
    </AuthProvider>
  );
}
