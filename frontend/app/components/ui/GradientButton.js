import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AuthText from "../AuthText";

export default function GradientButton({
  title,
  onPress,
  disabled,
  icon: Icon,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      className="w-full h-16 rounded-[30px] overflow-hidden shadow-lg shadow-red-300/50 mb-4"
    >
      <LinearGradient
        colors={["#dc2626", "#991b1b"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="w-full h-full flex-row items-center justify-center px-6"
      >
        <Text className="text-white text-base tracking-widest uppercase">
          {title}
        </Text>
        {Icon && (
          <View className="ml-2">
            <Icon size={20} color="#ffffff" />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}
