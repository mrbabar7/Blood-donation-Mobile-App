import "../global.css";
import "react-native-gesture-handler";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(Dashboard)" />

          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="forgotpassword" />
          <Stack.Screen name="verifyotp" />
          <Stack.Screen name="(Landing-Page)/About" />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
