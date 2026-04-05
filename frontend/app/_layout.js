import "../global.css";
import { useEffect } from "react";
import { Stack, usePathname, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import Header from "../components/Header";
import { AuthProvider, useAuth } from "../context/AuthContext";
import SplashScreen from "./index"; // Your animated splash component
function RootLayoutNav() {
  const { isLoading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter(); // Initialize router

  // --- THE TRAFFIC COP LOGIC ---
  useEffect(() => {
    if (!isLoading) {
      // If we are at the root (splash) and auth is finished
      if (pathname === "/" || pathname === "/index") {
        if (user) {
          router.replace("/dashboard");
        } else {
          router.replace("/home");
        }
      }
    }
  }, [isLoading, user, pathname]);

  if (isLoading) {
    return <SplashScreen />;
  }

  const hiddenRoutes = ["/", "/index", "/dashboard"];
  const hideHeader = hiddenRoutes.includes(pathname);

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: "white" }}>
        {!hideHeader && <Header />}

        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
            contentStyle: { backgroundColor: "white" },
          }}
        >
          {/* Keep index here so the router has a 
             valid target while the redirect fires 
          */}
          <Stack.Screen name="index" />

          {!user ? (
            <>
              <Stack.Screen name="home" />
              <Stack.Screen name="login" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="verifyotp" />
              <Stack.Screen name="donor-results" />
              <Stack.Screen name="forgotpassword" />
              <Stack.Screen name="about" />
              <Stack.Screen name="emergency" />
              <Stack.Screen name="contact" />
            </>
          ) : (
            <>
              <Stack.Screen name="dashboard" />
            </>
          )}
        </Stack>
      </View>
    </SafeAreaProvider>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
