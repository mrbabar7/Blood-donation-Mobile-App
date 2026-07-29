import React from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { MapPin, Phone, Clock, Check, ExternalLink } from "lucide-react-native";
import { MotiView } from "moti";
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
      className="bg-white rounded-3xl p-5 mb-4 border border-slate-100 shadow-sm"
    >
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1 pr-3">
          <View
            className={`px-3 py-1 rounded-full self-start mb-2 ${
              isLocked
                ? "bg-red-50"
                : donor.isAvailable
                  ? "bg-emerald-50"
                  : "bg-slate-100"
            }`}
          >
            <AppText
              variant="bold"
              className={`text-[10px] uppercase tracking-wider ${
                isLocked
                  ? "text-red-700"
                  : donor.isAvailable
                    ? "text-emerald-600"
                    : "text-slate-500"
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

          <AppText
            variant="black"
            className="text-slate-900 text-lg leading-snug"
          >
            {donor.fullName}
          </AppText>

          <View className="flex-row items-center mt-1">
            <MapPin size={13} color="#ef4444" />
            <AppText variant="bold" className="text-xs text-slate-500 ml-1.5">
              {donor.district || "N/A"}
            </AppText>
          </View>
        </View>

        <View className="w-14 h-14 bg-red-600 rounded-2xl items-center justify-center shadow-md shadow-red-200">
          <AppText variant="black" className="text-white text-xl">
            {donor.bloodType}
          </AppText>
        </View>
      </View>

      <View className="flex-row bg-slate-50 rounded-2xl p-3.5 mb-4 justify-between border border-slate-100">
        <View>
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
        <View className="items-end">
          <AppText
            variant="bold"
            className="text-[9px] uppercase tracking-widest text-slate-400"
          >
            Age
          </AppText>
          <AppText variant="black" className="text-slate-800 text-xs mt-0.5">
            {donor.age} Years
          </AppText>
        </View>
      </View>

      {/* Action Buttons */}
      {donor.requestStatus === "pending" ? (
        <View className="flex-row gap-2">
          <View className="flex-[2] bg-amber-500 h-12 rounded-2xl flex-row items-center justify-center">
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
            className="flex-1 bg-red-50 border border-red-100 h-12 rounded-2xl items-center justify-center"
          >
            {cancelLoading ? (
              <ActivityIndicator size="small" color="#ef4444" />
            ) : (
              <AppText
                variant="bold"
                className="text-red-600 text-xs uppercase tracking-wider"
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
            className={`flex-1 h-12 rounded-2xl flex-row items-center justify-center ${
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
                {donor.requestStatus === "accepted" ? (
                  <Check size={16} color="white" />
                ) : (
                  <Phone size={16} color="white" fill="white" />
                )}
                <AppText
                  variant="black"
                  className="text-white text-xs ml-2 uppercase tracking-wider"
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
    </MotiView>
  );
}
