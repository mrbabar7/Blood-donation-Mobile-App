import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Platform, Alert, Switch } from 'react-native';
import { User, Droplet, MapPin, Edit3, Save, Camera, Bell, Power, Hash, Globe, Eye, EyeOff, Trash2, AlertTriangle, PlusCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();
  
  // --- LOGIC STATES ---
  const [isProfileExist, setIsProfileExist] = useState(false); // <--- ISKO FALSE RAKHEIN NAYE USER KE LIYE
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  const [profile, setProfile] = useState({
    name: "Muhammad Ahmad",
    age: "24",
    bloodGroup: "B+",
    city: "Okara",
    province: "Punjab",
  });

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [{ text: "Cancel" }, { text: "Yes", onPress: () => router.replace("/login") }]);
  };

  const handleDeleteProfile = () => {
    Alert.alert("PERMANENT DELETE", "This action CANNOT be undone. Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes, Delete", style: "destructive", onPress: () => router.replace("/login") }
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      
      {/* --- MAIN HEADER --- */}
      <View 
        className="bg-red-800 px-5 flex-row items-center justify-between shadow-lg"
        style={{ height: Platform.OS === 'ios' ? 110 : 90, paddingTop: Platform.OS === 'ios' ? 40 : 25 }}
      >
        <View className="flex-row items-center">
          <Image source={{ uri: "https://res.cloudinary.com/dzghpapmn/image/upload/v1772727345/bg-remove-logo_skwuuz.png" }} className="w-14 h-14" resizeMode="contain" />
          <View className="ml-3">
            <Text className="text-white text-lg font-black uppercase">
              {isProfileExist ? "Profile" : "Setup Profile"}
            </Text>
            <View className="h-[2px] w-8 bg-yellow-400 rounded-full" />
          </View>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity className="p-2 bg-white/10 rounded-full mr-3">
            <Bell size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} className="p-2 bg-white/10 rounded-full">
            <Power size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" showsVerticalScrollIndicator={false}>
        
        {/* Profile Image */}
        <View className="items-center mb-6">
          <View className="relative">
            <View className="w-32 h-32 rounded-full border-4 border-red-800 p-1 bg-white shadow-xl">
              <Image source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' }} className="w-full h-full rounded-full" />
            </View>
            <TouchableOpacity className="absolute bottom-0 right-0 bg-red-800 p-2 rounded-full border-2 border-white shadow-md">
              <Camera size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- VISIBILITY TOGGLE (Wapis Add Kar Diya) --- */}
        <View className="bg-white px-5 py-4 rounded-2xl mb-5 flex-row items-center justify-between border border-gray-100 shadow-sm">
          <View className="flex-row items-center">
            {isPublic ? <Eye size={20} color="#991b1b" /> : <EyeOff size={20} color="#9ca3af" />}
            <Text className="text-gray-800 font-bold text-sm ml-3">Public Profile</Text>
          </View>
          <Switch value={isPublic} onValueChange={setIsPublic} trackColor={{ false: "#d1d5db", true: "#991b1b" }} />
        </View>

        {/* Form Section */}
        <View className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 mb-6">
          
          {/* Fields */}
          {[
            { label: 'Full Name', val: profile.name, key: 'name', icon: <User size={16} color="#9ca3af" /> },
            { label: 'Blood Group', val: profile.bloodGroup, key: 'bloodGroup', icon: <Droplet size={16} color="#991b1b" />, isBlood: true },
            { label: 'Age', val: profile.age, key: 'age', icon: <Hash size={16} color="#9ca3af" />, type: 'numeric' },
            { label: 'City', val: profile.city, key: 'city', icon: <MapPin size={16} color="#9ca3af" /> },
            { label: 'Province', val: profile.province, key: 'province', icon: <Globe size={16} color="#9ca3af" /> },
          ].map((item, i) => (
            <View key={i} className="mb-5">
              <Text className="text-gray-400 text-[10px] font-bold uppercase mb-2 ml-1">{item.label}</Text>
              <View className="flex-row items-center px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100">
                {item.icon}
                <TextInput 
                  className={`flex-1 ml-2 font-semibold ${item.isBlood ? 'text-red-800' : 'text-gray-800'}`} 
                  value={item.val} 
                  editable={!isProfileExist || isEditMode} 
                  keyboardType={item.type || 'default'}
                  onChangeText={(text) => setProfile({...profile, [item.key]: text})}
                />
              </View>
            </View>
          ))}

          {/* MAIN BUTTON LOGIC */}
          {!isProfileExist ? (
            <TouchableOpacity onPress={() => setIsProfileExist(true)} className="bg-red-800 flex-row items-center justify-center py-4 rounded-2xl shadow-lg">
              <PlusCircle size={18} color="white" />
              <Text className="text-white font-bold ml-2 uppercase tracking-tighter">Create Profile</Text>
            </TouchableOpacity>
          ) : !isEditMode ? (
            <TouchableOpacity onPress={() => setIsEditMode(true)} className="bg-red-800 flex-row items-center justify-center py-4 rounded-2xl shadow-lg">
              <Edit3 size={18} color="white" />
              <Text className="text-white font-bold ml-2 uppercase tracking-tighter">Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setIsEditMode(false)} className="bg-emerald-600 flex-row items-center justify-center py-4 rounded-2xl shadow-lg">
              <Save size={18} color="white" />
              <Text className="text-white font-bold ml-2 uppercase tracking-tighter">Save Changes</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* --- DANGER ZONE (Sirf tab jab profile exist kare) --- */}
        {isProfileExist && (
          <View className="mb-10 px-2">
            <View className="flex-row items-center mb-2">
              <AlertTriangle size={14} color="#dc2626" />
              <Text className="text-red-600 font-bold text-[10px] uppercase ml-1">Danger Zone</Text>
            </View>
            <View className="bg-red-50 border border-red-100 p-4 rounded-[25px]">
              <TouchableOpacity onPress={handleDeleteProfile} className="bg-red-600 flex-row items-center justify-center py-3 rounded-xl shadow-sm">
                <Trash2 size={16} color="white" />
                <Text className="text-white font-bold ml-2 uppercase text-[11px]">Delete Permanently</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}