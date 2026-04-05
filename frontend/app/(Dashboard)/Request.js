import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Platform, Alert } from 'react-native';
import { Clock, CheckCircle, XCircle, Droplet, MapPin, Star, CheckCheck, Bell, Power } from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';

export default function RequestScreen() {
  const [activeTab, setActiveTab] = useState('Pending');
  const router = useRouter();

  // --- DUMMY DATA ---
  const requests = [
    { id: '1', group: 'A+', units: '2', status: 'Pending', date: '2026-03-25', hospital: 'City Hospital', donor: '' },
    { id: '2', group: 'O-', units: '1', status: 'Accepted', date: '2026-03-22', hospital: 'Red Crescent', donor: 'Bilal Sikandar' },
    { id: '3', group: 'B+', units: '3', status: 'Rejected', date: '2026-03-20', hospital: 'Mayo Hospital', donor: '' },
    { id: '4', group: 'AB+', units: '1', status: 'Completed', date: '2026-03-15', hospital: 'General Hospital', donor: 'Abu Bakar Khan' },
  ];

  const filteredRequests = requests.filter(req => req.status === activeTab);
  const tabs = ['Pending', 'Accepted', 'Rejected', 'Completed'];

  // --- LOGOUT LOGIC ---
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Yes", onPress: () => router.replace("/login") }
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      
      {/* 1. MAIN HEADER (Fixed Top) */}
      <View 
        className="bg-red-800 px-5 flex-row items-center justify-between shadow-lg"
        style={{ height: Platform.OS === 'ios' ? 110 : 90, paddingTop: Platform.OS === 'ios' ? 40 : 25 }}
      >
        <View className="flex-row items-center">
          <Image
            source={{ uri: "https://res.cloudinary.com/dzghpapmn/image/upload/v1772727345/bg-remove-logo_skwuuz.png" }}
            className="w-14 h-14"
            resizeMode="contain"
          />
          <View className="ml-3">
            <Text className="text-white text-lg font-black uppercase">Requests</Text>
            <View className="h-[2px] w-8 bg-yellow-400 rounded-full" />
          </View>
        </View>

        <View className="flex-row items-center">
          <TouchableOpacity className="relative p-2 bg-white/10 rounded-full mr-3">
            <Bell size={22} color="white" />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleLogout} className="p-2 bg-white/10 rounded-full">
            <Power size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. 4 TABS (Directly under Header) */}
      <View className="bg-white px-2 py-3 shadow-sm border-b border-gray-100">
        <View className="flex-row justify-between items-center">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 mx-1 py-2.5 rounded-xl border items-center ${
                activeTab === tab ? 'bg-red-800 border-red-800' : 'bg-gray-50 border-gray-200'
              }`}
            >
              <Text 
                className={`font-bold ${activeTab === tab ? 'text-white' : 'text-gray-500'}`} 
                style={{ fontSize: 10 }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 3. REQUEST LIST (Scrollable) */}
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {filteredRequests.length > 0 ? (
          filteredRequests.map((item) => (
            <View key={item.id} className="bg-white p-5 rounded-[25px] mb-4 shadow-sm border-l-4 border-red-800">
              
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center bg-red-50 px-3 py-1 rounded-lg">
                  <Droplet size={18} color="#991b1b" />
                  <Text className="text-red-800 font-black ml-1 text-lg">{item.group}</Text>
                </View>
                
                <View className="flex-row items-center">
                  {item.status === 'Completed' ? <CheckCheck size={18} color="#1e40af" /> : 
                   item.status === 'Accepted' ? <CheckCircle size={16} color="#10b981" /> :
                   item.status === 'Rejected' ? <XCircle size={16} color="#ef4444" /> : 
                   <Clock size={16} color="#f59e0b" />}
                  <Text className="ml-1 font-bold text-[10px] uppercase text-gray-400">{item.status}</Text>
                </View>
              </View>

              <View className="space-y-2 mb-3">
                <View className="flex-row items-center">
                  <MapPin size={12} color="#6b7280" />
                  <Text className="text-gray-700 ml-2 font-semibold text-[13px]">{item.hospital}</Text>
                </View>
                {item.donor !== '' && (
                  <View className="mt-2 bg-gray-50 p-2 rounded-lg flex-row items-center">
                    <Text className="text-[10px] text-gray-500 font-bold uppercase">Donor: </Text>
                    <Text className="text-[10px] text-red-800 font-bold italic">{item.donor}</Text>
                  </View>
                )}
              </View>

              <View className="mt-2 pt-3 border-t border-gray-50 flex-row justify-between items-center">
                <Text className="text-gray-400 text-[9px] font-bold tracking-tighter">ID: #00{item.id}</Text>
                
                {item.status === 'Completed' ? (
                  <TouchableOpacity className="flex-row items-center bg-yellow-400 px-3 py-2 rounded-xl shadow-sm">
                    <Star size={12} color="#854d0e" fill="#854d0e" />
                    <Text className="text-yellow-900 ml-1 font-black text-[10px]">Rate Donor</Text>
                  </TouchableOpacity>
                ) : (
                  <View className="bg-red-50 px-3 py-1 rounded-full border border-red-100">
                    <Text className="text-red-800 text-[10px] font-bold">{item.units} Units</Text>
                  </View>
                )}
              </View>
            </View>
          ))
        ) : (
          <View className="items-center justify-center py-20">
            <View className="bg-gray-100 p-6 rounded-full mb-4 opacity-50">
              <Droplet size={40} color="#d1d5db" />
            </View>
            <Text className="text-gray-300 font-black italic uppercase">No {activeTab} Requests</Text>
          </View>
        )}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
}