// components/ScreenHeader.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

export default function AuthScreenHeader({ title }) {
  const insets = useSafeAreaInsets();
  const formattedTitle = title ? title.toUpperCase() : "Blood Donation";

  return (
    <>
      <StatusBar style="light" translucent />

      <LinearGradient
        colors={["#991b1b", "#D70040"]} // Dark red gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.headerContainer,
          {
            paddingTop: insets.top + 16,
            paddingBottom: 16,
          },
        ]}
      >
        <View className="items-center">
          <Text className="text-white text-xl font-black tracking-tight uppercase">
            {formattedTitle}
          </Text>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 10,
  },
});
