import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import {
  Droplet,
  Calendar,
  MapPin,
  ArrowUpRight,
  ArrowDownLeft,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  History,
} from "lucide-react-native";
import { MotiView, AnimatePresence } from "moti";

// Replace with your actual config/env
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState("donor"); // 'donor' or 'seeker'
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [historyData, setHistoryData] = useState({ donor: [], seeker: [] });

  // --- LOGIC FROM WEB APP ---

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/activity-history`, {
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) setHistoryData(data);
    } catch (err) {
      console.error("Failed to fetch history");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const handleDelete = (type, id) => {
    Alert.alert(
      "Delete Record",
      "This will permanently remove this activity. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const response = await fetch(
                `${apiUrl}/api/delete-request/${id}`,
                {
                  method: "DELETE",
                  credentials: "include",
                },
              );
              if (response.ok) {
                setHistoryData((prev) => ({
                  ...prev,
                  [type]: prev[type].filter((item) => item.id !== id),
                }));
              }
            } catch (err) {
              Alert.alert("Error", "Delete failed");
            }
          },
        },
      ],
    );
  };

  // --- UI HELPERS ---

  const StatusBadge = ({ status }) => {
    const config = {
      Accepted: { color: "#059669", bg: "#ecfdf5", icon: CheckCircle2 },
      Completed: { color: "#059669", bg: "#ecfdf5", icon: CheckCircle2 },
      Pending: { color: "#d97706", bg: "#fffbeb", icon: Clock },
      Rejected: { color: "#dc2626", bg: "#fef2f2", icon: XCircle },
    };
    const style = config[status] || config.Pending;
    const Icon = style.icon;

    return (
      <View
        style={{ backgroundColor: style.bg }}
        className="flex-row items-center px-3 py-1 rounded-full border border-black/5"
      >
        <Icon size={10} color={style.color} />
        <Text
          style={{ color: style.color }}
          className="ml-1 text-[9px] font-black uppercase"
        >
          {status}
        </Text>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* --- TAB SWITCHER (Teammate's Style) --- */}
      <View className="flex-row bg-white mx-5 mt-6 rounded-2xl p-1 shadow-sm border border-gray-100">
        <TouchableOpacity
          onPress={() => setActiveTab("donor")}
          className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${
            activeTab === "donor" ? "bg-red-800" : "bg-transparent"
          }`}
        >
          <ArrowUpRight
            size={16}
            color={activeTab === "donor" ? "white" : "#9ca3af"}
          />
          <Text
            className={`ml-2 font-bold ${activeTab === "donor" ? "text-white" : "text-gray-400"}`}
          >
            Donated
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("seeker")}
          className={`flex-1 flex-row items-center justify-center py-3 rounded-xl ${
            activeTab === "seeker" ? "bg-red-800" : "bg-transparent"
          }`}
        >
          <ArrowDownLeft
            size={16}
            color={activeTab === "seeker" ? "white" : "#9ca3af"}
          />
          <Text
            className={`ml-2 font-bold ${activeTab === "seeker" ? "text-white" : "text-gray-400"}`}
          >
            Requested
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- CONTENT AREA --- */}
      <ScrollView
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <View className="py-20 items-center">
            <ActivityIndicator color="#991b1b" size="large" />
            <Text className="text-gray-400 font-bold mt-4 uppercase text-[10px] tracking-widest">
              Loading History...
            </Text>
          </View>
        ) : historyData[activeTab].length > 0 ? (
          <AnimatePresence>
            {historyData[activeTab].map((item) => (
              <MotiView
                key={item.id}
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white p-5 rounded-[30px] mb-4 border border-gray-100 shadow-sm"
              >
                {/* Header Row: Date & Status */}
                <View className="flex-row justify-between items-center mb-4">
                  <View className="flex-row items-center">
                    <Calendar size={12} color="#94a3b8" />
                    <Text className="text-gray-400 text-[11px] font-bold ml-1">
                      {item.date}
                    </Text>
                  </View>
                  <StatusBadge status={item.status} />
                </View>

                {/* Main Content Row */}
                <View className="flex-row items-center">
                  <View
                    className={`p-4 rounded-2xl ${activeTab === "donor" ? "bg-red-50" : "bg-blue-50"}`}
                  >
                    {activeTab === "donor" ? (
                      <Droplet size={24} color="#991b1b" fill="#991b1b" />
                    ) : (
                      <History size={24} color="#1d4ed8" />
                    )}
                  </View>

                  <View className="ml-4 flex-1">
                    <Text className="text-gray-400 text-[10px] font-black uppercase tracking-tighter">
                      {activeTab === "donor" ? "Requested By" : "Requested To"}
                    </Text>
                    <Text className="text-gray-900 font-black text-lg leading-tight">
                      {item.partner}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <Text className="text-red-600 font-black text-xs">
                        Group {item.bloodGroup}
                      </Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleDelete(activeTab, item.id)}
                    className="p-2 bg-gray-50 rounded-xl"
                  >
                    <Trash2 size={18} color="#cbd5e1" />
                  </TouchableOpacity>
                </View>
              </MotiView>
            ))}
          </AnimatePresence>
        ) : (
          /* Empty State */
          <View className="items-center justify-center py-20">
            <View className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-50 items-center">
              <History size={40} color="#e2e8f0" />
              <Text className="text-gray-300 font-black mt-4 uppercase tracking-[0.1em] text-center">
                No {activeTab} history yet
              </Text>
            </View>
          </View>
        )}
        <View className="h-24" />
      </ScrollView>
    </View>
  );
}
