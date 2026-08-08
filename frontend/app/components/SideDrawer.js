import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Pressable,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { MotiView, AnimatePresence } from "moti";
import AppText from "../../components/AppText";
import { MENU_ITEMS } from "../../constants/menuItems";
import { useAuth } from "../../context/AuthContext";

const { width } = Dimensions.get("window");
const MENU_WIDTH = width * 0.8;

export default function SideDrawer({ visible, onClose }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleNavigation = (path) => {
    onClose();
    router.push(path);
  };

  const handlePerformLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      setShowLogoutConfirm(false);
      onClose();
      router.replace("/(dashboard)");
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  // Helper to extract first name initials
  const getUserInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
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
            {/* Dark Backdrop */}
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 bg-black/60"
            >
              <Pressable className="flex-1" onPress={onClose} />
            </MotiView>

            {/* Sliding Drawer Body */}
            <MotiView
              from={{ translateX: MENU_WIDTH }}
              animate={{ translateX: 0 }}
              exit={{ translateX: MENU_WIDTH }}
              transition={{ type: "timing", duration: 280 }}
              style={{ width: MENU_WIDTH }}
              className="absolute right-0 top-0 bottom-0 bg-white shadow-2xl"
            >
              <SafeAreaView className="flex-1">
                {/* Modern Drawer Header Section */}
                <View className="bg-red-900 px-6 pt-6 border-b border-red-800">
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center space-x-2">
                      <Ionicons name="water" size={24} color="#ffffff" />
                      <AppText
                        variant="bold"
                        className="text-white text-base tracking-wider uppercase"
                      >
                        Quick Navigation
                      </AppText>
                    </View>
                    <TouchableOpacity
                      onPress={onClose}
                      activeOpacity={0.8}
                      className="bg-white/15 rounded-full p-2 border border-white/20"
                    >
                      <Ionicons name="close" size={18} color="#ffffff" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Drawer Menu Navigation Options */}
                <ScrollView
                  className="flex-1 px-5 pt-3"
                  showsVerticalScrollIndicator={false}
                >
                  {MENU_ITEMS.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
                      onPress={() => handleNavigation(item.path)}
                      className="flex-row items-center py-3.5 px-3 mb-1.5 rounded-2xl bg-slate-50 border border-slate-100/80 active:bg-red-50"
                    >
                      <View className="w-9 h-9 bg-red-100/80 rounded-xl items-center justify-center mr-3">
                        <Ionicons name={item.icon} size={19} color="#b91c1c" />
                      </View>
                      <AppText
                        variant="medium"
                        className="flex-1 text-slate-800 text-sm font-semibold"
                      >
                        {item.title}
                      </AppText>
                      <Ionicons
                        name="chevron-forward"
                        size={16}
                        color="#cbd5e1"
                      />
                    </TouchableOpacity>
                  ))}

                  {/* Auth Actions Area */}
                  <View className="mt-6 mb-8 pt-4 border-t border-slate-100">
                    {user ? (
                      /* Logout Button when Logged In */
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => setShowLogoutConfirm(true)}
                        className="w-full h-12 bg-red-50 border border-red-200 rounded-2xl flex-row items-center justify-center space-x-2"
                      >
                        <Ionicons
                          name="log-out-outline"
                          size={20}
                          color="#dc2626"
                        />
                        <AppText className="text-red-600 font-bold text-sm">
                          Log Out
                        </AppText>
                      </TouchableOpacity>
                    ) : (
                      /* Login & Signup Buttons when Guest */
                      <View className="flex-col gap-5">
                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() =>
                            handleNavigation("/(authentication)/login")
                          }
                          className="w-full h-12 bg-slate-900 rounded-2xl flex-row items-center justify-center space-x-2 shadow-sm"
                        >
                          <Ionicons
                            name="log-in-outline"
                            size={18}
                            color="#ffffff"
                          />
                          <AppText className="text-white font-bold text-sm">
                            Log In
                          </AppText>
                        </TouchableOpacity>

                        <TouchableOpacity
                          activeOpacity={0.85}
                          onPress={() =>
                            handleNavigation("/(authentication)/signup")
                          }
                          className="w-full h-12 bg-red-600 rounded-2xl flex-row items-center justify-center space-x-2 shadow-sm"
                        >
                          <Ionicons
                            name="person-add-outline"
                            size={18}
                            color="#ffffff"
                          />
                          <AppText className="text-white font-bold text-sm">
                            Create Account
                          </AppText>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  <AppText className="text-center text-slate-400 text-[10px] uppercase tracking-widest pb-6">
                    Blood Donation • v1.0.0
                  </AppText>
                </ScrollView>
              </SafeAreaView>
            </MotiView>
          </View>
        )}
      </AnimatePresence>

      {/* Logout Confirmation Custom Alert Modal */}
      <Modal
        visible={showLogoutConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutConfirm(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="w-full max-w-sm bg-white rounded-3xl p-6 items-center shadow-xl">
            <View className="w-14 h-14 bg-red-100 rounded-full justify-center items-center mb-4">
              <Ionicons name="log-out" size={28} color="#dc2626" />
            </View>

            <AppText className="text-lg font-black text-slate-900 text-center mb-1">
              Log Out of Account?
            </AppText>
            <AppText className="text-xs text-slate-500 text-center leading-5 mb-6">
              You will need to log in again to post urgent blood requests or
              contact registered donors.
            </AppText>

            <View className="flex-row space-x-3 w-full">
              <TouchableOpacity
                disabled={loggingOut}
                onPress={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3.5 bg-slate-100 rounded-2xl items-center"
              >
                <AppText className="text-slate-700 font-bold text-sm">
                  Cancel
                </AppText>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={loggingOut}
                onPress={handlePerformLogout}
                className="flex-1 py-3.5 bg-red-600 rounded-2xl items-center justify-center"
              >
                {loggingOut ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <AppText className="text-white font-bold text-sm">
                    Log Out
                  </AppText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
