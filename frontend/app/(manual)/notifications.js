import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Bell,
  ArrowLeft,
  CheckCheck,
  Droplet,
  Info,
} from "lucide-react-native";
import AppText from "../../components/AppText";
import { useSocket } from "../../context/SocketContext";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function NotificationsScreen() {
  const router = useRouter();
  const socket = useSocket();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch Notifications List
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${apiUrl}/api/notifications/get-notifications`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setNotifications(data || []);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Listen for real-time incoming notification events
  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (newNotif) => {
      setNotifications((prev) => [newNotif, ...prev]);
    };

    socket.on("new_notification_received", handleNewNotification);

    return () => {
      socket.off("new_notification_received", handleNewNotification);
    };
  }, [socket]);

  // Mark single notification as read & navigate
  const handleNotifPress = async (item) => {
    if (!item.isRead) {
      try {
        await fetch(`${apiUrl}/api/notifications/mark-as-read/${item._id}`, {
          method: "PUT",
          credentials: "include",
        });
        setNotifications((prev) =>
          prev.map((n) => (n._id === item._id ? { ...n, isRead: true } : n)),
        );
      } catch (err) {
        console.error("Error marking as read:", err);
      }
    }

    if (item.link) {
      router.push(item.link);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  return (
    <View className="flex-1 bg-slate-50">
      {/* HEADER */}
      <View className="bg-red-700 pt-12 pb-5 px-4 flex-row items-center justify-between shadow-md">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/10 items-center justify-center"
        >
          <ArrowLeft size={20} color="white" />
        </TouchableOpacity>
        <AppText
          variant="black"
          className="text-white text-lg tracking-wide uppercase"
        >
          Notifications
        </AppText>
        <View className="w-10" />
      </View>

      {/* NOTIFICATIONS STREAM */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#dc2626"]}
          />
        }
      >
        {loading ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator color="#dc2626" size="large" />
            <AppText
              variant="bold"
              className="text-slate-400 text-xs mt-3 uppercase tracking-widest"
            >
              Loading Alerts...
            </AppText>
          </View>
        ) : notifications.length > 0 ? (
          notifications.map((item) => (
            <TouchableOpacity
              key={item._id}
              activeOpacity={0.8}
              onPress={() => handleNotifPress(item)}
              className={`p-4 mb-3 rounded-2xl border flex-row items-start ${
                item.isRead
                  ? "bg-white border-slate-100"
                  : "bg-red-50/60 border-red-100"
              }`}
            >
              {/* Left Icon Badge */}
              <View
                className={`w-10 h-10 rounded-xl items-center justify-center mr-3 mt-0.5 ${
                  item.isRead ? "bg-slate-100" : "bg-red-600"
                }`}
              >
                {item.message?.toLowerCase().includes("blood") ? (
                  <Droplet
                    size={18}
                    color={item.isRead ? "#64748b" : "#ffffff"}
                  />
                ) : (
                  <Info size={18} color={item.isRead ? "#64748b" : "#ffffff"} />
                )}
              </View>

              {/* Notification Details */}
              <View className="flex-1">
                <AppText
                  variant={item.isRead ? "bold" : "black"}
                  className={`text-xs leading-relaxed ${
                    item.isRead ? "text-slate-700" : "text-slate-900"
                  }`}
                >
                  {item.message}
                </AppText>
                <AppText
                  variant="bold"
                  className="text-[10px] text-slate-400 mt-2 uppercase tracking-wider"
                >
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {" • "}
                  {new Date(item.createdAt).toLocaleDateString()}
                </AppText>
              </View>

              {/* Unread Red Dot */}
              {!item.isRead && (
                <View className="w-2.5 h-2.5 rounded-full bg-red-600 ml-2 mt-1" />
              )}
            </TouchableOpacity>
          ))
        ) : (
          <View className="items-center justify-center py-20">
            <View className="w-16 h-16 bg-slate-100 rounded-full items-center justify-center mb-4">
              <Bell size={28} color="#94a3b8" />
            </View>
            <AppText
              variant="black"
              className="text-slate-800 text-sm uppercase tracking-wider text-center"
            >
              No Notifications
            </AppText>
            <AppText
              variant="bold"
              className="text-slate-400 text-xs text-center mt-1 px-8"
            >
              You're all caught up! New alerts regarding blood requests will
              appear here.
            </AppText>
          </View>
        )}
        <View className="h-10" />
      </ScrollView>
    </View>
  );
}
