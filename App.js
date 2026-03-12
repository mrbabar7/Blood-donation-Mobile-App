import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";
import "./global.css";
export default function App() {
  return (
    // 'flex-1' replaces 'flex: 1'
    // 'items-center justify-center' replaces the alignment styles
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-bold text-red-600">
        Blood Donation App
      </Text>
      <Text className="text-gray-500 mt-2">Tailwind is now working!</Text>
      <StatusBar style="auto" />
    </View>
  );
}
