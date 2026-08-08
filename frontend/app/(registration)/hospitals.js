// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   Modal,
//   Linking,
//   Platform,
//   Alert,
//   Clipboard,
//   StyleSheet,
//   SafeAreaView,
// } from "react-native";
// import axios from "axios";
// import {
//   Phone,
//   X,
//   Copy,
//   Check,
//   Stethoscope,
//   PlusCircle,
//   List,
//   ListFilter,
// } from "lucide-react-native";
// import HospitalBrowseDirectory from "../components/HospitalBrowseDirectory";
// import HospitalForm from "../components/HospitalForm";

// const API_URL = process.env.EXPO_PUBLIC_API_URL;

// export default function HospitalsScreen() {
//   // Tab Switcher State: 'browse' | 'register'
//   const [activeTab, setActiveTab] = useState("browse");

//   // Directory State
//   const [hospitals, setHospitals] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [selectedHosp, setSelectedHosp] = useState(null);
//   const [callModal, setCallModal] = useState(null);
//   const [copied, setCopied] = useState(false);

//   useEffect(() => {
//     fetchHospitals();
//   }, []);

//   const fetchHospitals = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get(`${API_URL}/api/forms/hospitals`);
//       if (res.data.success) {
//         setHospitals(res.data.data);
//       }
//     } catch (err) {
//       console.error("Error fetching hospitals:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const quickCall = (name, num) => {
//     const phoneNumber = `tel:${num}`;
//     Linking.canOpenURL(phoneNumber)
//       .then((supported) => {
//         if (supported) {
//           Linking.openURL(phoneNumber);
//         } else {
//           setCallModal({ name, number: num });
//         }
//       })
//       .catch(() => setCallModal({ name, number: num }));
//   };

//   const openMap = (hospName, address, phone, formType) => {
//     const refinedQuery = `${hospName} (${formType || "Hospital"}), ${address} ${
//       phone ? `, ${phone}` : ""
//     }, Pakistan`;
//     const destination = encodeURIComponent(refinedQuery);
//     const mapUrl = Platform.select({
//       ios: `maps:0,0?q=${destination}`,
//       android: `geo:0,0?q=${destination}`,
//     });

//     Linking.openURL(mapUrl).catch(() => {
//       const webMapUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
//       Linking.openURL(webMapUrl);
//     });
//   };

//   const handleCall = (hosp) => {
//     let rawNumber = hosp.whatsapp || hosp.phone || "";
//     if (!rawNumber) {
//       Alert.alert(
//         "Contact Unavailable",
//         "No contact number available for this facility.",
//       );
//       return;
//     }

//     let number = rawNumber.replace(/\D/g, "");
//     if (number.startsWith("92")) {
//       number = "0" + number.substring(2);
//     }

//     quickCall(hosp.name || hosp.hospitalName || "Hospital", number);
//   };

//   const copyNumber = (num) => {
//     Clipboard.setString(num);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.tabContainer}>
//           <TouchableOpacity
//             style={[
//               styles.tabButton,
//               activeTab === "browse" && styles.tabButtonActive,
//             ]}
//             onPress={() => setActiveTab("browse")}
//           >
//             <ListFilter
//               size={15}
//               color={activeTab === "browse" ? "#2563EB" : "#64748B"}
//             />
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === "browse" && styles.tabTextActive,
//               ]}
//             >
//               Browse Directory
//             </Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[
//               styles.tabButton,
//               activeTab === "register" && styles.tabButtonActive,
//             ]}
//             onPress={() => setActiveTab("register")}
//           >
//             <PlusCircle
//               size={15}
//               color={activeTab === "register" ? "#2563EB" : "#64748B"}
//             />
//             <Text
//               style={[
//                 styles.tabText,
//                 activeTab === "register" && styles.tabTextActive,
//               ]}
//             >
//               Register Hospital
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* OPTION 1: BROWSE DIRECTORY */}
//       {activeTab === "browse" && (
//         <HospitalBrowseDirectory
//           hospitals={hospitals}
//           searchQuery={searchQuery}
//           setSearchQuery={setSearchQuery}
//           loading={loading}
//           quickCall={quickCall}
//           openMap={openMap}
//           handleCall={handleCall}
//           setSelectedHosp={setSelectedHosp}
//         />
//       )}

//       {/* OPTION 2: HOSPITAL REGISTRATION FORM */}
//       {activeTab === "register" && <HospitalForm onSuccess={fetchHospitals} />}

//       {/* DIRECT CALL MODAL */}
//       <Modal visible={!!callModal} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <TouchableOpacity
//               style={styles.closeBtn}
//               onPress={() => setCallModal(null)}
//             >
//               <X size={18} color="#64748b" />
//             </TouchableOpacity>

//             <View style={styles.modalIconContainer}>
//               <Phone size={24} color="#dc2626" />
//             </View>

//             <Text style={styles.modalTitle}>{callModal?.name}</Text>

//             <View style={styles.numberBox}>
//               <Text style={styles.numberText}>{callModal?.number}</Text>
//               <TouchableOpacity onPress={() => copyNumber(callModal?.number)}>
//                 {copied ? (
//                   <Check size={20} color="#059669" />
//                 ) : (
//                   <Copy size={20} color="#94a3b8" />
//                 )}
//               </TouchableOpacity>
//             </View>

//             <Text style={styles.modalFootnote}>
//               Tap copy icon to save number or dial from phone app.
//             </Text>
//           </View>
//         </View>
//       </Modal>

//       {/* SERVICES LIST MODAL */}
//       <Modal visible={!!selectedHosp} transparent animationType="slide">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeaderRow}>
//               <View style={styles.modalHeaderTitleGroup}>
//                 <Text style={styles.modalTitle}>
//                   {selectedHosp?.name || selectedHosp?.hospitalName}
//                 </Text>
//                 <Text style={styles.modalSubTag}>Available Services</Text>
//               </View>
//               <TouchableOpacity
//                 style={styles.closeBtn}
//                 onPress={() => setSelectedHosp(null)}
//               >
//                 <X size={18} color="#64748b" />
//               </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.servicesScroll}>
//               {selectedHosp?.category && selectedHosp.category.length > 0 ? (
//                 selectedHosp.category.map((cat, idx) => (
//                   <View key={idx} style={styles.serviceItem}>
//                     <View style={styles.serviceIconWrap}>
//                       <Stethoscope size={16} color="#dc2626" />
//                     </View>
//                     <Text style={styles.serviceText}>{cat}</Text>
//                   </View>
//                 ))
//               ) : (
//                 <Text style={styles.emptyServicesText}>
//                   No explicit services specified for this facility.
//                 </Text>
//               )}
//             </ScrollView>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//   },
//   header: {
//     backgroundColor: "#FFFFFF",
//     paddingHorizontal: 16,
//     paddingTop: 12,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#E2E8F0",
//   },

//   tabContainer: {
//     flexDirection: "row",
//     backgroundColor: "#F1F5F9",
//     borderRadius: 12,
//     padding: 4,
//     marginTop: 8,
//   },
//   tabButton: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 8,
//     borderRadius: 8,
//     gap: 6,
//   },
//   tabButtonActive: {
//     backgroundColor: "#FFFFFF",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.08,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   tabText: {
//     color: "#64748B",
//     fontSize: 12,
//     fontWeight: "600",
//   },
//   tabTextActive: {
//     color: "#2563EB",
//     fontWeight: "700",
//   },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(15, 23, 42, 0.6)",
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   modalContent: {
//     width: "100%",
//     backgroundColor: "#ffffff",
//     borderRadius: 24,
//     padding: 20,
//     position: "relative",
//   },
//   closeBtn: {
//     position: "absolute",
//     top: 14,
//     right: 14,
//     padding: 6,
//     backgroundColor: "#f1f5f9",
//     borderRadius: 20,
//     zIndex: 10,
//   },
//   modalIconContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: "#fef2f2",
//     alignItems: "center",
//     justifyContent: "center",
//     alignSelf: "center",
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: "#fee2e2",
//   },
//   modalTitle: {
//     fontSize: 16,
//     fontWeight: "900",
//     color: "#1e293b",
//     textAlign: "center",
//   },
//   numberBox: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#f8fafc",
//     borderWidth: 1,
//     borderColor: "#e2e8f0",
//     borderStyle: "dashed",
//     borderRadius: 14,
//     padding: 12,
//     marginVertical: 14,
//   },
//   numberText: {
//     fontSize: 18,
//     fontWeight: "900",
//     color: "#dc2626",
//   },
//   modalFootnote: {
//     fontSize: 10,
//     fontWeight: "700",
//     color: "#94a3b8",
//     textAlign: "center",
//     textTransform: "uppercase",
//   },
//   modalHeaderRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     borderBottomWidth: 1,
//     borderBottomColor: "#f1f5f9",
//     paddingBottom: 12,
//     marginBottom: 14,
//   },
//   modalHeaderTitleGroup: {
//     flex: 1,
//     paddingRight: 30,
//   },
//   modalSubTag: {
//     fontSize: 10,
//     fontWeight: "900",
//     color: "#dc2626",
//     textTransform: "uppercase",
//     marginTop: 2,
//   },
//   servicesScroll: {
//     maxHeight: 250,
//   },
//   serviceItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#f8fafc",
//     padding: 10,
//     borderRadius: 12,
//     marginBottom: 8,
//     gap: 10,
//     borderWidth: 1,
//     borderColor: "#f1f5f9",
//   },
//   serviceIconWrap: {
//     padding: 6,
//     backgroundColor: "#fef2f2",
//     borderRadius: 8,
//   },
//   serviceText: {
//     fontSize: 12,
//     fontWeight: "700",
//     color: "#334155",
//     textTransform: "capitalize",
//   },
//   emptyServicesText: {
//     fontSize: 12,
//     color: "#94a3b8",
//     textAlign: "center",
//     marginVertical: 20,
//   },
// });

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Linking,
  Platform,
  Alert,
  Clipboard,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import axios from "axios";
import {
  Phone,
  X,
  Copy,
  Check,
  Stethoscope,
  PlusCircle,
  List,
  ListFilter,
} from "lucide-react-native";
import HospitalBrowseDirectory from "../components/HospitalBrowseDirectory";
import HospitalForm from "../components/HospitalForm";

export default function HospitalsScreen() {
  // Tab Switcher State: 'browse' | 'register'
  const [activeTab, setActiveTab] = useState("browse");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "browse" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("browse")}
          >
            <ListFilter
              size={15}
              color={activeTab === "browse" ? "#2563EB" : "#64748B"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "browse" && styles.tabTextActive,
              ]}
            >
              Browse Directory
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "register" && styles.tabButtonActive,
            ]}
            onPress={() => setActiveTab("register")}
          >
            <PlusCircle
              size={15}
              color={activeTab === "register" ? "#2563EB" : "#64748B"}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "register" && styles.tabTextActive,
              ]}
            >
              Register Hospital
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* OPTION 1: BROWSE DIRECTORY */}
      {activeTab === "browse" && <HospitalBrowseDirectory />}

      {/* OPTION 2: HOSPITAL REGISTRATION FORM */}
      {activeTab === "register" && <HospitalForm />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 4,
    marginTop: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "#2563EB",
    fontWeight: "700",
  },
});
