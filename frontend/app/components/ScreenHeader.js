// components/ScreenHeader.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import SideDrawer from "./SideDrawer";

export default function ScreenHeader({ title }) {
  const insets = useSafeAreaInsets();
  const [menuVisible, setMenuVisible] = useState(false);

  // Fallback uppercase formatting
  const formattedTitle = title ? title.toUpperCase() : "PAK BLOOD";

  return (
    <>
      <StatusBar style="light" translucent />

      <LinearGradient
        colors={["#991b1b", "#7f1d1d"]} // Dark red gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.headerContainer,
          {
            paddingTop: insets.top + 12,
            paddingBottom: 16,
          },
        ]}
      >
        <View className="flex-row items-center justify-between w-full px-5">
          {/* Left Side: Dynamic Clean Title from Layout Options */}
          <View className="flex-row items-center">
            <Text className="text-white text-xl font-black tracking-tight uppercase">
              {formattedTitle}
            </Text>
          </View>

          {/* Right Side: Menu Grid Button */}
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
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 10,
  },
});
