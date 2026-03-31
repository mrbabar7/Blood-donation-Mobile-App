import { View, Text } from 'react-native';
import Parent from './_Dashboard-Component/Parent';

export default function Home() {
  return (
    <Parent>
      <View className="flex-1 items-center justify-center bg-white">
        <View className="bg-red-50 p-8 rounded-[40px] border border-red-100 shadow-sm items-center">
          <Text className="text-3xl font-black text-red-600">Hello! 👋</Text>
          <Text className="text-gray-500 mt-2 font-medium text-center">Welcome to PakBlood Dashboard</Text>
        </View>
      </View>
    </Parent>
  );
}