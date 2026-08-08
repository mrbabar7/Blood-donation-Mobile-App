import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
  Modal,
  Linking,
  Platform,
  Clipboard,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import {
  Search,
  Building2,
  RefreshCw,
  XCircle,
  Phone,
  X,
  Copy,
  Check,
  Stethoscope,
  PlusCircle,
  List,
  ListFilter,
} from "lucide-react-native";
import BankCard from "./BankCard";
import SkeletonCard from "./ui/SkeletonCard";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function BankBrowseDirectory() {
  // Directory State
  const [banks, setBanks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [callModal, setCallModal] = useState(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);
  useEffect(() => {
    fetchBanks();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchBanks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/forms/bloodbanks`);
      if (res.data.success) {
        setBanks(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching banks:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCleanNumber = (num) => {
    if (!num) return null;
    const clean = num.toString().replace(/\D/g, "");
    return clean.length >= 5 ? clean : null;
  };

  const handleCall = (bank) => {
    const num = getCleanNumber(bank.phone || bank.whatsapp);
    if (!num) {
      setToast({ type: "error", message: "No valid contact number provided." });
      return;
    }

    let finalNum = num;
    if (finalNum.startsWith("92")) finalNum = "0" + finalNum.substring(2);

    Linking.openURL(`tel:${finalNum}`).catch(() => {
      setCallModal({ name: bank.name, number: finalNum });
    });
  };

  const quickCall = (name, num) => {
    Linking.openURL(`tel:${num}`).catch(() => {
      setCallModal({ name, number: num });
    });
  };

  const openWhatsApp = (num) => {
    const clean = getCleanNumber(num);
    if (!clean) return;
    Linking.openURL(`whatsapp://send?phone=${clean}`).catch(() => {
      Linking.openURL(`https://wa.me/${clean}`);
    });
  };

  const openMap = (bankName, address, phone, formType) => {
    const refinedQuery = `${bankName} (${formType || "Blood Bank"}), ${address} ${
      phone ? `, ${phone}` : ""
    }, Pakistan`;
    const destination = encodeURIComponent(refinedQuery);
    const mapUrl = Platform.select({
      ios: `maps:0,0?q=${destination}`,
      android: `geo:0,0?q=${destination}`,
    });

    Linking.openURL(mapUrl).catch(() => {
      const webMapUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
      Linking.openURL(webMapUrl);
    });
  };

  const copyNumber = (num) => {
    Clipboard.setString(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredBanks = banks.filter((bank) => {
    const query = searchQuery.toLowerCase();
    const matchesName = (bank.name || bank.bankName || "")
      .toLowerCase()
      .includes(query);
    const matchesAddress = (bank.address || "").toLowerCase().includes(query);
    const matchesServices = Array.isArray(bank.category)
      ? bank.category.some((cat) => cat.toLowerCase().includes(query))
      : false;
    return matchesName || matchesAddress || matchesServices;
  });

  return (
    <View style={styles.container}>
      {toast && (
        <View
          style={[
            styles.toast,
            toast.type === "success" ? styles.toastSuccess : styles.toastError,
          ]}
        >
          {toast.type === "success" ? (
            <CheckCircle2 color="#FFF" size={18} />
          ) : (
            <AlertCircle color="#FFF" size={18} />
          )}
          <Text style={styles.toastText}>{toast.message}</Text>
          <TouchableOpacity onPress={() => setToast(null)}>
            <X color="#FFF" size={16} />
          </TouchableOpacity>
        </View>
      )}
      {/* Header Controls */}
      <View style={styles.controlsSection}>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Search color="#64748B" size={18} style={styles.searchIcon} />
          <TextInput
            placeholder="Search by Blood bank name, city, or area..."
            placeholderTextColor="#94A3B8"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <XCircle size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Active Providers Counter Bar */}
        <View style={styles.counterBadge}>
          <View style={styles.activeDot} />
          <Text style={styles.counterText}>
            {loading
              ? "Fetching Blood Banks..."
              : `${filteredBanks.length} Blood Bank${
                  filteredBanks.length === 1 ? "" : "s"
                } Available`}
          </Text>
        </View>
      </View>

      {/* Skeleton Loading State */}
      {loading ? (
        <View style={styles.listContainer}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </View>
      ) : (
        <FlatList
          data={filteredBanks}
          keyExtractor={(item, index) =>
            item._id || item.id || index.toString()
          }
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <BankCard
              bank={item}
              onOpenMap={openMap}
              onSelect={setSelectedBank}
              onCall={handleCall}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Building2 size={36} color="#DC2626" />
              </View>
              <Text style={styles.emptyTitle}>No Blood Banks Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery !== ""
                  ? `We couldn't find any healthcare center matching "${searchQuery}". Check spelling or clear filters.`
                  : "No registered blood banks are currently available in the directory."}
              </Text>

              {searchQuery !== "" && (
                <TouchableOpacity
                  style={styles.resetSearchBtn}
                  onPress={() => setSearchQuery("")}
                  activeOpacity={0.8}
                >
                  <RefreshCw size={14} color="#FFFFFF" />
                  <Text style={styles.resetSearchBtnText}>Clear Search</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
      {/* DIRECT CALL MODAL */}
      <Modal visible={!!callModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setCallModal(null)}
            >
              <X size={18} color="#64748b" />
            </TouchableOpacity>

            <View style={styles.modalIconContainer}>
              <Phone size={24} color="#dc2626" />
            </View>

            <Text style={styles.modalTitle}>{callModal?.name}</Text>

            <View style={styles.numberBox}>
              <Text style={styles.numberText}>{callModal?.number}</Text>
              <TouchableOpacity onPress={() => copyNumber(callModal?.number)}>
                {copied ? (
                  <Check size={20} color="#059669" />
                ) : (
                  <Copy size={20} color="#94a3b8" />
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.modalFootnote}>
              Tap copy icon to save number or dial from phone app.
            </Text>
          </View>
        </View>
      </Modal>

      {/* SERVICES LIST MODAL */}
      <Modal visible={!!selectedBank} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <View style={styles.modalHeaderTitleGroup}>
                <Text style={styles.modalTitle}>
                  {selectedBank?.name || selectedBank?.bankName}
                </Text>
                <Text style={styles.modalSubTag}>Available Blood Banks</Text>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedBank(null)}
              >
                <X size={18} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.servicesScroll}>
              {selectedBank?.category && selectedBank.category.length > 0 ? (
                selectedBank.category.map((cat, idx) => (
                  <View key={idx} style={styles.serviceItem}>
                    <View style={styles.serviceIconWrap}>
                      <Stethoscope size={16} color="#dc2626" />
                    </View>
                    <Text style={styles.serviceText}>{cat}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyServicesText}>
                  No explicit service specified for this facility.
                </Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },

  controlsSection: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 42,
    color: "#0F172A",
    fontWeight: "600",
    fontSize: 14,
  },

  counterBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#16A34A",
    marginRight: 6,
  },
  counterText: {
    color: "#1E40AF",
    fontSize: 11,
    fontWeight: "600",
  },

  /* Professional Empty State */
  emptyContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
  },
  emptyIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#FEE2E2",
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#0F172A",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 18,
  },
  resetSearchBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DC2626",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginTop: 18,
    gap: 8,
  },
  resetSearchBtnText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    padding: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 20,
    zIndex: 10,
  },
  modalIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fef2f2",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1e293b",
    textAlign: "center",
  },
  numberBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    borderRadius: 14,
    padding: 12,
    marginVertical: 14,
  },
  numberText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#dc2626",
  },
  modalFootnote: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94a3b8",
    textAlign: "center",
    textTransform: "uppercase",
  },
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
    paddingBottom: 12,
    marginBottom: 14,
  },
  modalHeaderTitleGroup: {
    flex: 1,
    paddingRight: 30,
  },
  modalSubTag: {
    fontSize: 10,
    fontWeight: "900",
    color: "#dc2626",
    textTransform: "uppercase",
    marginTop: 2,
  },
  servicesScroll: {
    maxHeight: 250,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 12,
    marginBottom: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  serviceIconWrap: {
    padding: 6,
    backgroundColor: "#fef2f2",
    borderRadius: 8,
  },
  serviceText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    textTransform: "capitalize",
  },
  emptyServicesText: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
    marginVertical: 20,
  },

  toast: {
    position: "absolute",
    top: 50,
    left: 16,
    right: 16,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  toastSuccess: { backgroundColor: "#10B981" },
  toastError: { backgroundColor: "#EF4444" },
  toastText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 13,
    flex: 1,
    marginLeft: 8,
  },
});
