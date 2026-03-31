import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { LogOut } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function SideBar(props) {
  const router = useRouter();

  const handleLogout = () => {
    router.replace("/login");
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ flex: 1 }}
      className="bg-red-800"
    >
      <View className="p-5 border-b border-white/10 flex-row items-center">
        <Image
          source={{
            uri: "https://res.cloudinary.com/dzghpapmn/image/upload/v1772727345/bg-remove-logo_skwuuz.png",
          }}
          className="w-12 h-12"
          resizeMode="contain"
        />
        <View className="ml-3">
          <Text className="text-white text-xl font-bold italic">PakBlood</Text>
          <Text className="text-white/60 text-[10px]">Save a Life</Text>
        </View>
      </View>

      <View className="flex-1 mt-4 px-2">
        <DrawerItemList {...props} />
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className="flex-row items-center p-6 border-t border-white/10 mb-5"
      >
        <LogOut color="white" size={22} />
        <Text className="text-white ml-4 font-bold text-lg">Sign Out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}
