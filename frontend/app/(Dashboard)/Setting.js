import { View, Text } from 'react-native';
import Parent from './_Dashboard-Component/Parent';

export default function AccountSettings() {
  return (
    <Parent>
      <View className="flex-1 items-center justify-center bg-gray-50">
        <View className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
          <Text className="text-2xl font-black text-gray-800 text-center">Hello! ⚙️</Text>
          <Text className="text-gray-500 mt-2 text-center">App ki settings aur notifications manage karein.</Text>
        </View>
      </View>
    </Parent>
  );
}