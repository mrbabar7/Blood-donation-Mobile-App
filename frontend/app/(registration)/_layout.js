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
          name="donor-registration"
          options={{ title: "Donor Registration" }}
        />
        <Stack.Screen
          name="ambulances"
          options={{ title: "Ambulance Directory" }}
        />
        <Stack.Screen
          name="hospitals"
          options={{ title: "Hospital Directory" }}
        />
        <Stack.Screen
          name="blood-banks"
          options={{ title: "Blood Bank Directory" }}
        />
        <Stack.Screen name="ngos" options={{ title: "NGO Directory" }} />
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
