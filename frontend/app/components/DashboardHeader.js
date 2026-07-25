// components/DashboardHeader.js
import React, { useState } from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import AppText from "../../components/AppText";
import SideDrawer from "./SideDrawer";
import { useAuth } from "../../context/AuthContext";

export default function DashboardHeader() {
  const insets = useSafeAreaInsets();
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useAuth() || {}; // Fallback empty object if hook returns undefined

  // Safe evaluation for user name
  const displayName = user && user.name ? user.name : "Guest";

  return (
    <>
      {/* Set status bar text style to white to pop against our dark red gradient background */}
      <StatusBar style="light" translucent />

      <LinearGradient
        colors={["#991b1b", "#7f1d1d"]} // Rich Red to Crimson Burgundy Gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.headerContainer,
          {
            paddingTop: insets.top + 12,
            paddingBottom: 16,
          },
        ]}
        className="px-5 shadow-lg"
      >
        <View className="w-full flex-row items-center justify-between h-14">
          {/* --- LEFT SIDE: PREMIUM LOGO + WHITE TEXT CONTENT --- */}
          <View className="flex-row items-center">
            {/* White-bordered Premium Logo Wrapper */}
            <View className="bg-white/20 p-1.5 rounded-xl border border-white/30 mr-3">
              <Image
                source={{
                  uri: "https://res.cloudinary.com/dzghpapmn/image/upload/v1772727345/bg-remove-logo_skwuuz.png",
                }}
                className="w-10 h-10"
                resizeMode="contain"
              />
            </View>

            {/* Welcome & Brand Titles stack */}
            <View className="justify-center">
              <AppText
                variant="bold"
                className="text-lg text-white leading-tight font-black uppercase tracking-wide"
              >
                {displayName}
              </AppText>
              <AppText
                variant="regular"
                className="text-xs text-white/80 mt-0.5"
              >
                Welcome Back!
              </AppText>
            </View>
          </View>

          {/* --- RIGHT SIDE: TRANSLUCENT MENU GRID BUTTON --- */}
          <TouchableOpacity
            onPress={() => setMenuVisible(true)}
            activeOpacity={0.7}
            className="w-10 h-10 items-center justify-center rounded-xl bg-white/10 border border-white/10"
          >
            <Ionicons name="grid-outline" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Shared slide-out menu drawer */}
      <SideDrawer visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 10,
  },
});
