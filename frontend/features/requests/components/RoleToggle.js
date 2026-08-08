import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import AppText from "../../../components/AppText";

export default function RoleToggle({ roleMode, setRoleMode, setStatusFilter }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setRoleMode("seeker");
          setStatusFilter("ALL");
        }}
        style={[
          styles.toggleBtn,
          roleMode === "seeker" ? styles.activeBtn : styles.inactiveBtn,
        ]}
      >
        <AppText
          variant="bold"
          style={[
            styles.toggleText,
            roleMode === "seeker" ? styles.activeText : styles.inactiveText,
          ]}
        >
          My Requests
        </AppText>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          setRoleMode("donor");
          setStatusFilter("ALL");
        }}
        style={[
          styles.toggleBtn,
          roleMode === "donor" ? styles.activeBtn : styles.inactiveBtn,
        ]}
      >
        <AppText
          variant="bold"
          style={[
            styles.toggleText,
            roleMode === "donor" ? styles.activeText : styles.inactiveText,
          ]}
        >
          Seeker Requests
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    padding: 4,
    borderRadius: 16,
  },
  toggleBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  activeBtn: {
    backgroundColor: "#b91c1c",
  },
  inactiveBtn: {
    backgroundColor: "transparent",
  },
  toggleText: {
    fontSize: 13,
  },
  activeText: {
    color: "#ffffff",
  },
  inactiveText: {
    color: "#94a3b8",
  },
});
