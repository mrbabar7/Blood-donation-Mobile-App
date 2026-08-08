import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Users, Droplet, CheckCircle2 } from "lucide-react-native";
import AppText from "../../../components/AppText";

export default function EmptyState({
  roleMode,
  isDonor,
  statusFilter,
  onRegisterDonor,
}) {
  if (roleMode === "donor" && !isDonor) {
    return (
      <View style={styles.donorBannerContainer}>
        <View style={styles.iconCircle}>
          <Users size={28} color="#94a3b8" />
        </View>

        <AppText variant="black" style={styles.donorTitle}>
          Donor Profile Required
        </AppText>

        <AppText variant="bold" style={styles.donorSubtitle}>
          You need to register as an active donor to view and accept urgent
          blood requests from seekers.
        </AppText>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onRegisterDonor}
          style={styles.registerBtn}
        >
          <AppText variant="black" style={styles.registerBtnText}>
            Create Donor Profile
          </AppText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyCard}>
        <View style={styles.iconCircle}>
          {roleMode === "donor" ? (
            <CheckCircle2 size={28} color="#cbd5e1" />
          ) : (
            <Droplet size={28} color="#cbd5e1" />
          )}
        </View>

        <AppText variant="black" style={styles.emptyTitle}>
          No Requests Found
        </AppText>

        <AppText variant="bold" style={styles.emptySubtitle}>
          {roleMode === "donor"
            ? `There are no ${
                statusFilter === "ALL" ? "" : statusFilter.toLowerCase()
              } seeker appeals currently assigned to you.`
            : `There are no ${statusFilter.toLowerCase()} request entries registered.`}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  donorBannerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 32,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  iconCircle: {
    width: 64,
    height: 64,
    backgroundColor: "#f8fafc",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  donorTitle: {
    color: "#0f172a",
    fontSize: 18,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  donorSubtitle: {
    color: "#94a3b8",
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  registerBtn: {
    marginTop: 24,
    backgroundColor: "#dc2626",
    height: 48,
    width: "100%",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  registerBtnText: {
    color: "#ffffff",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    padding: 32,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    alignItems: "center",
    width: "100%",
    maxWidth: 320,
  },
  emptyTitle: {
    color: "#1e293b",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    textAlign: "center",
  },
  emptySubtitle: {
    color: "#94a3b8",
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
    lineHeight: 16,
  },
});
