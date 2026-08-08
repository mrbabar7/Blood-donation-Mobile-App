import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { Trash2 } from "lucide-react-native";
import { useRouter } from "expo-router";

import AppText from "../../../components/AppText";
import ActionModal from "../../../components/ActionModal";
import { useSocket } from "../../../context/SocketContext";

import RoleToggle from "../components/RoleToggle";
import StatusFilterList from "../components/StatusFilterList";
import RequestCard from "../components/RequestCard";
import EmptyState from "../components/EmptyState";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

export default function RequestsScreen() {
  const router = useRouter();
  const { socket } = useSocket();

  // Role State: "seeker" | "donor"
  const [roleMode, setRoleMode] = useState("seeker");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Data & Loading States
  const [seekerRequests, setSeekerRequests] = useState([]);
  const [donorRequests, setDonorRequests] = useState([]);
  const [isDonor, setIsDonor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Processing Action State
  const [processingId, setProcessingId] = useState(null);
  const [actionType, setActionType] = useState("");

  // Modal Control
  const [modalConfig, setModalConfig] = useState({
    visible: false,
    title: "",
    message: "",
    action: null,
  });
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch Requests Data
  //   const loadData = useCallback(async () => {
  //     try {
  //       if (roleMode === "seeker") {
  //         const res = await fetch(`${apiUrl}/api/seeker/my-requests`, {
  //           credentials: "include",
  //         });
  //         const data = await res.json();
  //         if (res.ok) setSeekerRequests(data || []);
  //       } else {
  //         const statusRes = await fetch(`${apiUrl}/api/donors/status`, {
  //           credentials: "include",
  //         });
  //         const statusData = await statusRes.json();
  //         if (statusData.registered) {
  //           setIsDonor(true);
  //           const reqRes = await fetch(`${apiUrl}/api/donors/my-requests`, {
  //             credentials: "include",
  //           });
  //           const reqData = await reqRes.json();
  //           if (reqRes.ok) setDonorRequests(reqData || []);
  //         } else {
  //           setIsDonor(false);
  //         }
  //       }
  //     } catch (err) {
  //       console.error("Data loading error:", err);
  //     } finally {
  //       setLoading(false);
  //       setRefreshing(false);
  //     }
  //   }, [roleMode]);

  const loadData = useCallback(async () => {
    try {
      if (roleMode === "seeker") {
        const res = await fetch(`${apiUrl}/api/seeker/my-requests`, {
          credentials: "include",
        });
        const data = await res.json();

        // Safeguard: Ensure state is only set to an Array
        if (res.ok) {
          const listData = Array.isArray(data) ? data : data?.requests || [];
          setSeekerRequests(listData);
        } else {
          setSeekerRequests([]);
        }
      } else {
        const statusRes = await fetch(`${apiUrl}/api/donors/status`, {
          credentials: "include",
        });
        const statusData = await statusRes.json();

        if (statusData?.registered) {
          setIsDonor(true);
          const reqRes = await fetch(`${apiUrl}/api/donors/my-requests`, {
            credentials: "include",
          });
          const reqData = await reqRes.json();
          console.log("seeker rquests are :", reqData);
          if (reqRes.ok) {
            const listData = Array.isArray(reqData)
              ? reqData
              : reqData?.requests || [];
            setDonorRequests(listData);
          } else {
            setDonorRequests([]);
          }
        } else {
          setIsDonor(false);
          setDonorRequests([]);
        }
      }
    } catch (err) {
      console.error("Data loading error:", err);
      setSeekerRequests([]);
      setDonorRequests([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [roleMode]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  // ⚡ REAL-TIME SOCKET & NOTIFICATIONS LISTENER
  useEffect(() => {
    if (!socket) return;

    // Handle real-time status changes directly in state without forcing full page reload
    const handleStatusUpdate = (payload) => {
      const { requestId, status } = payload || {};
      if (!requestId) {
        loadData();
        return;
      }

      setSeekerRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status } : r)),
      );
      setDonorRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status } : r)),
      );
    };

    const handleGeneralUpdate = () => {
      loadData();
    };

    socket.on("request_status_updated", handleStatusUpdate);
    socket.on("new_request_received", handleGeneralUpdate);
    socket.on("new_notification_received", handleGeneralUpdate);

    return () => {
      socket.off("request_status_updated", handleStatusUpdate);
      socket.off("new_request_received", handleGeneralUpdate);
      socket.off("new_notification_received", handleGeneralUpdate);
    };
  }, [socket, loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Seeker Actions
  const promptDeleteSingle = (requestId) => {
    setModalConfig({
      visible: true,
      title: "Remove Record",
      message: "Are you sure you want to delete this request record?",
      action: async () => {
        setModalLoading(true);
        try {
          const res = await fetch(
            `${apiUrl}/api/seeker/delete-request/${requestId}`,
            {
              method: "DELETE",
              credentials: "include",
            },
          );
          if (res.ok) {
            setSeekerRequests((prev) =>
              prev.filter((r) => r._id !== requestId),
            );
          }
        } catch (e) {
          console.error(e);
        } finally {
          setModalLoading(false);
          setModalConfig({ visible: false });
        }
      },
    });
  };

  const promptClearCategory = (status) => {
    setModalConfig({
      visible: true,
      title: "Clear History",
      message: `Are you sure you want to permanently remove all ${status} records?`,
      action: async () => {
        setModalLoading(true);
        try {
          await fetch(`${apiUrl}/api/seeker/clear-history/${status}`, {
            method: "DELETE",
            credentials: "include",
          });
          setSeekerRequests((prev) => prev.filter((r) => r.status !== status));
        } catch (e) {
          console.error(e);
        } finally {
          setModalLoading(false);
          setModalConfig({ visible: false });
        }
      },
    });
  };

  // Donor Actions (Accept / Reject / Complete)
  const handleDonorAction = async (requestId, action) => {
    setProcessingId(requestId);
    setActionType(action);
    try {
      const res = await fetch(`${apiUrl}/api/donors/${action}/${requestId}`, {
        method: "PUT",
        credentials: "include",
      });

      if (res.ok) {
        const newStatus =
          action === "accept"
            ? "accepted"
            : action === "reject"
              ? "rejected"
              : action;

        setDonorRequests((prev) =>
          prev.map((r) =>
            r._id === requestId ? { ...r, status: newStatus } : r,
          ),
        );

        // Emit socket notification to instant-sync seeker UI
        if (socket) {
          socket.emit("update_request_status", {
            requestId,
            status: newStatus,
          });
        }
      }
    } catch (e) {
      console.error("Donor action error:", e);
    } finally {
      setProcessingId(null);
      setActionType("");
    }
  };

  //   const currentList = roleMode === "seeker" ? seekerRequests : donorRequests;
  //   const filteredRequests =
  //     statusFilter === "ALL"
  //       ? currentList
  //       : currentList.filter((item) => item.status === statusFilter);

  // Ensure currentList is ALWAYS an array, even if API returned an object or undefined
  const rawList = roleMode === "seeker" ? seekerRequests : donorRequests;
  const currentList = Array.isArray(rawList) ? rawList : [];

  const filteredRequests =
    statusFilter === "ALL"
      ? currentList
      : currentList.filter((item) => item?.status === statusFilter);

  return (
    <View style={styles.screenContainer}>
      {/* 1. TOP CONTROLS */}
      <View style={styles.topBar}>
        <RoleToggle
          roleMode={roleMode}
          setRoleMode={setRoleMode}
          setStatusFilter={setStatusFilter}
        />

        {(roleMode === "seeker" || (roleMode === "donor" && isDonor)) && (
          <StatusFilterList
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />
        )}
      </View>

      {/* 2. BULK CLEAR BUTTON */}
      {roleMode === "seeker" &&
        (statusFilter === "completed" || statusFilter === "rejected") &&
        filteredRequests.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => promptClearCategory(statusFilter)}
            style={styles.bulkClearBtn}
          >
            <Trash2 size={14} color="#dc2626" />
            <AppText variant="black" style={styles.bulkClearText}>
              Clear All {statusFilter} Records
            </AppText>
          </TouchableOpacity>
        )}

      {/* 3. MAIN LIST STREAM */}
      <ScrollView
        style={styles.scrollContainer}
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
          <View style={styles.loaderContainer}>
            <ActivityIndicator color="#dc2626" size="large" />
            <AppText variant="bold" style={styles.loaderText}>
              Fetching records...
            </AppText>
          </View>
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map((item) => (
            <RequestCard
              key={item._id}
              item={item}
              role={roleMode}
              onDelete={promptDeleteSingle}
              onNavigateDetails={(donorId, reqId) =>
                router.push(`/(dashboard)/donor-details/${donorId}/${reqId}`)
              }
              onDonorAction={handleDonorAction}
              processingId={processingId}
              actionType={actionType}
            />
          ))
        ) : (
          <EmptyState
            roleMode={roleMode}
            isDonor={isDonor}
            statusFilter={statusFilter}
            onRegisterDonor={() => router.push("/(dashboard)/profile")}
          />
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* 4. MODAL CONFIRMATION */}
      <ActionModal
        visible={modalConfig.visible}
        title={modalConfig.title}
        message={modalConfig.message}
        onConfirm={modalConfig.action}
        onCancel={() => setModalConfig({ visible: false })}
        loading={modalLoading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  topBar: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  bulkClearBtn: {
    marginHorizontal: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fef2f2",
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fecdd3",
  },
  bulkClearText: {
    color: "#dc2626",
    marginLeft: 8,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  loaderContainer: {
    paddingVertical: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  loaderText: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 12,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  bottomSpacer: {
    height: 48,
  },
});
