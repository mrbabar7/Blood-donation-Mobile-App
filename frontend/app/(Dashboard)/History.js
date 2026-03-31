import { View, Text } from 'react-native';
import Parent from "./_Dashboard-Component/Parent"; // ✅ yahan

export default function DonationHistory() {
  return (
    <Parent>
      <View className="flex-1 items-center justify-center bg-white">
        <View className="bg-blue-50 p-8 rounded-3xl border border-blue-100 items-center">
          <Text className="text-2xl font-black text-blue-600">Hello! 📜</Text>
          <Text className="text-gray-500 mt-2 text-center">Aapki purani donations ka record yahan aayega.</Text>
        </View>
      </View>
    </Parent>
  );
}