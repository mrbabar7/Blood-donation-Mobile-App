import React from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Trash2,
  ExternalLink,
  MapPin,
  Calendar,
} from "lucide-react-native";
import AppText from "../../../components/AppText";

export default function RequestCard({
  item,
  role,
  onDelete,
  onNavigateDetails,
  onDonorAction,
  processingId,
  actionType,
}) {
  const isProcessing = processingId === item._id;

  const renderStatusBadge = () => {
    switch (item.status) {
      case "accepted":
        return (
          <View style={[styles.badge, styles.badgeAccepted]}>
            <CheckCircle2 size={12} color="#059669" />
            <AppText
              variant="bold"
              style={[styles.badgeText, { color: "#059669" }]}
            >
              Accepted
            </AppText>
          </View>
        );
      case "completed":
        return (
          <View style={[styles.badge, styles.badgeCompleted]}>
            <CheckCircle2 size={12} color="#2563eb" />
            <AppText
              variant="bold"
              style={[styles.badgeText, { color: "#2563eb" }]}
            >
              Completed
            </AppText>
          </View>
        );
      case "rejected":
        return (
          <View style={[styles.badge, styles.badgeRejected]}>
            <XCircle size={12} color="#dc2626" />
            <AppText
              variant="bold"
              style={[styles.badgeText, { color: "#dc2626" }]}
            >
              Declined
            </AppText>
          </View>
        );
      default:
        return (
          <View style={[styles.badge, styles.badgePending]}>
            <Clock size={12} color="#d97706" />
            <AppText
              variant="bold"
              style={[styles.badgeText, { color: "#d97706" }]}
            >
              Pending
            </AppText>
          </View>
        );
    }
  };

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.headerInfo}>
          <AppText variant="black" style={styles.title} numberOfLines={1}>
            {role === "seeker"
              ? item.donorId?.fullName || "Assigned Donor"
              : item.seekerId?.fullName || "Blood Seeker"}
          </AppText>
          <View style={styles.locationRow}>
            <MapPin size={12} color="#64748b" />
            <AppText
              variant="bold"
              style={styles.locationText}
              numberOfLines={1}
            >
              {item.seekerLocation.province || "N/A"},{" "}
              {item.seekerLocation.city || "N/A"}
            </AppText>
          </View>
        </View>

        <View style={styles.bloodTypeBadge}>
          <AppText variant="black" style={styles.bloodTypeText}>
            {item.bloodType || item.requestedBloodType || "N/A"}
          </AppText>
        </View>
      </View>

      {/* Meta Row */}
      <View style={styles.metaRow}>
        <View style={styles.dateContainer}>
          <Calendar size={12} color="#94a3b8" />
          <AppText variant="bold" style={styles.dateText}>
            {item.createdAt
              ? new Date(item.createdAt).toLocaleDateString()
              : "Recent"}
          </AppText>
        </View>
        {renderStatusBadge()}
      </View>

      {/* Actions Section */}
      <View style={styles.actionContainer}>
        {role === "seeker" ? (
          <View style={styles.actionRow}>
            {item.donorId && item.status === "accepted" && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onNavigateDetails(item.donorId._id, item._id)}
                style={styles.primaryActionBtn}
              >
                <ExternalLink size={14} color="#ffffff" />
                <AppText variant="bold" style={styles.primaryActionText}>
                  View Donor Details
                </AppText>
              </TouchableOpacity>
            )}

            {(item.status === "completed" || item.status === "rejected") && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onDelete(item._id)}
                style={styles.deleteBtn}
              >
                <Trash2 size={14} color="#dc2626" />
                <AppText variant="bold" style={styles.deleteBtnText}>
                  Remove
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          /* Donor Role Actions */
          <View style={styles.actionRow}>
            {item.status === "pending" && (
              <>
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={isProcessing}
                  onPress={() => onDonorAction(item._id, "accept")}
                  style={[styles.btnFlex, styles.btnAccept]}
                >
                  {isProcessing && actionType === "accept" ? (
                    <ActivityIndicator color="#ffffff" size="small" />
                  ) : (
                    <AppText variant="black" style={styles.btnTextLight}>
                      Accept Request
                    </AppText>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={isProcessing}
                  onPress={() => onDonorAction(item._id, "reject")}
                  style={[styles.btnFlex, styles.btnReject]}
                >
                  {isProcessing && actionType === "reject" ? (
                    <ActivityIndicator color="#dc2626" size="small" />
                  ) : (
                    <AppText variant="bold" style={styles.btnTextDark}>
                      Decline
                    </AppText>
                  )}
                </TouchableOpacity>
              </>
            )}

            {item.status === "accepted" && (
              <TouchableOpacity
                activeOpacity={0.8}
                disabled={isProcessing}
                onPress={() => onDonorAction(item._id, "complete")}
                style={[styles.btnFlex, styles.btnComplete]}
              >
                {isProcessing && actionType === "complete" ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <AppText variant="black" style={styles.btnTextLight}>
                    Mark Completed
                  </AppText>
                )}
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerInfo: {
    flex: 1,
    paddingRight: 12,
  },
  title: {
    fontSize: 16,
    color: "#0f172a",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  locationText: {
    fontSize: 12,
    color: "#64748b",
    marginLeft: 4,
  },
  bloodTypeBadge: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecdd3",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  bloodTypeText: {
    color: "#dc2626",
    fontSize: 14,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 11,
    color: "#94a3b8",
    marginLeft: 4,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeAccepted: { backgroundColor: "#ecfdf5" },
  badgeCompleted: { backgroundColor: "#eff6ff" },
  badgeRejected: { backgroundColor: "#fef2f2" },
  badgePending: { backgroundColor: "#fffbeb" },
  badgeText: { fontSize: 10, marginLeft: 4, textTransform: "uppercase" },
  actionContainer: {
    marginTop: 12,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  primaryActionBtn: {
    flex: 1,
    backgroundColor: "#dc2626",
    height: 40,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryActionText: { color: "#ffffff", fontSize: 12, marginLeft: 6 },
  deleteBtn: {
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecdd3",
    paddingHorizontal: 16,
    height: 40,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtnText: { color: "#dc2626", fontSize: 12, marginLeft: 6 },
  btnFlex: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnAccept: { backgroundColor: "#16a34a" },
  btnReject: {
    backgroundColor: "#f1f5f9",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  btnComplete: { backgroundColor: "#2563eb" },
  btnTextLight: { color: "#ffffff", fontSize: 12 },
  btnTextDark: { color: "#334155", fontSize: 12 },
});
