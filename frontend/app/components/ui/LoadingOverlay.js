import React from "react";
import { View, ActivityIndicator, Modal, Text } from "react-native";
import AuthText from "../AuthText";

export default function LoadingOverlay({
  visible,
  message = "Please wait...",
}) {
  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View className="flex-1 bg-black/50 backdrop-blur-md items-center justify-center px-6">
        <View className="bg-white px-8 py-6 rounded-[28px] items-center shadow-2xl flex-row space-x-4">
          <ActivityIndicator size="large" color="#dc2626" />
          <Text className="text-slate-800 text-base ml-3">{message}</Text>
        </View>
      </View>
    </Modal>
  );
}
