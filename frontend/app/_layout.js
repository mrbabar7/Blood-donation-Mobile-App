// import "../global.css";
// import { Stack, usePathname } from "expo-router";
// import { SafeAreaProvider } from "react-native-safe-area-context";
// import { View } from "react-native";
// import Header from "../components/Header";

// export default function Layout() {
//   const pathname = usePathname();

//   // Define screens where the header should NOT appear
//   // Usually splash (index) and auth screens (login/signup)
//   // shouldn't show the main app header.
//   const hiddenRoutes = ["/", "/index"];

//   const hideHeader = hiddenRoutes.includes(pathname);

//   return (
//     <SafeAreaProvider>
//       <View style={{ flex: 1, backgroundColor: "white" }}>
//         {/* The Header only renders if we aren't on a hidden route */}
//         {!hideHeader && <Header />}

//         <Stack
//           screenOptions={{
//             headerShown: false,
//             animation: "slide_from_right",
//             contentStyle: { backgroundColor: "white" },
//           }}
//         >
//           <Stack.Screen name="index" />
//           <Stack.Screen name="home" />
//           <Stack.Screen name="donor-results" />

//           {/* Remove the folder names in parentheses from the 'name' prop */}
//           <Stack.Screen name="login" />
//           <Stack.Screen name="signup" />
//           <Stack.Screen name="forgotpassword" />
//           <Stack.Screen name="verifyotp" />
//           <Stack.Screen name="about" />
//           <Stack.Screen name="emergency" />
//           <Stack.Screen name="contact" />
//         </Stack>
//       </View>
//     </SafeAreaProvider>
//   );
// }
import "../global.css";
import { useEffect } from "react";
import { Stack, usePathname, useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View } from "react-native";
import Header from "../components/Header";
import { AuthProvider, useAuth } from "../context/AuthContext";
import SplashScreen from "./index"; // Your animated splash component

// function RootLayoutNav() {
//   const { isLoading, user } = useAuth();
//   console.log("Auth State:", isLoading, user);
//   const pathname = usePathname();

//   if (isLoading) {
//     return <SplashScreen />;
//   }

//   // Routes where the Global Header should not appear
//   const hiddenRoutes = ["/", "/index"];
//   const hideHeader = hiddenRoutes.includes(pathname);

//   return (
//     <SafeAreaProvider>
//       <View style={{ flex: 1, backgroundColor: "white" }}>
//         {!hideHeader && <Header />}

//         <Stack
//           screenOptions={{
//             headerShown: false,
//             animation: "slide_from_right",
//             contentStyle: { backgroundColor: "white" },
//           }}
//         >
//           {!user ? (
//             // PUBLIC STACK: User is redirected here if auth fails or token is missing
//             <>
//               <Stack.Screen name="home" />
//               <Stack.Screen name="login" />
//               <Stack.Screen name="signup" />
//               <Stack.Screen name="verifyotp" />
//               <Stack.Screen name="donor-results" />
//               <Stack.Screen name="forgotpassword" />
//               <Stack.Screen name="about" />
//               <Stack.Screen name="emergency" />
//               <Stack.Screen name="contact" />
//             </>
//           ) : (
//             <>
//               <Stack.Screen name="dashboard" />
//             </>
//           )}
//         </Stack>
//       </View>
//     </SafeAreaProvider>
//   );
// }

// export default function Layout() {
//   return (
//     <AuthProvider>
//       <RootLayoutNav />
//     </AuthProvider>
//   );
// }
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

  const hiddenRoutes = ["/", "/index", "/login", "/signup", "/verifyotp"];
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
              <Stack.Screen name="home" />
              <Stack.Screen name="donor-results" />
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
