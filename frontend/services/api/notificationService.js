import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import Constants from "expo-constants";
import axios from "axios";

// Configure how notifications behave when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token = null;

  // Check execution environment
  const isExpoGo = Constants.executionEnvironment === "storeClient";

  if (isExpoGo) {
    console.warn(
      "⚠️ Running in Expo Go: Hardware push tokens are restricted in SDK 53+. Socket notifications will handle real-time alerts.",
    );
    return null;
  }

  if (Device.isDevice) {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Push notification permission denied by user.");
        return null;
      }

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ||
        Constants?.easConfig?.projectId;

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: projectId || undefined,
        })
      ).data;

      console.log("📲 Registered Expo Push Token:", token);
    } catch (error) {
      console.log("Error fetching push token:", error.message);
    }
  } else {
    console.log("Must use a physical device for Push Notifications.");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

// Function to sync token to backend database
export async function registerAndSyncPushToken(authToken) {
  try {
    const pushToken = await registerForPushNotificationsAsync();
    if (!pushToken || !authToken) return;

    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    await axios.post(
      `${API_URL}/api/users/save-push-token`,
      { pushToken },
      { headers: { Authorization: `Bearer ${authToken}` } },
    );
    console.log("✅ Push Token successfully synced with backend!");
  } catch (err) {
    console.error(
      "Failed to sync push token to server:",
      err?.response?.data || err.message,
    );
  }
}
