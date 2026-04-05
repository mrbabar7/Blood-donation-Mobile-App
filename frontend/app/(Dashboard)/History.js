import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { Droplet, Calendar, MapPin, ArrowUpRight, ArrowDownLeft, Clock, Bell, Power } from 'lucide-react-native';

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState('donor'); // 'donor' or 'seeker'

  // Fake Data - Aap isse backend API se replace karenge
  const donorHistory = [
    { id: '1', date: '12 March 2026', location: 'DHQ Hospital, Okara', units: '1 Unit', status: 'Completed' },
    { id: '2', date: '05 Jan 2026', location: 'Indus Hospital, Lahore', units: '1 Unit', status: 'Completed' },
  ];

  const seekerHistory = [
    { id: '1', date: '20 Feb 2026', location: 'City Clinic', units: '2 Units', status: 'Fulfilled', urgent: true },
    { id: '2', date: '01 Feb 2026', location: 'General Hospital', units: '1 Unit', status: 'Pending', urgent: false },
  ];

  return (
    <View className="flex-1 bg-gray-50">
      
      {/* --- HEADER --- */}
      <View 
        className="bg-red-800 px-5 flex-row items-center justify-between shadow-lg"
        style={{ height: Platform.OS === 'ios' ? 110 : 90, paddingTop: Platform.OS === 'ios' ? 40 : 25 }}
      >
        <View className="flex-row items-center">
          <Image source={{ uri: "https://res.cloudinary.com/dzghpapmn/image/upload/v1772727345/bg-remove-logo_skwuuz.png" }} className="w-12 h-12" resizeMode="contain" />
          <Text className="text-white text-lg font-black uppercase ml-2">Activity History</Text>
        </View>
        <TouchableOpacity className="p-2 bg-white/10 rounded-full">
          <Clock size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* --- TAB SWITCHER --- */}
      <View className="flex-row bg-white mx-5 mt-6 rounded-2xl p-1 shadow-sm border border-gray-100">
        <TouchableOpacity 
          onPress={() => setActiveTab('donor')}
          className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${activeTab === 'donor' ? 'bg-red-800' : 'bg-transparent'}`}
        >
          <ArrowUpRight size={16} color={activeTab === 'donor' ? 'white' : '#9ca3af'} />
          <Text className={`ml-2 font-bold ${activeTab === 'donor' ? 'white' : 'text-gray-400'}`}>Donated</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveTab('seeker')}
          className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${activeTab === 'seeker' ? 'bg-red-800' : 'bg-transparent'}`}
        >
          <ArrowDownLeft size={16} color={activeTab === 'seeker' ? 'white' : '#9ca3af'} />
          <Text className={`ml-2 font-bold ${activeTab === 'seeker' ? 'white' : 'text-gray-400'}`}>Requested</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        
        {activeTab === 'donor' ? (
          /* --- DONOR LIST --- */
          donorHistory.map((item) => (
            <View key={item.id} className="bg-white p-4 rounded-[25px] mb-4 border border-gray-100 shadow-sm">
              <View className="flex-row justify-between items-center mb-3">
                <View className="bg-green-100 px-3 py-1 rounded-full">
                  <Text className="text-green-700 text-[10px] font-bold uppercase">{item.status}</Text>
                </View>
                <Text className="text-gray-400 text-[11px]">{item.date}</Text>
              </View>
              
              <View className="flex-row items-center">
                <View className="bg-red-50 p-3 rounded-2xl">
                  <Droplet size={20} color="#991b1b" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-gray-800 font-bold text-base">{item.units} Donated</Text>
                  <View className="flex-row items-center mt-1">
                    <MapPin size={12} color="#9ca3af" />
                    <Text className="text-gray-400 text-xs ml-1">{item.location}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          /* --- SEEKER LIST --- */
          seekerHistory.map((item) => (
            <View key={item.id} className="bg-white p-4 rounded-[25px] mb-4 border border-gray-100 shadow-sm">
              <View className="flex-row justify-between items-center mb-3">
                <View className={`${item.status === 'Fulfilled' ? 'bg-blue-100' : 'bg-yellow-100'} px-3 py-1 rounded-full`}>
                  <Text className={`${item.status === 'Fulfilled' ? 'text-blue-700' : 'text-yellow-700'} text-[10px] font-bold uppercase`}>
                    {item.status}
                  </Text>
                </View>
                {item.urgent && (
                  <View className="bg-red-100 px-2 py-1 rounded-md">
                    <Text className="text-red-600 text-[8px] font-black italic">URGENT</Text>
                  </View>
                )}
              </View>
              
              <View className="flex-row items-center">
                <View className="bg-blue-50 p-3 rounded-2xl">
                  <Calendar size={20} color="#1d4ed8" />
                </View>
                <View className="ml-4 flex-1">
                  <Text className="text-gray-800 font-bold text-base">{item.units} Requested</Text>
                  <View className="flex-row items-center mt-1">
                    <MapPin size={12} color="#9ca3af" />
                    <Text className="text-gray-400 text-xs ml-1">{item.location}</Text>
                  </View>
                </View>
                <Text className="text-gray-300 text-[10px]">{item.date}</Text>
              </View>
            </View>
          ))
        )}

        {/* Empty State Logic */}
        {((activeTab === 'donor' && donorHistory.length === 0) || (activeTab === 'seeker' && seekerHistory.length === 0)) && (
          <View className="items-center mt-20">
            <Text className="text-gray-300 font-bold italic">No history found yet.</Text>
          </View>
        )}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}