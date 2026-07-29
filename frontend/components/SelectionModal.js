// components/SelectionModal.js
import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from "react-native";
import { X, Check } from "lucide-react-native";
import AppText from "./AppText";

export default function SelectionModal({
  visible,
  title,
  data = [],
  selectedValue,
  onSelect,
  onClose,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        className="flex-1 bg-black/60 justify-end"
      >
        <TouchableOpacity
          activeOpacity={1}
          className="bg-white rounded-t-[32px] max-h-[65%] px-6 pt-6 pb-8 shadow-2xl"
        >
          {/* Top Indicator */}
          <View className="w-12 h-1.5 bg-gray-200 rounded-full self-center mb-4" />

          {/* Modal Header */}
          <View className="flex-row justify-between items-center pb-4 border-b border-gray-100 mb-2">
            <AppText variant="black" className="text-xl text-gray-900">
              {title}
            </AppText>
            <TouchableOpacity
              onPress={onClose}
              className="w-9 h-9 bg-gray-100 rounded-full items-center justify-center"
            >
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          {/* Selection Items */}
          <FlatList
            data={data}
            keyExtractor={(item) => item}
            initialNumToRender={12}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = selectedValue === item;
              return (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                  className={`py-4 px-4 border-b border-gray-50 flex-row justify-between items-center rounded-2xl my-1 ${
                    isSelected ? "bg-red-50 border-red-100" : "bg-white"
                  }`}
                >
                  <AppText
                    variant={isSelected ? "bold" : "medium"}
                    className={
                      isSelected
                        ? "text-red-600 text-base"
                        : "text-gray-700 text-base"
                    }
                  >
                    {item}
                  </AppText>
                  {isSelected && <Check size={20} color="#dc2626" />}
                </TouchableOpacity>
              );
            }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
