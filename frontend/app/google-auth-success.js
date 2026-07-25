import { View, ActivityIndicator } from "react-native";

export default function GoogleAuthSuccess() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#dc2626" />
    </View>
  );
}
