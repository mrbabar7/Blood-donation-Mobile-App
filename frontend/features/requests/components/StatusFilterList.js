import React from "react";
import { ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import AppText from "../../../components/AppText";

const STATUS_FILTERS = [
  { id: "ALL", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "accepted", label: "Accepted" },
  { id: "completed", label: "Completed" },
  { id: "rejected", label: "Declined" },
];

export default function StatusFilterList({ statusFilter, setStatusFilter }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}
    >
      {STATUS_FILTERS.map((tab) => {
        const active = statusFilter === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.7}
            onPress={() => setStatusFilter(tab.id)}
            style={[
              styles.filterPill,
              active ? styles.pillActive : styles.pillInactive,
            ]}
          >
            <AppText
              variant="black"
              style={[
                styles.filterText,
                active ? styles.textActive : styles.textInactive,
              ]}
            >
              {tab.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  filterPill: {
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  pillActive: {
    backgroundColor: "#dc2626",
  },
  pillInactive: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  filterText: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  textActive: {
    color: "#ffffff",
  },
  textInactive: {
    color: "#94a3b8",
  },
});
