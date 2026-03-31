import { View, Text, TouchableOpacity } from 'react-native';
import { Menu, Bell } from 'lucide-react-native';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native'; 

export default function Header() {
  const navigation = useNavigation();


const toggleDrawer = () => {
  try {
    navigation.getParent('drawer')?.openDrawer() || navigation.dispatch(DrawerActions.openDrawer());
    console.log("Drawer open command sent!");
  } catch (error) {
    console.log("Navigation Error:", error);
  }
};

  return (
    <View className="h-24 pt-10 flex-row items-center justify-between px-5 bg-white border-b border-gray-100 shadow-sm">
      <View className="flex-row items-center">
        
        <TouchableOpacity onPress={toggleDrawer}>
          <Menu size={26} color="#374151" />
        </TouchableOpacity>
        
        <View className="w-1 h-6 bg-red-600 mx-3 rounded-full" />
        <Text className="text-lg font-extrabold text-gray-800 tracking-tight">PAKBLOOD</Text>
      </View>
      
      <TouchableOpacity className="relative p-2 bg-gray-50 rounded-full">
         <Bell size={24} color="#374151" />
         <View className="absolute top-1 right-1 bg-red-600 rounded-full w-4 h-4 items-center justify-center border-2 border-white">
            <Text className="text-white text-[8px] font-bold">3</Text>
         </View>
      </TouchableOpacity>
    </View>
  );
}