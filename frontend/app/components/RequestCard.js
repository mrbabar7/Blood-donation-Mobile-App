import React from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import {
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  History,
  Trash2,
  ChevronRight,
  Check,
  PhoneCall,
} from "lucide-react-native";
import { MotiView } from "moti";
import AppText from "../../components/AppText";

export default function RequestCard({
  item,
  role = "seeker", // 'seeker' or 'donor'
  onDelete,
  onNavigateDetails,
  onDonorAction,
  processingId,
  actionType,
}) {
  const isDonorView = role === "donor";
  const isProcessingThis = processingId === item._id;

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          color: "#d97706",
          bg: "bg-amber-50 border-amber-200",
          text: "text-amber-700",
          icon: Clock,
          label: "Pending Response",
        };
      case "accepted":
        return {
          color: "#059669",
          bg: "bg-emerald-50 border-emerald-200",
          text: "text-emerald-700",
          icon: CheckCircle2,
          label: "Accepted",
        };
      case "rejected":
        return {
          color: "#dc2626",
          bg: "bg-rose-50 border-rose-200",
          text: "text-rose-700",
          icon: XCircle,
          label: "Declined",
        };
      case "completed":
        return {
          color: "#2563eb",
          bg: "bg-blue-50 border-blue-200",
          text: "text-blue-700",
          icon: History,
          label: "Completed",
        };
      default:
        return {
          color: "#475569",
          bg: "bg-slate-50 border-slate-200",
          text: "text-slate-700",
          icon: Clock,
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(item.status);
  const StatusIcon = statusConfig.icon;

  const displayUser = isDonorView ? item.seekerId : item.donorId;
  const bloodGroup = isDonorView
    ? item.requestedBloodType || "O+"
    : item.donorId?.bloodType || item.requestedBloodType || "N/A";

  return (
    <MotiView
      from={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-3xl p-5 mb-4 border border-slate-100 shadow-sm"
    >
      {/* 1. CARD TOP ROW (Blood Badge, User Details & Status Badge) */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center flex-1 mr-2">
          {/* Blood Type Avatar */}
          <View className="w-12 h-12 bg-red-600 rounded-2xl items-center justify-center shadow-md shadow-red-200">
            <AppText variant="black" className="text-white text-base">
              {bloodGroup}
            </AppText>
          </View>

          {/* User Info */}
          <View className="ml-3 flex-1">
            <AppText
              variant="black"
              numberOfLines={1}
              className="text-slate-900 text-base"
            >
              {displayUser?.fullName ||
                (isDonorView ? "Anonymous Seeker" : "Unknown Donor")}
            </AppText>

            <View className="flex-row items-center mt-1">
              <MapPin size={13} color="#94a3b8" />
              <AppText
                variant="bold"
                numberOfLines={1}
                className="text-slate-400 text-xs ml-1 flex-1"
              >
                {displayUser?.district || "Location Not Provided"}
              </AppText>
            </View>
          </View>
        </View>

        {/* Universal Status Pill */}
        <View
          className={`px-3 py-1.5 rounded-full border flex-row items-center ${statusConfig.bg}`}
        >
          <StatusIcon size={12} color={statusConfig.color} />
          <AppText
            variant="black"
            className={`text-[10px] uppercase tracking-wider ml-1.5 ${statusConfig.text}`}
          >
            {statusConfig.label}
          </AppText>
        </View>
      </View>

      {/* 2. CARD DYNAMIC ACTIONS FOOTER */}
      <View className="pt-3 border-t border-slate-100">
        {/* ==================== A. DONOR VIEW ==================== */}
        {isDonorView ? (
          item.status === "pending" ? (
            /* Pending Actions: Accept & Decline Buttons */
            <View className="flex-row gap-2">
              <TouchableOpacity
                disabled={processingId !== null}
                onPress={() => onDonorAction(item._id, "accept")}
                activeOpacity={0.8}
                className="flex-1 bg-emerald-600 h-12 rounded-2xl flex-row items-center justify-center shadow-md shadow-emerald-200"
              >
                {isProcessingThis && actionType === "accept" ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <Check size={16} color="white" />
                    <AppText
                      variant="black"
                      className="text-white text-xs uppercase tracking-wider ml-1.5"
                    >
                      Accept Appeal
                    </AppText>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                disabled={processingId !== null}
                onPress={() => onDonorAction(item._id, "reject")}
                activeOpacity={0.8}
                className="flex-1 bg-slate-50 border border-slate-200 h-12 rounded-2xl flex-row items-center justify-center"
              >
                {isProcessingThis && actionType === "reject" ? (
                  <ActivityIndicator color="#ef4444" size="small" />
                ) : (
                  <>
                    <XCircle size={16} color="#64748b" />
                    <AppText
                      variant="bold"
                      className="text-slate-600 text-xs uppercase tracking-wider ml-1.5"
                    >
                      Decline
                    </AppText>
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : item.status === "accepted" ? (
            /* Accepted State: View Details / Contact Seeker */
            <TouchableOpacity
              onPress={() =>
                onNavigateDetails &&
                onNavigateDetails(item.seekerId?._id, item._id)
              }
              activeOpacity={0.8}
              className="bg-slate-900 h-12 rounded-2xl flex-row items-center justify-center shadow-md shadow-slate-200"
            >
              <PhoneCall size={15} color="white" />
              <AppText
                variant="black"
                className="text-white text-xs uppercase tracking-widest ml-2 mr-1"
              >
                Contact Seeker
              </AppText>
              <ChevronRight size={16} color="white" />
            </TouchableOpacity>
          ) : (
            /* Declined / Completed State Info */
            <View className="py-1 items-center justify-center">
              <AppText
                variant="bold"
                className="text-slate-400 text-xs tracking-wide"
              >
                {item.status === "completed"
                  ? "Donation procedure finalized."
                  : "Request was declined by you."}
              </AppText>
            </View>
          )
        ) : /* ==================== B. SEEKER VIEW ==================== */
        item.status === "accepted" ? (
          /* Accepted State: Contact Donor Button */
          <TouchableOpacity
            onPress={() =>
              onNavigateDetails &&
              onNavigateDetails(item.donorId?._id, item._id)
            }
            activeOpacity={0.8}
            className="bg-red-600 h-12 rounded-2xl flex-row items-center justify-center shadow-md shadow-red-200"
          >
            <PhoneCall size={15} color="white" />
            <AppText
              variant="black"
              className="text-white text-xs uppercase tracking-widest ml-2 mr-1"
            >
              Contact Donor
            </AppText>
            <ChevronRight size={16} color="white" />
          </TouchableOpacity>
        ) : (
          /* Pending / Declined / Completed State: Cancel or Delete Button */
          <TouchableOpacity
            onPress={() => onDelete && onDelete(item._id)}
            activeOpacity={0.8}
            className="bg-slate-50 border border-slate-200 h-12 rounded-2xl flex-row items-center justify-center"
          >
            <Trash2 size={14} color="#64748b" />
            <AppText
              variant="bold"
              className="text-slate-600 text-xs uppercase tracking-wider ml-2"
            >
              {item.status === "pending" ? "Cancel Request" : "Remove Record"}
            </AppText>
          </TouchableOpacity>
        )}
      </View>
    </MotiView>
  );
}
