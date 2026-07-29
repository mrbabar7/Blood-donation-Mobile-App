import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";

export default function FloatingLabelInput({
  label,
  value,
  onChangeText,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconPress,
  error,
  secureTextEntry,
  keyboardType = "default",
  autoCapitalize = "none",
}) {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || (value && value.length > 0);

  // Determine border and background colors explicitly to prevent dynamic className parser crashes
  const getBorderColor = () => {
    if (error) return "border-red-500 bg-red-50/20";
    if (isFocused) return "border-red-600 bg-white";
    return "border-slate-200 bg-slate-50/50";
  };

  const getLabelColor = () => {
    if (error) return "text-red-500 font-bold";
    if (isFocused) return "text-red-600 font-bold";
    return "text-slate-400 font-medium";
  };

  return (
    <View className="mb-6 relative">
      {/* Floating Label */}
      <View className="absolute left-6 -top-3 z-10 px-2 bg-white rounded-md">
        <Text className={`text-xs ${getLabelColor()}`}>{label}</Text>
      </View>

      {/* Main Input Container */}
      <View
        className={`flex-row items-center border-2 rounded-[30px] px-5 h-16 ${getBorderColor()}`}
      >
        {Icon && (
          <Icon
            size={20}
            color={error ? "#ef4444" : isFocused ? "#dc2626" : "#94a3b8"}
          />
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          className="flex-1 ml-3 font-semibold text-slate-800 text-base"
          selectionColor="#dc2626"
        />

        {RightIcon && (
          <TouchableOpacity onPress={onRightIconPress} activeOpacity={0.7}>
            <RightIcon size={20} color="#94a3b8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Inline Field Error */}
      {error && (
        <Text className="mt-1.5 ml-4 text-xs text-red-500 font-medium">
          {error}
        </Text>
      )}
    </View>
  );
}
