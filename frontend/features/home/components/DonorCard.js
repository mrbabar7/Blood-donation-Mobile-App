import React from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { MapPin, Clock, Check, ExternalLink, Star } from "lucide-react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import AppText from "../../../components/AppText";

/**
 * Format timestamp or date string into user-friendly "Last Seen" string
 */
const formatLastSeen = (lastSeen) => {
  if (!lastSeen) return "Offline";

  const seenDate = new Date(lastSeen);
  if (isNaN(seenDate.getTime())) {
    return typeof lastSeen === "string" ? lastSeen : "Offline";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now - seenDate) / 1000);

  if (diffInSeconds < 60) return "Just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths}mo ago`;
};

export default function DonorCard({
  donor,
  daysLeft,
  onRequest,
  onCancel,
  isRequesting,
  cancelLoading,
  onDetails,
}) {
  const isLocked = daysLeft > 0;

  // Robust presence resolution
  const isOnline = Boolean(
    donor.isOnline ?? donor.userId?.isOnline ?? donor.status === "online",
  );

  const lastSeenVal = donor.lastSeen || donor.userId?.lastSeen;

  return (
    <MotiView
      from={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "timing", duration: 250 }}
      style={styles.cardContainer}
    >
      {/* ================= SECTION 1: HEADER GRADIENT ================= */}
      <LinearGradient
        colors={["#dc2626", "#991b1b"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientHeader}
      >
        <View style={styles.topHeaderRow}>
          <View style={styles.headerInfoLeft}>
            {/* Status Pill (Online / Last Seen) */}
            <View
              style={[
                styles.statusPill,
                isOnline ? styles.pillOnline : styles.pillOffline,
              ]}
            >
              <View
                style={[
                  styles.statusDot,
                  isOnline ? styles.dotOnline : styles.dotOffline,
                ]}
              />
              <AppText variant="bold" style={styles.statusPillText}>
                {isOnline
                  ? "Online"
                  : `Last seen ${formatLastSeen(lastSeenVal)}`}
              </AppText>
            </View>

            {/* Donor Name */}
            <AppText variant="black" style={styles.donorName} numberOfLines={1}>
              {donor.fullName || "Anonymous Donor"}
            </AppText>

            {/* Location */}
            <View style={styles.locationContainer}>
              <MapPin size={12} color="#fecdd3" />
              <AppText
                variant="bold"
                style={styles.locationText}
                numberOfLines={1}
              >
                {donor.district ||
                  donor.city ||
                  donor.province ||
                  "Location unavailable"}
              </AppText>
            </View>
          </View>

          {/* Blood Type Badge */}
          <View style={styles.bloodBadgeContainer}>
            <AppText variant="black" style={styles.bloodBadgeText}>
              {donor.bloodType || "N/A"}
            </AppText>
          </View>
        </View>
      </LinearGradient>

      {/* ================= SECTION 2: STATS ROW ================= */}
      <View style={styles.statsContainer}>
        {/* Lives Saved */}
        <View style={styles.statBox}>
          <AppText variant="bold" style={styles.statLabel}>
            LIVES SAVED
          </AppText>
          <AppText variant="black" style={styles.statValue}>
            {donor.livesSaved || 0}
          </AppText>
        </View>

        <View style={styles.statDivider} />

        {/* Donor Rating */}
        <View style={[styles.statBox, styles.statBoxCenter]}>
          <AppText variant="bold" style={styles.statLabel}>
            RATING
          </AppText>
          <View style={styles.ratingRow}>
            <Star size={11} color="#f59e0b" fill="#f59e0b" />
            <AppText variant="black" style={styles.ratingText}>
              {donor.rating && donor.rating > 0
                ? donor.rating.toFixed(1)
                : donor.totalRatings || "New"}
            </AppText>
          </View>
        </View>

        <View style={styles.statDivider} />

        {/* Age */}
        <View style={[styles.statBox, styles.statBoxRight]}>
          <AppText variant="bold" style={styles.statLabel}>
            AGE
          </AppText>
          <AppText variant="black" style={styles.statValue}>
            {donor.age ? `${donor.age} Yrs` : "N/A"}
          </AppText>
        </View>
      </View>

      {/* ================= SECTION 3: ACTION BUTTONS ================= */}
      <View style={styles.actionContainer}>
        {donor.requestStatus === "pending" ? (
          <View style={styles.actionRow}>
            <View style={styles.pendingBtn}>
              <Clock size={14} color="#ffffff" />
              <AppText variant="black" style={styles.pendingBtnText}>
                Pending Request
              </AppText>
            </View>

            <TouchableOpacity
              onPress={onCancel}
              activeOpacity={0.8}
              style={styles.cancelBtn}
            >
              {cancelLoading ? (
                <ActivityIndicator size="small" color="#dc2626" />
              ) : (
                <AppText variant="bold" style={styles.cancelBtnText}>
                  Cancel
                </AppText>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.actionRow}>
            <TouchableOpacity
              disabled={isLocked || isRequesting}
              onPress={onRequest}
              activeOpacity={0.85}
              style={[
                styles.requestBtn,
                isLocked
                  ? styles.requestBtnDisabled
                  : donor.requestStatus === "accepted"
                    ? styles.requestBtnAccepted
                    : styles.requestBtnDefault,
              ]}
            >
              {isRequesting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  {donor.requestStatus === "accepted" && (
                    <Check size={14} color="#ffffff" style={styles.btnIcon} />
                  )}
                  <AppText variant="black" style={styles.requestBtnText}>
                    {isLocked
                      ? `Locked (${daysLeft}d)`
                      : donor.requestStatus === "accepted"
                        ? "Request Accepted"
                        : "Request Blood"}
                  </AppText>
                </>
              )}
            </TouchableOpacity>

            {donor.requestStatus === "accepted" && (
              <TouchableOpacity
                onPress={onDetails}
                activeOpacity={0.85}
                style={styles.detailsBtn}
              >
                <ExternalLink size={14} color="#ffffff" />
                <AppText variant="black" style={styles.detailsBtnText}>
                  Details
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: "hidden",
  },
  gradientHeader: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  topHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerInfoLeft: {
    flex: 1,
    paddingRight: 10,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  pillOnline: {
    backgroundColor: "rgba(16, 185, 129, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.4)",
  },
  pillOffline: {
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  dotOnline: {
    backgroundColor: "#34d399",
  },
  dotOffline: {
    backgroundColor: "#cbd5e1",
  },
  statusPillText: {
    fontSize: 9,
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  donorName: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  locationText: {
    fontSize: 11,
    color: "#fecdd3",
    marginLeft: 4,
  },
  bloodBadgeContainer: {
    width: 44,
    height: 44,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  bloodBadgeText: {
    color: "#dc2626",
    fontSize: 17,
    fontWeight: "900",
  },
  statsContainer: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#f1f5f9",
  },
  statBox: {
    flex: 1,
  },
  statBoxCenter: {
    alignItems: "center",
  },
  statBoxRight: {
    alignItems: "flex-end",
  },
  statLabel: {
    fontSize: 8,
    letterSpacing: 0.8,
    color: "#64748b",
  },
  statValue: {
    color: "#0f172a",
    fontSize: 12,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 18,
    backgroundColor: "#cbd5e1",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 1,
  },
  ratingText: {
    color: "#0f172a",
    fontSize: 12,
    marginLeft: 3,
  },
  actionContainer: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  pendingBtn: {
    flex: 2,
    backgroundColor: "#d97706",
    height: 40,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  pendingBtnText: {
    color: "#ffffff",
    fontSize: 12,
    marginLeft: 6,
    letterSpacing: 0.3,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecdd3",
    height: 40,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    color: "#dc2626",
    fontSize: 12,
    letterSpacing: 0.3,
  },
  requestBtn: {
    flex: 1,
    height: 40,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  requestBtnDisabled: {
    backgroundColor: "#94a3b8",
  },
  requestBtnAccepted: {
    backgroundColor: "#059669",
  },
  requestBtnDefault: {
    backgroundColor: "#dc2626",
  },
  requestBtnText: {
    color: "#ffffff",
    fontSize: 12,
    letterSpacing: 0.3,
    fontWeight: "700",
  },
  btnIcon: {
    marginRight: 4,
  },
  detailsBtn: {
    flex: 1,
    backgroundColor: "#0f172a",
    height: 40,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsBtnText: {
    color: "#ffffff",
    fontSize: 12,
    marginLeft: 6,
    letterSpacing: 0.3,
  },
});
