import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Linking,
  Platform,
  Alert,
  Clipboard,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import {
  Phone,
  X,
  Copy,
  Check,
  Stethoscope,
  PlusCircle,
  List,
  ListFilter,
} from "lucide-react-native";
import BankBrowseDirectory from "../components/BankBrowseDirectory";
import BankRegistrationForm from "../components/BankForm";

export default function BloodBanksScreen() {
  // Tab Switcher State: 'browse' | 'register'
  const [activeTab, setActiveTab] = useState("browse");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "browse" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("browse")}
          >
            <ListFilter
              size={15}
              color={activeTab === "browse" ? "#2563EB" : "#64748B"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "browse" && styles.tabTextActive,
              ]}
            >
              Browse Directory
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "register" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("register")}
          >
            <PlusCircle
              size={15}
              color={activeTab === "register" ? "#2563EB" : "#64748B"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "register" && styles.tabTextActive,
              ]}
            >
              Register Blood Bank
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* OPTION 1: BROWSE DIRECTORY */}
      {activeTab === "browse" && <BankBrowseDirectory />}

      {/* OPTION 2: BLOOD BANK REGISTRATION FORM */}
      {activeTab === "register" && <BankRegistrationForm />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 4,
    marginTop: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#2563EB",
    fontWeight: "700",
  },
});
