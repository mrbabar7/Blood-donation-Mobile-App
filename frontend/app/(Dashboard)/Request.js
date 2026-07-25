import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import {
  Clock,
  CheckCircle,
  XCircle,
  Droplet,
  MapPin,
  Trash2,
  ChevronRight,
  History,
  Info,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { MotiView, AnimatePresence } from "moti";

// Replace with your actual config/env
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function RequestScreen() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  const router = useRouter();

  const tabs = [
    { id: "pending", label: "Pending" },
    { id: "accepted", label: "Accepted" },
    { id: "rejected", label: "Rejected" },
    { id: "completed", label: "History" },
  ];

  // --- LOGIC FROM WEB APP ---

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/seeker/my-requests`, {
        credentials: "include", // Ensure your mobile client handles cookies or use Bearer tokens
      });

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      Alert.alert("Error", "Failed to load requests");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  const deleteSingleRequest = (requestId) => {
    Alert.alert(
      "Remove Record",
      "Are you sure you want to delete this request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `${apiUrl}/api/seeker/delete-request/${requestId}`,
                {
                  method: "DELETE",
                  credentials: "include",
                },
              );
              if (response.ok) {
                setRequests((prev) => prev.filter((r) => r._id !== requestId));
              }
            } catch (err) {
              Alert.alert("Error", "Could not delete");
            }
          },
        },
      ],
    );
  };

  const clearCategory = (status) => {
    Alert.alert("Clear Category", `Delete all ${status} requests?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear All",
        style: "destructive",
        onPress: async () => {
          try {
            await fetch(`${apiUrl}/api/seeker/clear-history/${status}`, {
              method: "DELETE",
              credentials: "include",
            });
            setRequests((prev) => prev.filter((r) => r.status !== status));
          } catch (err) {
            Alert.alert("Error", "Failed to clear category");
          }
        },
      },
    ]);
  };

  // const filteredRequests = requests.filter((req) => req.status === activeTab);
  const filteredRequests =
    requests.length > 1
      ? requests.filter((req) => req.status === activeTab)
      : 0;
  // --- UI COMPONENTS ---

  const StatusBadge = ({ status }) => {
    const configs = {
      pending: { color: "#f59e0b", icon: Clock, label: "Pending" },
      accepted: { color: "#10b981", icon: CheckCircle, label: "Accepted" },
      rejected: { color: "#ef4444", icon: XCircle, label: "Rejected" },
      completed: { color: "#3b82f6", icon: History, label: "Completed" },
    };
    const config = configs[status];
    const Icon = config.icon;

    return (
      <View className="flex-row items-center">
        <Icon size={14} color={config.color} />
        <Text className="ml-1 font-bold text-[10px] uppercase text-gray-400">
          {config.label}
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* TABS SECTION */}
      <View className="bg-white px-2 py-4 shadow-sm border-b border-gray-100">
        <View className="flex-row justify-between items-center">
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              className={`flex-1 mx-1 py-3 rounded-2xl items-center ${
                activeTab === tab.id ? "bg-red-600" : "bg-gray-50"
              }`}
            >
              <Text
                className={`font-black uppercase tracking-tighter ${
                  activeTab === tab.id ? "text-white" : "text-gray-400"
                }`}
                style={{ fontSize: 9 }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* CLEAR BUTTON (Only for History/Rejected) */}
      {(activeTab === "completed" || activeTab === "rejected") &&
        filteredRequests.length > 0 && (
          <TouchableOpacity
            onPress={() => clearCategory(activeTab)}
            className="mx-4 mt-4 flex-row items-center justify-center bg-red-50 py-2 rounded-xl border border-red-100"
          >
            <Trash2 size={12} color="#991b1b" />
            <Text className="text-red-800 ml-2 font-black text-[10px] uppercase">
              Clear All {activeTab}
            </Text>
          </TouchableOpacity>
        )}

      {/* MAIN LIST */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View className="py-20 items-center">
            <ActivityIndicator color="#ef4444" size="large" />
            <Text className="text-gray-400 font-bold mt-4">
              Syncing with Server...
            </Text>
          </View>
        ) : filteredRequests.length > 0 ? (
          <AnimatePresence>
            {filteredRequests.map((item) => (
              <MotiView
                key={item._id}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white p-5 rounded-[2.5rem] mb-4 shadow-sm border border-gray-100"
              >
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center bg-red-50 px-3 py-1 rounded-xl">
                    <Droplet size={16} color="#dc2626" fill="#dc2626" />
                    <Text className="text-red-700 font-black ml-2 text-lg">
                      {item.donorId?.bloodType || "N/A"}
                    </Text>
                  </View>
                  <StatusBadge status={item.status} />
                </View>

                <View className="mb-4">
                  <Text className="text-gray-900 font-black text-xl mb-1">
                    {item.donorId?.fullName || "Unknown Donor"}
                  </Text>
                  <View className="flex-row items-center">
                    <MapPin size={14} color="#94a3b8" />
                    <Text className="text-gray-400 ml-1 font-bold text-xs">
                      {item.donorId?.district || "Location not provided"}
                    </Text>
                  </View>
                </View>

                <View className="flex-row gap-2 mt-2 pt-4 border-t border-gray-50">
                  {activeTab === "accepted" ? (
                    <TouchableOpacity
                      onPress={() =>
                        router.push(
                          `/dashboard/donor-details/${item.donorId._id}/${item._id}`,
                        )
                      }
                      className="flex-1 bg-red-600 h-12 rounded-2xl flex-row items-center justify-center shadow-lg shadow-red-200"
                    >
                      <Text className="text-white font-black text-[11px] uppercase tracking-widest">
                        Contact Donor
                      </Text>
                      <ChevronRight size={16} color="white" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => deleteSingleRequest(item._id)}
                      className="flex-1 bg-gray-50 h-12 rounded-2xl flex-row items-center justify-center border border-gray-100"
                    >
                      <Trash2 size={14} color="#94a3b8" />
                      <Text className="text-gray-400 ml-2 font-black text-[11px] uppercase tracking-widest">
                        {activeTab === "pending" ? "Cancel Request" : "Remove"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </MotiView>
            ))}
          </AnimatePresence>
        ) : (
          <View className="items-center justify-center py-20">
            <View className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-50 items-center">
              <Droplet size={48} color="#e2e8f0" />
              <Text className="text-gray-300 font-black mt-4 uppercase tracking-widest text-center">
                No {activeTab} records found
              </Text>
            </View>
          </View>
        )}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
