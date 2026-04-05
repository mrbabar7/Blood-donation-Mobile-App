import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Platform, TextInput } from 'react-native';
import { Search, Droplet, Users, MapPin, AlertCircle, Bell, Heart } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  // Fake Data for Urgent Requests
  const urgentRequests = [
    { id: '1', name: 'Ali Khan', blood: 'A+', location: 'DHQ Okara', time: '2h ago' },
    { id: '2', name: 'Sana Ahmed', blood: 'O-', location: 'Jinnah Hospital', time: '1h ago' },
    { id: '3', name: 'Zaid Ali', blood: 'B+', location: 'General Hospital', time: '30m ago' },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      
      {/* --- PREMIUM HEADER --- */}
      <View 
        className="bg-red-800 px-6 pb-10 rounded-b-[45px] shadow-2xl"
        style={{ paddingTop: Platform.OS === 'ios' ? 60 : 45 }}
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-red-200 text-xs font-bold uppercase tracking-widest">Welcome Back,</Text>
            <Text className="text-white text-2xl font-black italic">Muhammad Ahmad</Text>
          </View>
          <TouchableOpacity className="bg-white/20 p-2 rounded-2xl border border-white/30 shadow-sm">
            <Bell size={22} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 shadow-md">
          <Search size={20} color="#9ca3af" />
          <TextInput 
            placeholder="Search Donors or Hospitals..." 
            className="flex-1 ml-3 text-gray-800 font-medium"
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        
        {/* --- STATS CARDS --- */}
        <View className="flex-row justify-between -mt-8">
          <View className="bg-white w-[47%] p-5 rounded-[30px] shadow-lg border border-gray-50 items-center">
            <View className="bg-red-50 p-3 rounded-full mb-2">
              <Droplet size={24} color="#991b1b" />
            </View>
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">Your Donates</Text>
            <Text className="text-gray-900 text-xl font-black">04 Units</Text>
          </View>

          <View className="bg-white w-[47%] p-5 rounded-[30px] shadow-lg border border-gray-50 items-center">
            <View className="bg-blue-50 p-3 rounded-full mb-2">
              <Heart size={24} color="#1d4ed8" />
            </View>
            <Text className="text-gray-400 text-[10px] font-bold uppercase tracking-tighter">Lives Saved</Text>
            <Text className="text-gray-900 text-xl font-black">12 People</Text>
          </View>
        </View>

        {/* --- URGENT REQUESTS SECTION --- */}
        <View className="mt-8">
          <View className="flex-row justify-between items-end mb-4 px-1">
            <View>
              <Text className="text-red-900 font-black text-lg uppercase italic">Urgent Requests</Text>
              <View className="h-1 w-12 bg-yellow-400 rounded-full" />
            </View>
            <TouchableOpacity><Text className="text-red-800 font-bold text-xs">See All</Text></TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row py-2">
            {urgentRequests.map((req) => (
              <View key={req.id} className="bg-white w-64 p-5 rounded-[35px] mr-5 border border-red-50 shadow-sm">
                <View className="flex-row justify-between items-start mb-4">
                  <View className="bg-red-800 w-12 h-12 rounded-2xl items-center justify-center shadow-md shadow-red-900">
                    <Text className="text-white font-black text-lg">{req.blood}</Text>
                  </View>
                  <View className="bg-red-50 px-2 py-1 rounded-lg flex-row items-center border border-red-100">
                    <AlertCircle size={10} color="#991b1b" />
                    <Text className="text-red-800 text-[9px] font-black ml-1 uppercase">Critical</Text>
                  </View>
                </View>
                
                <Text className="text-gray-900 font-black text-base">{req.name}</Text>
                <View className="flex-row items-center mt-1 mb-4">
                  <MapPin size={12} color="#9ca3af" />
                  <Text className="text-gray-400 text-xs ml-1 font-medium">{req.location}</Text>
                </View>

                <TouchableOpacity className="bg-gray-900 py-3 rounded-2xl items-center shadow-sm">
                  <Text className="text-white font-bold text-xs uppercase tracking-widest">Donate Now</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* --- QUICK ACTIONS --- */}
        <Text className="text-gray-400 text-[10px] font-black uppercase mt-8 mb-4 ml-2 tracking-widest">Quick Actions</Text>
        
        <View className="flex-row flex-wrap justify-between pb-10">
          <TouchableOpacity className="bg-red-100 w-[48%] p-6 rounded-[30px] mb-4 items-center border border-red-200">
            <View className="bg-white p-3 rounded-2xl mb-2 shadow-sm">
              <Search size={24} color="#991b1b" />
            </View>
            <Text className="text-red-900 font-black text-xs uppercase">Find Donor</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-blue-100 w-[48%] p-6 rounded-[30px] mb-4 items-center border border-blue-200">
            <View className="bg-white p-3 rounded-2xl mb-2 shadow-sm">
              <Droplet size={24} color="#1d4ed8" />
            </View>
            <Text className="text-blue-900 font-black text-xs uppercase">Request Blood</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-emerald-100 w-full p-5 rounded-[30px] flex-row items-center justify-center border border-emerald-200 shadow-sm">
            <View className="bg-white p-2 rounded-xl shadow-sm">
              <MapPin size={20} color="#059669" />
            </View>
            <Text className="text-emerald-900 font-black ml-3 text-sm uppercase tracking-tighter">Nearby Blood Banks</Text>
          </TouchableOpacity>
        </View>

        <View className="h-10" />
      </ScrollView>
    </View>
  );
}