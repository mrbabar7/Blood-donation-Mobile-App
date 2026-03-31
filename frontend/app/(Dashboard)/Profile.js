import { View, Text } from 'react-native';
import { User } from 'lucide-react-native';
import Parent from './_Dashboard-Component/Parent';

export default function MyProfile() {
  return (
    <Parent>
      <View className="flex-1 items-center justify-center bg-white">
        <View className="items-center">
          <View className="w-24 h-24 bg-gray-100 rounded-full items-center justify-center border-4 border-red-600">
            <User color="#dc2626" size={50} />
          </View>
          <Text className="text-2xl font-black text-gray-800 mt-4">Hello! 👤</Text>
          <Text className="text-gray-500 font-bold italic">Muhammad Ahmad</Text>
          <Text className="text-red-600 mt-2 font-semibold">Blood Group: B+</Text>
        </View>
      </View>
    </Parent>
  );
}