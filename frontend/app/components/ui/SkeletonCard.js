import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

export default function SkeletonCard() {
  const animatedValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [animatedValue]);

  return (
    <View style={styles.card}>
      {/* Header Placeholder */}
      <View style={styles.headerRow}>
        <Animated.View style={[styles.avatar, { opacity: animatedValue }]} />
        <View style={styles.headerTextGroup}>
          <Animated.View
            style={[styles.titleLine, { opacity: animatedValue }]}
          />
          <Animated.View
            style={[styles.subtitleLine, { opacity: animatedValue }]}
          />
        </View>
      </View>

      {/* Info Lines */}
      <Animated.View style={[styles.infoLine, { opacity: animatedValue }]} />
      <Animated.View
        style={[styles.infoLineShort, { opacity: animatedValue }]}
      />

      {/* Action Buttons Placeholder */}
      <View style={styles.buttonRow}>
        <Animated.View
          style={[styles.btnPlaceholder, { opacity: animatedValue }]}
        />
        <Animated.View
          style={[styles.btnPlaceholder, { opacity: animatedValue }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#E2E8F0",
  },
  headerTextGroup: {
    marginLeft: 12,
    flex: 1,
  },
  titleLine: {
    width: "70%",
    height: 14,
    borderRadius: 6,
    backgroundColor: "#E2E8F0",
    marginBottom: 6,
  },
  subtitleLine: {
    width: "40%",
    height: 10,
    borderRadius: 4,
    backgroundColor: "#CBD5E1",
  },
  infoLine: {
    width: "90%",
    height: 12,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
    marginBottom: 8,
  },
  infoLineShort: {
    width: "60%",
    height: 12,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
    marginBottom: 14,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  btnPlaceholder: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#E2E8F0",
  },
});
