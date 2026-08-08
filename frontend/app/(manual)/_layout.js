import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import AuthScreenHeader from "../components/AuthScreenHeader";

export default function RegistrationLayout() {
  return (
    <SafeAreaView style={styles.safeContainer} edges={["bottom"]}>
      <Stack
        screenOptions={{
          headerShown: true,
          header: ({ options, route }) => (
            <AuthScreenHeader title={options?.title || route?.name} />
          ),
        }}
      >
        <Stack.Screen
          name="account-settings"
          options={{ title: "Account Settings" }}
        />
        <Stack.Screen name="about" options={{ title: "About Us" }} />
        <Stack.Screen name="contact" options={{ title: "Contact Us" }} />
        <Stack.Screen
          name="notifications"
          options={{ title: "Notifications" }}
        />
        <Stack.Screen
          name="terms"
          options={{ title: "Terms and Conditions" }}
        />
        <Stack.Screen name="privacy" options={{ title: "Privacy Policy" }} />
      </Stack>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "white",
  },
});
