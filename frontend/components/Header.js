
import React, { useState } from "react";
import { 
  View, 
  TouchableOpacity, 
  Modal, 
  SafeAreaView, 
  ScrollView,
  Platform,
  Text,
  Dimensions
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from '@expo/vector-icons'; 
import Exact3DRubyDrop from "../components/Exact3DRubyDrop"; 

const { width } = Dimensions.get("window");

const Header = () => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  // Menu items mein se login/signup nikal diye kyunki niche buttons bana rahe hain
  const menuItems = [
    { title: "Home", icon: "home-outline", path: "/",color: "#dc2626" },
    { title: "Emergency Request", icon: "alert-circle-outline", path: "/emergency", color: "#dc2626" },
    { title: "How it Works", icon: "help-circle-outline", path: "/howitworks",color: "#dc2626" },
    { title: "Contact Us", icon: "call-outline", path: "/contact",color: "#dc2626" },
  ];

  const handleNavigation = (path) => {
    setMenuVisible(false);
    router.push(path);
  };

  return (
    <View 
      className="w-full px-5 flex-row items-center justify-between h-20 bg-white shadow-sm"
      style={{ paddingTop: Platform.OS === 'ios' ? 40 : 10 }}
    >
      {/* 1. Left Side: Logo */}
      <View className="flex-row items-center">
        <View style={{ width: 30, height: 40 }}>
           <Exact3DRubyDrop /> 
        </View>
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginLeft: 10, color: '#0f172a' }}>
          Blood<Text style={{ color: '#dc2626' }}>Donation</Text>
        </Text>
      </View>

      {/* 2. Right Side: Menu Button */}
      <TouchableOpacity 
        onPress={() => setMenuVisible(true)}
        className="p-2 rounded-xl bg-slate-100"
      >
        <Ionicons name="menu" size={30} color="black" />
      </TouchableOpacity>

      {/* --- Menu Modal --- */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          {/* Modal Header */}
          <View className="px-6 py-4 flex-row items-center justify-between border-b border-slate-100">
<Text style={{ fontSize: 20, fontWeight: '700', color: '#1e293b' }}>
  Quick Access
</Text>            <TouchableOpacity onPress={() => setMenuVisible(false)} className="p-2">
              <Ionicons name="close" size={32} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView className="px-6 pt-6">
            {/* Links Section */}
            {menuItems.map((item, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => handleNavigation(item.path)}
                className="flex-row items-center py-5 border-b border-slate-50"
              >
                <Ionicons name={item.icon} size={24} color={item.color || "#475569"} />
                <Text style={{ fontSize: 18, marginLeft: 15, color: '#1e293b', fontWeight: '500' }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}

            {/* --- Bottom Buttons (Login & Signup) --- */}
            <View className="mt-10 space-y-4">
              {/* Login Button (Outline style) */}
              <TouchableOpacity 
    onPress={() => handleNavigation("/login")}
    style={{ backgroundColor: '#16a34a' }} // Pure Green
    className="w-full h-14 rounded-2xl items-center justify-center shadow-lg shadow-green-200"
  >
    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
      Log In
    </Text>
  </TouchableOpacity>

              {/* Signup Button (Solid Red style) */}
              <TouchableOpacity 
                onPress={() => handleNavigation("/signup")}
                className="w-full h-14 bg-red-600 rounded-2xl items-center justify-center shadow-lg shadow-red-200"
              >
                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>

            <Text className="text-center text-slate-400 mt-8 text-xs">
    Saving Lives Since 2026

            </Text>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default Header;