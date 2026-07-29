import React from "react";
import { View, Modal, TouchableOpacity, Text } from "react-native";
import { CheckCircle2, AlertTriangle, XCircle, X } from "lucide-react-native";
import AuthText from "../AuthText";

export default function StatusModal({
  visible,
  type = "error",
  title,
  message,
  onClose,
}) {
  if (!visible) return null;

  const isSuccess = type === "success";

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 items-center justify-center px-6">
        <View className="w-full bg-white rounded-[32px] p-6 items-center shadow-2xl relative">
          <TouchableOpacity
            onPress={onClose}
            className="absolute right-5 top-5 w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
          >
            <X size={18} color="#64748b" />
          </TouchableOpacity>

          <View
            className={`w-16 h-16 rounded-full items-center justify-center mb-4 mt-2 ${
              isSuccess ? "bg-emerald-100" : "bg-red-100"
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 size={36} color="#059669" />
            ) : (
              <AlertTriangle size={36} color="#dc2626" />
            )}
          </View>

          <Text className="text-xl text-slate-900 text-center mb-2">
            {title}
          </Text>

          <Text className="text-sm text-slate-500 text-center mb-6 leading-6">
            {message}
          </Text>

          <TouchableOpacity
            onPress={onClose}
            className={`w-full py-4 rounded-2xl items-center ${
              isSuccess ? "bg-emerald-600" : "bg-red-600"
            }`}
          >
            <Text className="text-white text-base uppercase tracking-wider">
              Continue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
