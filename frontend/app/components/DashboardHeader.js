import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import AppText from "../../components/AppText";
import SideDrawer from "./SideDrawer";
import AddressModal from "../../components/AddressModal";
import { useAuth } from "../../context/AuthContext";
import { useDonor } from "../../context/DonorContext";
import { useAddress } from "../../context/AddressContext";

export default function DashboardHeader() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const { user } = useAuth() || {};
  const { isDonor: isDonorRegistered } = useDonor();
  const { primaryAddress, openAddressModal } = useAddress();

  // Pulse Animation logic for Active Donor state
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (user && isDonorRegistered) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    }
  }, [user, isDonorRegistered, pulseAnim]);

  const displayName = user && user.name ? user.name : "Guest User";

  return (
    <>
      <StatusBar style="light" translucent />

      <LinearGradient
        colors={["#991b1b", "#7f1d1d"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[
          styles.headerContainer,
          {
            paddingTop: insets.top + 10,
            paddingBottom: 16,
          },
        ]}
        className="px-5 shadow-lg"
      >
        <View className="w-full flex-row items-center justify-between min-h-[56px]">
          {/* --- LEFT SIDE: USER CONTEXT & DYNAMIC ACTION --- */}
          <View className="justify-center flex-1 mr-2">
            <AppText
              variant="black"
              className="text-lg text-white font-black uppercase tracking-wide mb-1"
              numberOfLines={1}
            >
              {displayName}
            </AppText>

            {/* SCENARIO 1: NOT LOGGED IN */}
            {!user && (
              <TouchableOpacity
                onPress={() => router.push("/(authentication)/login")}
                activeOpacity={0.8}
                className="self-start px-3 py-1 rounded-full border border-white/80 bg-white/10"
              >
                <AppText variant="bold" className="text-xs text-white">
                  Login Now
                </AppText>
              </TouchableOpacity>
            )}

            {/* SCENARIO 2: LOGGED IN BUT NOT A DONOR */}
            {user && !isDonorRegistered && (
              <TouchableOpacity
                onPress={() =>
                  router.push("/(registration)/donor-registration?from=index")
                }
                activeOpacity={0.8}
                className="self-start px-3 py-1 rounded-full border-2 border-white shadow-sm"
              >
                <AppText variant="bold" className="text-xs text-white">
                  Register as Donor
                </AppText>
              </TouchableOpacity>
            )}

            {/* SCENARIO 3: LOGGED IN AND REGISTERED DONOR */}
            {user && isDonorRegistered && (
              <View className="flex-row items-center self-start px-2.5 py-1 rounded-full bg-white/15 border-2 border-white">
                <Animated.View
                  style={{ opacity: pulseAnim }}
                  className="w-2 h-2 rounded-full bg-white mr-1.5"
                />
                <AppText variant="bold" className="text-xs text-white">
                  Active Donor
                </AppText>
              </View>
            )}
          </View>

          {/* --- RIGHT SIDE: ACTION ICONS --- */}
          <View className="flex-row items-center gap-2">
            {/* Help Button */}
            <TouchableOpacity
              onPress={() => router.push("/(manual)/help-center")}
              activeOpacity={0.7}
              className="w-10 h-10 items-center justify-center rounded-xl bg-white/10 border border-white/10"
            >
              <Ionicons name="help-circle-outline" size={22} color="white" />
            </TouchableOpacity>

            {/* Notifications Button */}
            <TouchableOpacity
              onPress={() => router.push("/(manual)/notifications")}
              activeOpacity={0.7}
              className="w-10 h-10 items-center justify-center rounded-xl bg-white/10 border border-white/10 relative"
            >
              <Ionicons name="notifications-outline" size={20} color="white" />
              <View className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400" />
            </TouchableOpacity>

            {/* Side Drawer Grid Button */}
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              activeOpacity={0.7}
              className="w-10 h-10 items-center justify-center rounded-xl bg-white/10 border border-white/10"
            >
              <Ionicons name="grid-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* --- ADDRESS BAR SECTION (LOGGED IN USERS ONLY) --- */}
        {user && (
          <View className="mt-3 pt-3 border-t border-white/20 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-2">
              <Ionicons name="location-sharp" size={16} color="#FECACA" />
              <AppText
                variant="medium"
                className="text-xs text-white/90 ml-1.5 flex-1"
                numberOfLines={1}
              >
                {primaryAddress
                  ? `${primaryAddress.city}, ${primaryAddress.province} (${primaryAddress.addressLine})`
                  : "No location address set"}
              </AppText>
            </View>

            {/* Address Action Button with Transparent BG & White Border */}
            <TouchableOpacity
              onPress={openAddressModal}
              activeOpacity={0.8}
              className="px-3 py-1.5 rounded-lg bg-transparent border border-white flex-row items-center gap-1"
            >
              <Ionicons
                name={primaryAddress ? "create-outline" : "add-circle-outline"}
                size={14}
                color="white"
              />
              <AppText
                variant="bold"
                className="text-xs text-white uppercase tracking-wider"
              >
                {primaryAddress ? "Change Address" : "Add Address"}
              </AppText>
            </TouchableOpacity>
          </View>
        )}
      </LinearGradient>

      {/* Shared Address Management Modal */}
      <AddressModal />

      {/* Side Menu Drawer */}
      <SideDrawer visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 10,
  },
});
