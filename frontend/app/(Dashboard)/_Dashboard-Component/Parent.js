import { View } from "react-native";
import Header from "./Header";
export default function Parent({ children }) {
  return (
    <View className="flex-1 bg-gray-50">
      <Header />

      <View className="flex-1">{children}</View>
    </View>
  );
}
