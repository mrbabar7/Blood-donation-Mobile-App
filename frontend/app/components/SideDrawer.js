// components/SideDrawer.js
import React from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Pressable,
  StyleSheet,
  Modal, // 🌟 Standard Native Modal to bypass layer issues
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotiView, AnimatePresence } from "moti";
import AppText from "../../components/AppText"; // Keep your custom AppText component
import { MENU_ITEMS } from "../../constants/menuItems";

const { width } = Dimensions.get("window");
const MENU_WIDTH = width * 0.75;

export default function SideDrawer({ visible, onClose }) {
  const router = useRouter();

  const handleNavigation = (path) => {
    onClose();
    router.push(path);
  };

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
    >
      <AnimatePresence>
        {visible && (
          <View style={StyleSheet.absoluteFill} className="z-50">
            {/* Backdrop blur effect */}
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 bg-black/50"
            >
              <Pressable className="flex-1" onPress={onClose} />
            </MotiView>

            {/* Drawer Menu Sliding from Right */}
            <MotiView
              from={{ translateX: MENU_WIDTH }}
              animate={{ translateX: 0 }}
              exit={{ translateX: MENU_WIDTH }}
              transition={{ type: "timing", duration: 300 }}
              style={{ width: MENU_WIDTH }}
              className="absolute right-0 top-0 bottom-0 bg-white shadow-2xl"
            >
              <SafeAreaView className="flex-1">
                {/* Drawer Header */}
                <View className="px-6 py-6 flex-row items-center justify-between border-b border-slate-100">
                  <AppText variant="bold" className="text-lg text-slate-800">
                    Menu
                  </AppText>
                  <TouchableOpacity
                    onPress={onClose}
                    className="bg-slate-100 rounded-full p-2"
                  >
                    <Ionicons name="close" size={20} color="#475569" />
                  </TouchableOpacity>
                </View>

                {/* Drawer List */}
                <ScrollView className="flex-1 px-6 pt-4">
                  {MENU_ITEMS.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleNavigation(item.path)}
                      className="flex-row items-center py-4 mb-2 border-b border-slate-50"
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

                  {/* Bottom Actions */}
                  <View className="mt-8 gap-y-3">
                    <TouchableOpacity
                      onPress={() =>
                        handleNavigation("/(authentication)/login")
                      }
                      className="w-full h-12 bg-slate-900 rounded-xl items-center justify-center"
                    >
                      <AppText className="text-white font-bold">Log In</AppText>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        handleNavigation("/(authentication)/signup")
                      }
                      className="w-full h-12 bg-red-600 rounded-xl items-center justify-center"
                    >
                      <AppText className="text-white font-bold">
                        Create Account
                      </AppText>
                    </TouchableOpacity>
                  </View>

                  <AppText className="text-center text-slate-400 mt-12 text-[10px] uppercase tracking-widest">
                    PakBlood Community • 2026
                  </AppText>
                </ScrollView>
              </SafeAreaView>
            </MotiView>
          </View>
        )}
      </AnimatePresence>
    </Modal>
  );
}
