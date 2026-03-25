import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppText from "../components/AppText";

export default function Home() {
  return (
    // Use flex-1 here to make sure it fills the screen
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="p-6">
        <AppText variant="heading">Home Screen</AppText>
        <AppText>Now the notch won't hide your text!</AppText>
      </View>
    </SafeAreaView>
  );
}
