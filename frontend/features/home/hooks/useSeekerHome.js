import { useState, useEffect, useCallback } from "react";
import { useRouter } from "expo-router";
import io from "socket.io-client";

import { useLocation } from "../../../context/LocationContext";
import { useAuth } from "../../../context/AuthContext";
import { PAKISTAN_LOCATIONS } from "../../../constants/pakistanLocations";

let socket = null;

export function useSeekerHome() {
  const router = useRouter();
  const { user, sharedToken: token } = useAuth();
  const {
    province,
    setProvince,
    city,
    setCity,
    bloodType,
    setBloodType,
    modalType,
    setModalType,
  } = useLocation();

  const [donors, setDonors] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestingId, setRequestingId] = useState(null);
  const [cancelLoadingId, setCancelLoadingId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  // Modal feedback state
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const showPopup = (title, message, type = "info") => {
    setFeedbackModal({ visible: true, title, message, type });
  };

  const hidePopup = () => {
    setFeedbackModal((prev) => ({ ...prev, visible: false }));
  };

  const isSearchDisabled = !province || !city || !bloodType;

  // 1. REAL-TIME SOCKET INTEGRATION
  useEffect(() => {
    if (user && token) {
      // Connect socket with authentication token
      socket = io(process.env.EXPO_PUBLIC_API_URL, {
        auth: { token },
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log("Socket connected for seeker:", socket.id);
        socket.emit("join_seeker_room", { userId: user._id || user.id });
      });

      // Real-time listener when a donor responds to a request
      socket.on("blood_request_status_updated", (data) => {
        const { requestId, donorId, status, message } = data;

        setDonors((prev) =>
          prev.map((donor) => {
            if (donor._id === donorId || donor.requestId === requestId) {
              return { ...donor, requestStatus: status };
            }
            return donor;
          }),
        );

        showPopup(
          `Request ${status.toUpperCase()}`,
          message || `Your blood request status changed to ${status}.`,
          status === "accepted" ? "success" : "error",
        );
      });

      // Real-time listener for donor status/availability changes
      socket.on("donor_availability_changed", ({ donorId, isAvailable }) => {
        setDonors((prev) =>
          prev.map((donor) =>
            donor._id === donorId ? { ...donor, isAvailable } : donor,
          ),
        );
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });

      return () => {
        if (socket) {
          socket.disconnect();
          socket = null;
        }
      };
    }
  }, [user, token]);

  // 2. CLEAR FUNCTIONALITY
  const handleClearAll = () => {
    setProvince("");
    setCity("");
    setBloodType("");
    setDonors([]);
    setHasSearched(false);
    setVisibleCount(6);
  };

  // 3. FETCH DONORS METHOD
  const fetchDonors = async () => {
    if (!province || !bloodType) return;
    setLoading(true);
    setHasSearched(true);
    setVisibleCount(6);

    try {
      const query = new URLSearchParams({
        province,
        district: city,
        bloodType,
      }).toString();

      const endpoint =
        user && token
          ? `${process.env.EXPO_PUBLIC_API_URL}/api/seeker/search?${query}`
          : `${process.env.EXPO_PUBLIC_API_URL}/api/seeker/hero/search?${query}`;

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await fetch(endpoint, { headers });
      const data = await response.json();
      console.log("Fetched donors:", data);
      if (response.ok) {
        setDonors(data.donors || []);
      } else {
        showPopup("Error", data?.message || "Failed to fetch donors.", "error");
      }
    } catch (err) {
      showPopup("Search Failed", "Unable to fetch donors right now.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 4. SEND BLOOD REQUEST METHOD
  const handleRequestBlood = async (donorId, bType) => {
    console.log(
      "Sending blood request to donor:",
      donorId,
      "for blood type:",
      bType,
    );
    setRequestingId(donorId);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/seeker/send-request/${donorId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ requestedBloodType: bType }),
        },
      );
      const result = await response.json();

      if (response.ok) {
        showPopup(
          "Request Sent",
          "Your request has been sent to the donor.",
          "success",
        );
        // Real-time local status transition
        setDonors((prev) =>
          prev.map((d) =>
            d._id === donorId
              ? {
                  ...d,
                  requestStatus: "pending",
                  requestId: result.request?._id,
                }
              : d,
          ),
        );

        // Emit socket event to notify donor server instantly
        if (socket) {
          socket.emit("send_blood_request", {
            donorId,
            requestId: result.request?._id,
            seekerId: user?._id,
          });
        }
      } else {
        showPopup(
          "Error",
          result?.message || "Failed to send request.",
          "error",
        );
      }
    } catch (err) {
      showPopup(
        "Error",
        "Failed to send request. Check your internet connection.",
        "error",
      );
    } finally {
      setRequestingId(null);
    }
  };

  // 5. CANCEL BLOOD REQUEST METHOD
  const handleCancelRequest = async (donorId) => {
    setCancelLoadingId(donorId);
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/seeker/cancel-request/${donorId}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        },
      );
      if (response.ok) {
        showPopup("Cancelled", "Your blood request was cancelled.", "info");
        // Real-time local status dynamic change
        setDonors((prev) =>
          prev.map((d) =>
            d._id === donorId ? { ...d, requestStatus: null } : d,
          ),
        );

        if (socket) {
          socket.emit("cancel_blood_request", { donorId, seekerId: user?._id });
        }
      } else {
        showPopup("Error", "Failed to cancel request.", "error");
      }
    } catch (err) {
      showPopup("Error", "Failed to cancel request.", "error");
    } finally {
      setCancelLoadingId(null);
    }
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return {
    router,
    province,
    setProvince,
    city,
    setCity,
    bloodType,
    setBloodType,
    modalType,
    setModalType,
    donors,
    hasSearched,
    loading,
    requestingId,
    cancelLoadingId,
    visibleCount,
    isSearchDisabled,
    feedbackModal,
    showPopup,
    hidePopup,
    handleClearAll,
    fetchDonors,
    handleRequestBlood,
    handleCancelRequest,
    handleLoadMore,
  };
}
