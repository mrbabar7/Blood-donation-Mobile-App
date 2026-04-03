import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  StatusBar,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotiView, AnimatePresence } from "moti";
import AppText from "./AppText";
import Exact3DRubyDrop from "./Exact3DRubyDrop";

const { width } = Dimensions.get("window");
const MENU_WIDTH = width * 0.75;

const Header = () => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems = [
    { title: "Home", icon: "home-outline", path: "/home" },
    {
      title: "Emergency",
      icon: "alert-circle-outline",
      path: "/(landing-Page)/emergency",
    },
    {
      title: "About Us",
      icon: "help-circle-outline",
      path: "/(landing-Page)/about",
    },
    {
      title: "Contact Us",
      icon: "call-outline",
      path: "/(landing-Page)/contact",
    },
  ];

  const handleNavigation = (path) => {
    setMenuVisible(false);
    router.push(path);
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content" // This makes the time/icons BLACK (perfect for white headers)
        backgroundColor="white" // For Android: makes the bar background match your header
        translucent={false} // Ensures the app content starts BELOW the status bar
      />
      <SafeAreaView className="bg-white shadow-sm border-b border-slate-50">
        <View className="w-full px-5 flex-row items-center justify-between h-20">
          {/* --- LOGO SECTION --- */}
          <View className="flex-row items-end">
            {/* "Bl" */}
            <Text variant="heading" className="text-2xl font-bold text-red-600">
              Bl
            </Text>

            {/* First Droplet (o) */}
            <View style={{ width: 14, height: 20, marginBottom: 4, mx: 1 }}>
              <Exact3DRubyDrop />
            </View>

            {/* Second Droplet (o) */}
            <View style={{ width: 14, height: 20, marginBottom: 4, mx: 1 }}>
              <Exact3DRubyDrop />
            </View>

            {/* "dDonation" */}
            <Text variant="heading" className="text-2xl font-bold text-red-600">
              dDonation
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            activeOpacity={0.7}
            className="w-10 h-10 items-center justify-center rounded-xl bg-slate-50"
          >
            <Ionicons name="grid-outline" size={22} color="#1e293b" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Side Drawer Menu */}
      <AnimatePresence>
        {menuVisible && (
          <View style={StyleSheet.absoluteFill} className="z-50">
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 bg-black/40"
            >
              <Pressable
                className="flex-1"
                onPress={() => setMenuVisible(false)}
              />
            </MotiView>

            <MotiView
              from={{ translateX: MENU_WIDTH }}
              animate={{ translateX: 0 }}
              exit={{ translateX: MENU_WIDTH }}
              transition={{ type: "timing", duration: 300 }}
              style={{ width: MENU_WIDTH }}
              className="absolute right-0 top-0 bottom-0 bg-white shadow-2xl"
            >
              <SafeAreaView className="flex-1">
                <View className="px-6 py-6 flex-row items-center justify-between border-b border-slate-50">
                  <AppText variant="bold" className="text-lg text-slate-800">
                    Menu
                  </AppText>
                  <TouchableOpacity
                    onPress={() => setMenuVisible(false)}
                    className="bg-slate-100 rounded-full p-1"
                  >
                    <Ionicons name="close" size={24} color="#475569" />
                  </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 px-6 pt-4">
                  {menuItems.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleNavigation(item.path)}
                      className="flex-row items-center py-4 mb-2"
                    >
                      <View className="w-10 h-10 bg-red-50 rounded-xl items-center justify-center">
                        <Ionicons name={item.icon} size={20} color="#dc2626" />
                      </View>
                      <AppText
                        variant="medium"
                        className="ml-4 text-slate-700 text-base"
                      >
                        {item.title}
                      </AppText>
                    </TouchableOpacity>
                  ))}

                  <View className="mt-8 gap-y-3">
                    <TouchableOpacity
                      onPress={() => handleNavigation("/login")}
                      className="w-full h-12 bg-slate-900 rounded-xl items-center justify-center"
                    >
                      <AppText className="text-white font-bold">Log In</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleNavigation("/signup")}
                      className="w-full h-12 bg-red-600 rounded-xl items-center justify-center"
                    >
                      <AppText className="text-white font-bold">
                        Create Account
                      </AppText>
                    </TouchableOpacity>
                  </View>

                  <AppText className="text-center text-slate-400 mt-10 text-[10px] uppercase tracking-widest">
                    PakBlood Community • 2026
                  </AppText>
                </ScrollView>
              </SafeAreaView>
            </MotiView>
          </View>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
