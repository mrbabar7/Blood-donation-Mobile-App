import { View, Text } from 'react-native';
import Parent from './_Dashboard-Component/Parent';

export default function MyRequests() {
  return (
    <Parent>
      <View className="flex-1 items-center justify-center bg-gray-50">
        <View className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <Text className="text-2xl font-black text-red-600 text-center">Hello! 🩸</Text>
          <Text className="text-gray-500 mt-2 text-center font-bold uppercase tracking-widest text-xs">Live Blood Requests</Text>
          <Text className="text-gray-400 mt-4 text-center">Abhi tak koi nayi request nahi aayi.</Text>
        </View>
      </View>
    </Parent>
  );
}