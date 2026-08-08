import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
} from "react-native";
import {
  User,
  Bell,
  Shield,
  CircleHelp,
  ChevronRight,
  Globe,
  BellOff,
  MapPin,
} from "lucide-react-native";
import { useRouter } from "expo-router";

// Context & Component Imports
import { useAddress } from "../../context/AddressContext";
import AddressModal from "../../components/AddressModal";

export default function SettingsScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Address Hook
  const { primaryAddress, openAddressModal } = useAddress();

  const formattedAddress = primaryAddress
    ? `${primaryAddress.city}, ${primaryAddress.province} (${primaryAddress.addressLine})`
    : "No location address set";

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* --- ACCOUNT SECTION --- */}
        <Text style={styles.sectionHeader}>Account Settings</Text>
        <View style={styles.card}>
          {/* Personal Info */}
          <TouchableOpacity
            onPress={() => router.push("/(manual)/account-settings")}
            style={[styles.row, styles.borderBottom]}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconContainer}>
                <User size={18} color="#991b1b" />
              </View>
              <Text style={styles.rowLabel}>Personal Information</Text>
            </View>
            <ChevronRight size={18} color="#d1d5db" />
          </TouchableOpacity>

          {/* Address Section */}
          <View style={styles.row}>
            <View style={styles.addressLeft}>
              <View style={styles.iconContainer}>
                <MapPin size={18} color="#991b1b" />
              </View>
              <View style={styles.addressTextWrapper}>
                <Text style={styles.rowLabel}>Saved Address</Text>
                <Text style={styles.addressSubtext} numberOfLines={1}>
                  {formattedAddress}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={openAddressModal}
              activeOpacity={0.8}
              style={styles.addressButton}
            >
              <Text style={styles.addressButtonText}>
                {primaryAddress ? "Change" : "Add"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- PREFERENCES --- */}
        <Text style={styles.sectionHeader}>Preferences</Text>
        <View style={styles.card}>
          {/* Notifications */}
          <View style={[styles.row, styles.borderBottom]}>
            <View style={styles.rowLeft}>
              <View style={styles.iconContainer}>
                {notificationsEnabled ? (
                  <Bell size={18} color="#991b1b" />
                ) : (
                  <BellOff size={18} color="#9ca3af" />
                )}
              </View>
              <Text style={styles.rowLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#d1d5db", true: "#991b1b" }}
            />
          </View>

          {/* Language */}
          <TouchableOpacity style={styles.row} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <View style={styles.iconContainer}>
                <Globe size={18} color="#991b1b" />
              </View>
              <Text style={styles.rowLabel}>Language</Text>
            </View>
            <View style={styles.rowRightValue}>
              <Text style={styles.valueText}>English</Text>
              <ChevronRight size={18} color="#d1d5db" />
            </View>
          </TouchableOpacity>
        </View>

        {/* --- SUPPORT --- */}
        <Text style={styles.sectionHeader}>Support</Text>
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => router.push("/(manual)/help-center")}
            style={[styles.row, styles.borderBottom]}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconContainer}>
                <CircleHelp size={18} color="#991b1b" />
              </View>
              <Text style={styles.rowLabel}>Help Center</Text>
            </View>
            <ChevronRight size={18} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(manual)/terms")}
            style={[styles.row, styles.borderBottom]}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconContainer}>
                <Shield size={18} color="#991b1b" />
              </View>
              <Text style={styles.rowLabel}>Terms & Conditions</Text>
            </View>
            <ChevronRight size={18} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(manual)/privacy")}
            style={styles.row}
            activeOpacity={0.7}
          >
            <View style={styles.rowLeft}>
              <View style={styles.iconContainer}>
                <Shield size={18} color="#991b1b" />
              </View>
              <Text style={styles.rowLabel}>Privacy Policy</Text>
            </View>
            <ChevronRight size={18} color="#d1d5db" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Global Address Management Modal */}
      <AddressModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionHeader: {
    color: "#9ca3af",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 8,
    letterSpacing: 1.5,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 25,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: "#f9fafb",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    backgroundColor: "#f3f4f6",
    padding: 8,
    borderRadius: 12,
  },
  rowLabel: {
    marginLeft: 16,
    color: "#374151",
    fontWeight: "600",
    fontSize: 15,
  },
  addressLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  addressTextWrapper: {
    flex: 1,
  },
  addressSubtext: {
    marginLeft: 16,
    color: "#6b7280",
    fontSize: 12,
    marginTop: 2,
  },
  addressButton: {
    backgroundColor: "#991b1b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  addressButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
  },
  rowRightValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueText: {
    marginRight: 8,
    color: "#9ca3af",
    fontSize: 12,
  },
});
