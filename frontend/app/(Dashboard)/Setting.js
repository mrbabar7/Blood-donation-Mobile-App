import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch, Platform, Alert, Image } from 'react-native';
import { 
  User, Lock, Bell, Shield, CircleHelp, LogOut, ChevronRight, 
  Trash2, Moon, Globe, BellOff 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const router = useRouter();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => router.replace("/login") }
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      
      {/* --- HEADER --- */}
      <View 
        className="bg-red-800 px-5 flex-row items-center justify-between shadow-lg"
        style={{ 
          height: Platform.OS === 'ios' ? 110 : 90, 
          paddingTop: Platform.OS === 'ios' ? 40 : 25 
        }}
      >
        <View className="flex-row items-center">
          <Image 
            source={{ uri: "https://res.cloudinary.com/dzghpapmn/image/upload/v1772727345/bg-remove-logo_skwuuz.png" }} 
            className="w-10 h-10" 
            resizeMode="contain" 
          />
          <Text className="text-white text-lg font-black uppercase ml-2 tracking-tighter">Settings</Text>
        </View>
        <TouchableOpacity onPress={handleLogout} className="p-2 bg-white/10 rounded-full">
          <LogOut size={18} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        
        {/* --- ACCOUNT SECTION --- */}
        <Text className="text-gray-400 text-[10px] font-black uppercase mt-8 mb-2 ml-2 tracking-widest">Account Settings</Text>
        <View className="bg-white rounded-[25px] px-4 shadow-sm border border-gray-100">
          
          {/* Personal Info */}
          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-50">
            <View className="flex-row items-center">
              <View className="bg-gray-100 p-2 rounded-xl"><User size={18} color="#991b1b" /></View>
              <Text className="ml-4 text-gray-700 font-semibold text-[15px]">Personal Information</Text>
            </View>
            <ChevronRight size={18} color="#d1d5db" />
          </TouchableOpacity>

          {/* Password */}
          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-50">
            <View className="flex-row items-center">
              <View className="bg-gray-100 p-2 rounded-xl"><Lock size={18} color="#991b1b" /></View>
              <Text className="ml-4 text-gray-700 font-semibold text-[15px]">Update Password</Text>
            </View>
            <ChevronRight size={18} color="#d1d5db" />
          </TouchableOpacity>

          {/* Language */}
          <TouchableOpacity className="flex-row items-center justify-between py-4">
            <View className="flex-row items-center">
              <View className="bg-gray-100 p-2 rounded-xl"><Globe size={18} color="#991b1b" /></View>
              <Text className="ml-4 text-gray-700 font-semibold text-[15px]">Language</Text>
            </View>
            <View className="flex-row items-center">
              <Text className="mr-2 text-gray-400 text-xs">English</Text>
              <ChevronRight size={18} color="#d1d5db" />
            </View>
          </TouchableOpacity>
        </View>

        {/* --- PREFERENCES --- */}
        <Text className="text-gray-400 text-[10px] font-black uppercase mt-6 mb-2 ml-2 tracking-widest">Preferences</Text>
        <View className="bg-white rounded-[25px] px-4 shadow-sm border border-gray-100">
          
          {/* Notifications */}
          <View className="flex-row items-center justify-between py-4 border-b border-gray-50">
            <View className="flex-row items-center">
              <View className="bg-gray-100 p-2 rounded-xl">
                {notificationsEnabled ? <Bell size={18} color="#991b1b" /> : <BellOff size={18} color="#9ca3af" />}
              </View>
              <Text className="ml-4 text-gray-700 font-semibold text-[15px]">Push Notifications</Text>
            </View>
            <Switch 
              value={notificationsEnabled} 
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#d1d5db", true: "#991b1b" }}
            />
          </View>

          {/* Dark Mode */}
          <View className="flex-row items-center justify-between py-4">
            <View className="flex-row items-center">
              <View className="bg-gray-100 p-2 rounded-xl"><Moon size={18} color="#991b1b" /></View>
              <Text className="ml-4 text-gray-700 font-semibold text-[15px]">Dark Mode</Text>
            </View>
            <Switch 
              value={darkMode} 
              onValueChange={setDarkMode}
              trackColor={{ false: "#d1d5db", true: "#991b1b" }}
            />
          </View>
        </View>

        {/* --- SUPPORT --- */}
        <Text className="text-gray-400 text-[10px] font-black uppercase mt-6 mb-2 ml-2 tracking-widest">Support</Text>
        <View className="bg-white rounded-[25px] px-4 shadow-sm border border-gray-100">
          <TouchableOpacity className="flex-row items-center justify-between py-4 border-b border-gray-50">
            <View className="flex-row items-center">
              <View className="bg-gray-100 p-2 rounded-xl"><CircleHelp size={18} color="#991b1b" /></View>
              <Text className="ml-4 text-gray-700 font-semibold text-[15px]">Help Center</Text>
            </View>
            <ChevronRight size={18} color="#d1d5db" />
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center justify-between py-4">
            <View className="flex-row items-center">
              <View className="bg-gray-100 p-2 rounded-xl"><Shield size={18} color="#991b1b" /></View>
              <Text className="ml-4 text-gray-700 font-semibold text-[15px]">Privacy Policy</Text>
            </View>
            <ChevronRight size={18} color="#d1d5db" />
          </TouchableOpacity>
        </View>

        {/* --- DANGER ZONE --- */}
        <TouchableOpacity 
          onPress={() => Alert.alert("Delete", "Are you sure?")}
          className="bg-red-50 flex-row items-center justify-between p-4 rounded-[25px] border border-red-100 mt-8 mb-10"
        >
          <View className="flex-row items-center">
            <View className="bg-red-100 p-2 rounded-xl">
              <Trash2 size={18} color="#dc2626" />
            </View>
            <View className="ml-4">
              <Text className="text-red-800 font-bold text-[14px]">Delete Account</Text>
              <Text className="text-red-400 text-[10px]">Permanent Action</Text>
            </View>
          </View>
          <ChevronRight size={18} color="#fca5a5" />
        </TouchableOpacity>

        <View className="items-center mb-10">
          <Text className="text-gray-300 text-[10px] font-bold uppercase">PakBlood v1.0.4</Text>
        </View>

      </ScrollView>
    </View>
  );
}