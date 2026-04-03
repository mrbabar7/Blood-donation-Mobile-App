import { View, Text, TouchableOpacity, Image, Platform, Alert } from 'react-native'; // Alert add kiya
import { Bell, Power } from 'lucide-react-native'; 
import { useRouter, usePathname } from 'expo-router';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname(); 

  const getHeaderTitle = () => {
    if (pathname === '/' || pathname === '/index') return 'Home';
    if (pathname.includes('Request')) return 'Request';
    if (pathname.includes('Profile')) return 'Profile';
    if (pathname.includes('History')) return 'History';
    if (pathname.includes('Setting')) return 'Setting';
    return 'BLOOD DONATION'; 
  };

  const handleLogout = () => {
    // Sirf yahan Alert add kiya hai, baqi design wahi hai
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: () => router.replace("/login") }
      ]
    );
  };

  return (
    <View 
      className="bg-red-800 px-5 flex-row items-center justify-between shadow-lg"
      style={{ 
        height: Platform.OS === 'ios' ? 110 : 90, 
        paddingTop: Platform.OS === 'ios' ? 40 : 25,
      }}
    >
      {/* Left Side: Logo and Dynamic Name */}
      <View className="flex-row items-center">
        <View className="rounded-full">
          <Image
            source={{ uri: "https://res.cloudinary.com/dzghpapmn/image/upload/v1772727345/bg-remove-logo_skwuuz.png" }}
            className="w-14 h-14"
            resizeMode="contain"
          />
        </View>
        
        <View className="ml-3">
          <Text className="text-white text-lg font-black">
            {getHeaderTitle()}
          </Text>
          <View className="h-[2px] w-8 bg-yellow-400 rounded-full" />
        </View>
      </View>

      {/* Right Side: Bell and Logout */}
      <View className="flex-row items-center">
        <TouchableOpacity className="relative p-2 bg-white/10 rounded-full">
          <Bell size={22} color="white" />
          <View className="absolute top-1 right-1 bg-yellow-500 rounded-full w-4 h-4 items-center justify-center border border-red-800">
            <Text className="text-red-900 text-[8px] font-bold">3</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleLogout}
          className="p-2 bg-white/10 rounded-full ml-3"
        >
          <Power size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}