import React from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import {
  MapPin,
  Phone,
  Clock,
  Check,
  ExternalLink,
  Star,
} from "lucide-react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import AppText from "../../components/AppText";

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

  return (
    <MotiView
      from={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl mb-4 border border-slate-100 shadow-md overflow-hidden"
    >
      {/* ================= SECTION 1: TOP GRADIENT HEADER ================= */}
      <LinearGradient
        colors={["#dc2626", "#991b1b"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="p-5"
      >
        <View className="flex-row justify-between items-start">
          <View className="flex-1 pr-3">
            {/* Status Badge */}
            <View
              className={`px-3 py-1 rounded-full self-start mb-2.5 backdrop-blur-md ${
                isLocked
                  ? "bg-black/30"
                  : donor.isAvailable
                    ? "bg-emerald-500/20 border border-emerald-400/40"
                    : "bg-black/20"
              }`}
            >
              <AppText
                variant="bold"
                className={`text-[10px] uppercase tracking-wider ${
                  isLocked
                    ? "text-amber-300"
                    : donor.isAvailable
                      ? "text-emerald-300"
                      : "text-slate-200"
                }`}
              >
                ●{" "}
                {isLocked
                  ? `Recovering (${daysLeft}d)`
                  : donor.isAvailable
                    ? "Available"
                    : "Busy"}
              </AppText>
            </View>

            {/* Donor Name */}
            <AppText
              variant="black"
              className="text-white text-xl leading-snug tracking-wide font-semibold"
            >
              {donor.fullName}
            </AppText>

            {/* Location */}
            <View className="flex-row items-center mt-1.5 opacity-90">
              <MapPin size={13} color="white" />
              <AppText variant="bold" className="text-xs text-white ml-1.5">
                {donor.district || donor.city || "N/A"}
              </AppText>
            </View>
          </View>

          {/* Blood Group Avatar Badge */}
          <View className="w-14 h-14 bg-white border border-red-700 rounded-2xl items-center justify-center backdrop-blur-md shadow-inner">
            <AppText variant="black" className="text-red-700 text-xl">
              {donor.bloodType}
            </AppText>
          </View>
        </View>
      </LinearGradient>

      {/* ================= SECTION 2: MIDDLE STATS & RATINGS ================= */}
      <View className="bg-slate-50 px-5 py-3.5 flex-row items-center justify-between border-y border-slate-100">
        {/* Lives Saved */}
        <View className="flex-1">
          <AppText
            variant="bold"
            className="text-[9px] uppercase tracking-widest text-slate-400"
          >
            Lives Saved
          </AppText>
          <AppText variant="black" className="text-slate-800 text-xs mt-0.5">
            {donor.livesSaved || 0} Times
          </AppText>
        </View>

        {/* Divider */}
        <View className="w-[1px] h-6 bg-slate-200" />

        {/* Donor Rating */}
        <View className="flex-1 items-center">
          <AppText
            variant="bold"
            className="text-[9px] uppercase tracking-widest text-slate-400"
          >
            Rating
          </AppText>
          <View className="flex-row items-center mt-0.5">
            <Star size={12} color="#f59e0b" fill="#f59e0b" />
            <AppText variant="black" className="text-slate-800 text-xs ml-1">
              {donor.totalRatings !== undefined && donor.totalRatings !== null
                ? donor.totalRatings
                : "N/A"}
            </AppText>
          </View>
        </View>

        {/* Divider */}
        <View className="w-[1px] h-6 bg-slate-200" />

        {/* Age */}
        <View className="flex-1 items-center">
          <AppText
            variant="bold"
            className="text-[9px] uppercase tracking-widest text-slate-400"
          >
            Age
          </AppText>
          <AppText variant="black" className="text-slate-800 text-xs mt-0.5">
            {donor.age ? `${donor.age} Yrs` : "N/A"}
          </AppText>
        </View>
      </View>

      {/* ================= SECTION 3: BOTTOM ACTIONS ================= */}
      <View className="bg-white p-4">
        {donor.requestStatus === "pending" ? (
          <View className="flex-row gap-2">
            <View className="flex-[2] bg-amber-600 h-12 rounded-[30px] flex-row items-center justify-center shadow-sm">
              <Clock size={16} color="white" />
              <AppText
                variant="black"
                className="text-white text-xs ml-2 uppercase tracking-wider"
              >
                Pending
              </AppText>
            </View>
            <TouchableOpacity
              onPress={onCancel}
              activeOpacity={0.8}
              className="flex-1 bg-red-50 border border-red-100 h-12 rounded-[30px] items-center justify-center"
            >
              {cancelLoading ? (
                <ActivityIndicator size="small" color="#ef4444" />
              ) : (
                <AppText
                  variant="bold"
                  className="text-red-700 text-xs uppercase tracking-wider"
                >
                  Cancel
                </AppText>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row gap-2">
            <TouchableOpacity
              disabled={isLocked || !donor.isAvailable || isRequesting}
              onPress={onRequest}
              activeOpacity={0.85}
              className={`flex-1 h-12 rounded-[30px] flex-row items-center justify-center ${
                isLocked || !donor.isAvailable
                  ? "bg-slate-200"
                  : donor.requestStatus === "accepted"
                    ? "bg-emerald-600"
                    : "bg-red-600 shadow-md shadow-red-200"
              }`}
            >
              {isRequesting ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  {donor.requestStatus === "accepted" && (
                    <Check size={16} color="white" />
                  )}
                  <AppText
                    variant="black"
                    className="text-white text-xs ml-2 uppercase tracking-wider font-semibold"
                  >
                    {isLocked
                      ? `Locked (${daysLeft}d)`
                      : donor.requestStatus === "accepted"
                        ? "Accepted"
                        : "Request Blood"}
                  </AppText>
                </>
              )}
            </TouchableOpacity>

            {donor.requestStatus === "accepted" && (
              <TouchableOpacity
                onPress={onDetails}
                activeOpacity={0.85}
                className="flex-1 bg-slate-900 h-12 rounded-2xl flex-row items-center justify-center"
              >
                <ExternalLink size={16} color="white" />
                <AppText
                  variant="black"
                  className="text-white text-xs ml-2 uppercase tracking-wider"
                >
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
