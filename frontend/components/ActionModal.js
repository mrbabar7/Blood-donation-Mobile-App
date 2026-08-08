import React from "react";
import { View, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import { AlertTriangle, Trash2, X } from "lucide-react-native";
import AppText from "./AppText";

export default function ActionModal({
  visible,
  title,
  message,
  confirmText = "Confirm",
  confirmColor = "bg-red-600",
  onConfirm,
  onCancel,
  loading = false,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/60 justify-center items-center px-6">
        <View className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl border border-slate-100">
          <View className="flex-row justify-between items-center mb-4">
            <View className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 items-center justify-center">
              <AlertTriangle size={20} color="#dc2626" />
            </View>
            <TouchableOpacity onPress={onCancel} className="p-1">
              <X size={20} color="#94a3b8" />
            </TouchableOpacity>
          </View>

          <AppText variant="black" className="text-slate-900 text-lg mb-2">
            {title}
          </AppText>
          <AppText
            variant="bold"
            className="text-slate-500 text-xs leading-relaxed mb-6"
          >
            {message}
          </AppText>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onCancel}
              disabled={loading}
              className="flex-1 h-12 rounded-2xl bg-slate-100 items-center justify-center"
            >
              <AppText
                variant="bold"
                className="text-slate-600 text-xs uppercase tracking-wider"
              >
                Cancel
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              disabled={loading}
              className={`flex-1 h-12 rounded-2xl items-center justify-center ${confirmColor}`}
            >
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <AppText
                  variant="black"
                  className="text-white text-xs uppercase tracking-wider"
                >
                  {confirmText}
                </AppText>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
