import { View, Text } from 'react-native';
import { UserPlus } from 'lucide-react-native';
import Parent from './_Dashboard-Component/Parent';

export default function Seeker() {
  return (
    <Parent>
      <View className="flex-1 items-center justify-center bg-red-50">
        <View className="bg-white p-10 rounded-[40px] shadow-xl border border-red-100 items-center">
          <View className="bg-red-600 p-4 rounded-full mb-4">
            <UserPlus color="white" size={40} />
          </View>
          <Text className="text-2xl font-black text-gray-800">Hello! 👋</Text>
          <Text className="text-red-600 font-bold mt-1 text-lg">Seeker Request Portal</Text>
          <Text className="text-gray-400 mt-4 text-center italic">"Blood ki zaroorat hai? Request yahan se generate karein."</Text>
        </View>
      </View>
    </Parent>
  );
}