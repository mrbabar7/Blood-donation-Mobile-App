// import React from "react";
// import {
//   View,
//   ScrollView,
//   TouchableOpacity,
//   ActivityIndicator,
// } from "react-native";
// import {
//   MapPin,
//   Droplet,
//   ChevronDown,
//   Filter,
//   Search,
//   RotateCcw,
//   UserX,
//   ChevronRight,
// } from "lucide-react-native";

// import AppText from "../../../components/AppText";
// import SelectionModal from "../../../components/SelectionModal";
// import DonorCard from "./DonorCard";
// import QuickServicesRow from "./QuickServicesRow";
// import SeekerFeedbackModal from "./SeekerFeedbackModal";
// import { useSeekerHome } from "../hooks/useSeekerHome";
// import { styles } from "../styles/seekerHomeStyles";

// import {
//   PAKISTAN_LOCATIONS,
//   BLOOD_GROUPS,
// } from "../../../constants/pakistanLocations";

// export default function SeekerInterfaceUI() {
//   const {
//     router,
//     province,
//     city,
//     bloodType,
//     modalType,
//     setModalType,
//     setProvince,
//     setCity,
//     setBloodType,
//     donors,
//     hasSearched,
//     loading,
//     requestingId,
//     cancelLoadingId,
//     visibleCount,
//     isSearchDisabled,
//     feedbackModal,
//     showPopup,
//     hidePopup,
//     handleClearAll,
//     fetchDonors,
//     handleRequestBlood,
//     handleCancelRequest,
//     handleLoadMore,
//   } = useSeekerHome();

//   const availableProvinces = Object.keys(PAKISTAN_LOCATIONS || {});
//   const availableCities =
//     province && PAKISTAN_LOCATIONS[province]
//       ? PAKISTAN_LOCATIONS[province]
//       : [];

//   const visibleDonors = donors?.slice(0, visibleCount);

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         <View style={styles.wrapper}>
//           {/* QUICK SERVICES ROW */}
//           <QuickServicesRow onNavigate={(route) => router.push(route)} />

//           {/* SEARCH SELECTION CARD */}
//           <View style={styles.searchCard}>
//             <View style={styles.headerBox}>
//               <AppText variant="black" style={styles.headerTitle}>
//                 Search for Donors
//               </AppText>
//               <AppText variant="medium" style={styles.headerSubtitle}>
//                 Find available blood donors in your area
//               </AppText>
//             </View>

//             <View style={styles.inputsWrapper}>
//               {/* Province Selector */}
//               <TouchableOpacity
//                 activeOpacity={0.7}
//                 onPress={() => setModalType("province")}
//                 style={[
//                   styles.selectButton,
//                   province && styles.selectButtonActive,
//                 ]}
//               >
//                 <View style={styles.iconContainer}>
//                   <Filter size={18} color={province ? "#dc2626" : "#94a3b8"} />
//                 </View>
//                 <AppText
//                   variant="bold"
//                   style={[
//                     styles.selectText,
//                     !province && styles.selectTextPlaceholder,
//                   ]}
//                 >
//                   {province || "Select Province"}
//                 </AppText>
//                 <ChevronDown size={18} color="#94a3b8" />
//               </TouchableOpacity>

//               {/* City Selector */}
//               <TouchableOpacity
//                 activeOpacity={0.7}
//                 onPress={() => {
//                   if (!province) {
//                     showPopup(
//                       "Selection Required",
//                       "Please choose a province before selecting a city.",
//                       "info",
//                     );
//                     return;
//                   }
//                   setModalType("city");
//                 }}
//                 style={[
//                   styles.selectButton,
//                   city && styles.selectButtonActive,
//                   !province && styles.selectButtonDisabled,
//                 ]}
//               >
//                 <View style={styles.iconContainer}>
//                   <MapPin size={18} color={city ? "#dc2626" : "#94a3b8"} />
//                 </View>
//                 <AppText
//                   variant="bold"
//                   style={[
//                     styles.selectText,
//                     !city && styles.selectTextPlaceholder,
//                   ]}
//                 >
//                   {city || (province ? "Select City" : "Select Province First")}
//                 </AppText>
//                 <ChevronDown size={18} color="#94a3b8" />
//               </TouchableOpacity>

//               {/* Blood Group Selector */}
//               <TouchableOpacity
//                 activeOpacity={0.7}
//                 onPress={() => setModalType("bloodType")}
//                 style={[
//                   styles.selectButton,
//                   bloodType && styles.selectButtonActive,
//                 ]}
//               >
//                 <View style={styles.iconContainer}>
//                   <Droplet
//                     size={18}
//                     color={bloodType ? "#dc2626" : "#94a3b8"}
//                     fill={bloodType ? "#dc2626" : "transparent"}
//                   />
//                 </View>
//                 <AppText
//                   variant="bold"
//                   style={[
//                     styles.selectText,
//                     !bloodType && styles.selectTextPlaceholder,
//                   ]}
//                 >
//                   {bloodType || "Select Blood Group"}
//                 </AppText>
//                 <ChevronDown size={18} color="#94a3b8" />
//               </TouchableOpacity>

//               {/* Search Action Button */}
//               <TouchableOpacity
//                 activeOpacity={0.85}
//                 onPress={fetchDonors}
//                 disabled={isSearchDisabled || loading}
//                 style={[
//                   styles.searchSubmitBtn,
//                   isSearchDisabled && styles.searchSubmitBtnDisabled,
//                 ]}
//               >
//                 {loading ? (
//                   <ActivityIndicator color="white" />
//                 ) : (
//                   <>
//                     <Search size={18} color="white" />
//                     <AppText variant="black" style={styles.searchSubmitBtnText}>
//                       Find Donors
//                     </AppText>
//                   </>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>

//           {/* RESULTS SECTION */}
//           {hasSearched && (
//             <View style={styles.resultsHeaderRow}>
//               <View style={styles.resultsTitleGroup}>
//                 <View style={styles.activeDot} />
//                 <AppText variant="bold" style={styles.resultsTitle}>
//                   Showing Results
//                 </AppText>
//                 <View style={styles.badge}>
//                   <AppText variant="black" style={styles.badgeText}>
//                     {donors.length} {donors.length === 1 ? "Donor" : "Donors"}
//                   </AppText>
//                 </View>
//               </View>

//               <TouchableOpacity
//                 onPress={handleClearAll}
//                 activeOpacity={0.7}
//                 style={styles.clearBtn}
//               >
//                 <RotateCcw size={13} color="#64748b" />
//                 <AppText variant="bold" style={styles.clearBtnText}>
//                   Clear
//                 </AppText>
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* DONORS LIST RENDERING */}
//           {hasSearched && donors.length === 0 && !loading ? (
//             <View style={styles.emptyBox}>
//               <UserX size={44} color="#94a3b8" />
//               <AppText variant="bold" style={styles.emptyTitle}>
//                 No Donors Found
//               </AppText>
//               <AppText variant="medium" style={styles.emptySubtitle}>
//                 Try changing your location or blood group to find available
//                 donors.
//               </AppText>
//             </View>
//           ) : (
//             visibleDonors.map((donor) => (
//               <DonorCard
//                 key={donor._id}
//                 donor={donor}
//                 onRequest={() => handleRequestBlood(donor._id, donor.bloodType)}
//                 onCancel={() => handleCancelRequest(donor._id)}
//                 isRequesting={requestingId === donor._id}
//                 isCanceling={cancelLoadingId === donor._id}
//               />
//             ))
//           )}

//           {/* LOAD MORE BUTTON */}
//           {hasSearched && visibleCount < donors.length && (
//             <TouchableOpacity
//               activeOpacity={0.8}
//               onPress={handleLoadMore}
//               style={styles.loadMoreBtn}
//             >
//               <AppText variant="bold" style={styles.loadMoreText}>
//                 Load More Donors ({donors.length - visibleCount} left)
//               </AppText>
//               <ChevronRight size={18} color="#334155" />
//             </TouchableOpacity>
//           )}
//         </View>
//       </ScrollView>

//       {/* MODALS */}
//       <SelectionModal
//         visible={modalType === "province"}
//         title="Select Province"
//         data={availableProvinces}
//         onSelect={(item) => {
//           setProvince(item);
//           setCity("");
//           setModalType(null);
//         }}
//         onClose={() => setModalType(null)}
//       />

//       <SelectionModal
//         visible={modalType === "city"}
//         title="Select City"
//         data={availableCities}
//         onSelect={(item) => {
//           setCity(item);
//           setModalType(null);
//         }}
//         onClose={() => setModalType(null)}
//       />

//       <SelectionModal
//         visible={modalType === "bloodType"}
//         title="Select Blood Group"
//         data={BLOOD_GROUPS}
//         onSelect={(item) => {
//           setBloodType(item);
//           setModalType(null);
//         }}
//         onClose={() => setModalType(null)}
//       />

//       <SeekerFeedbackModal
//         visible={feedbackModal.visible}
//         title={feedbackModal.title}
//         message={feedbackModal.message}
//         type={feedbackModal.type}
//         onClose={hidePopup}
//       />
//     </View>
//   );
// }

import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import {
  MapPin,
  Droplet,
  ChevronDown,
  Filter,
  Search,
  RotateCcw,
  UserX,
  ChevronRight,
  Wifi,
  WifiOff,
} from "lucide-react-native";

import AppText from "../../../components/AppText";
import SelectionModal from "../../../components/SelectionModal";
import DonorCard from "./DonorCard";
import QuickServicesRow from "./QuickServicesRow";
import SeekerFeedbackModal from "./SeekerFeedbackModal";
import { useSeekerHome } from "../hooks/useSeekerHome";
import { styles } from "../styles/seekerHomeStyles";

import {
  PAKISTAN_LOCATIONS,
  BLOOD_GROUPS,
} from "../../../constants/pakistanLocations";

export default function SeekerInterfaceUI() {
  const {
    router,
    province,
    city,
    bloodType,
    modalType,
    setModalType,
    setProvince,
    setCity,
    setBloodType,
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
  } = useSeekerHome();

  const availableProvinces = Object.keys(PAKISTAN_LOCATIONS || {});
  const availableCities =
    province && PAKISTAN_LOCATIONS[province]
      ? PAKISTAN_LOCATIONS[province]
      : [];

  const visibleDonors = donors?.slice(0, visibleCount) || [];

  // Separate fetched donors into Online & Offline lists
  const onlineDonors = visibleDonors.filter(
    (donor) => donor.isOnline === true || donor.status === "online",
  );
  const offlineDonors = visibleDonors.filter(
    (donor) => !(donor.isOnline === true || donor.status === "online"),
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.wrapper}>
          {/* QUICK SERVICES ROW */}
          <QuickServicesRow onNavigate={(route) => router.push(route)} />

          {/* SEARCH SELECTION CARD */}
          <View style={styles.searchCard}>
            <View style={styles.headerBox}>
              <AppText variant="black" style={styles.headerTitle}>
                Search for Donors
              </AppText>
              <AppText variant="medium" style={styles.headerSubtitle}>
                Find available blood donors in your area
              </AppText>
            </View>

            <View style={styles.inputsWrapper}>
              {/* Province Selector */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setModalType("province")}
                style={[
                  styles.selectButton,
                  province && styles.selectButtonActive,
                ]}
              >
                <View style={styles.iconContainer}>
                  <Filter size={18} color={province ? "#dc2626" : "#94a3b8"} />
                </View>
                <AppText
                  variant="bold"
                  style={[
                    styles.selectText,
                    !province && styles.selectTextPlaceholder,
                  ]}
                >
                  {province || "Select Province"}
                </AppText>
                <ChevronDown size={18} color="#94a3b8" />
              </TouchableOpacity>

              {/* City Selector */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  if (!province) {
                    showPopup(
                      "Selection Required",
                      "Please choose a province before selecting a city.",
                      "info",
                    );
                    return;
                  }
                  setModalType("city");
                }}
                style={[
                  styles.selectButton,
                  city && styles.selectButtonActive,
                  !province && styles.selectButtonDisabled,
                ]}
              >
                <View style={styles.iconContainer}>
                  <MapPin size={18} color={city ? "#dc2626" : "#94a3b8"} />
                </View>
                <AppText
                  variant="bold"
                  style={[
                    styles.selectText,
                    !city && styles.selectTextPlaceholder,
                  ]}
                >
                  {city || (province ? "Select City" : "Select Province First")}
                </AppText>
                <ChevronDown size={18} color="#94a3b8" />
              </TouchableOpacity>

              {/* Blood Group Selector */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setModalType("bloodType")}
                style={[
                  styles.selectButton,
                  bloodType && styles.selectButtonActive,
                ]}
              >
                <View style={styles.iconContainer}>
                  <Droplet
                    size={18}
                    color={bloodType ? "#dc2626" : "#94a3b8"}
                    fill={bloodType ? "#dc2626" : "transparent"}
                  />
                </View>
                <AppText
                  variant="bold"
                  style={[
                    styles.selectText,
                    !bloodType && styles.selectTextPlaceholder,
                  ]}
                >
                  {bloodType || "Select Blood Group"}
                </AppText>
                <ChevronDown size={18} color="#94a3b8" />
              </TouchableOpacity>

              {/* Search Action Button */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={fetchDonors}
                disabled={isSearchDisabled || loading}
                style={[
                  styles.searchSubmitBtn,
                  isSearchDisabled && styles.searchSubmitBtnDisabled,
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Search size={18} color="white" />
                    <AppText variant="black" style={styles.searchSubmitText}>
                      Search Donors
                    </AppText>
                  </>
                )}
              </TouchableOpacity>

              {/* Clear Selection Button */}
              {(province || city || bloodType) && (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleClearAll}
                  style={styles.clearBtn}
                >
                  <RotateCcw size={14} color="#64748b" />
                  <AppText variant="bold" style={styles.clearBtnText}>
                    Reset Search Filters
                  </AppText>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ================= DONORS LISTING SECTIONS ================= */}
          {hasSearched && (
            <View style={sectionStyles.resultsContainer}>
              {loading ? (
                <View style={sectionStyles.loadingBox}>
                  <ActivityIndicator size="large" color="#dc2626" />
                  <AppText variant="medium" style={sectionStyles.loadingText}>
                    Searching for nearby donors...
                  </AppText>
                </View>
              ) : visibleDonors.length === 0 ? (
                /* No Donors Found */
                <View style={sectionStyles.emptyBox}>
                  <UserX size={48} color="#cbd5e1" />
                  <AppText variant="black" style={sectionStyles.emptyTitle}>
                    No Donors Found
                  </AppText>
                  <AppText variant="medium" style={sectionStyles.emptySubtitle}>
                    We couldn't find any donors matching your filter criteria.
                  </AppText>
                </View>
              ) : (
                <>
                  {/* SECTION 1: ONLINE DONORS */}
                  {onlineDonors.length > 0 && (
                    <View style={sectionStyles.sectionGroup}>
                      <View style={sectionStyles.sectionHeaderRow}>
                        <View style={sectionStyles.sectionHeaderTitleBox}>
                          <View style={sectionStyles.onlineDot} />
                          <AppText
                            variant="black"
                            style={sectionStyles.sectionHeaderTitle}
                          >
                            Online Donors
                          </AppText>
                        </View>
                        <View style={sectionStyles.countBadgeOnline}>
                          <AppText
                            variant="bold"
                            style={sectionStyles.countTextOnline}
                          >
                            {onlineDonors.length}
                          </AppText>
                        </View>
                      </View>

                      {onlineDonors.map((donor) => (
                        <DonorCard
                          key={donor.id || donor._id}
                          donor={donor}
                          daysLeft={donor.daysLeft || 0}
                          onRequest={() =>
                            handleRequestBlood(donor.id || donor._id)
                          }
                          onCancel={() =>
                            handleCancelRequest(donor.id || donor._id)
                          }
                          isRequesting={
                            requestingId === (donor.id || donor._id)
                          }
                          cancelLoading={
                            cancelLoadingId === (donor.id || donor._id)
                          }
                          onDetails={() =>
                            router.push(
                              `/seeker/donor-details?id=${donor.id || donor._id}`,
                            )
                          }
                        />
                      ))}
                    </View>
                  )}

                  {/* SECTION 2: OFFLINE DONORS */}
                  {offlineDonors.length > 0 && (
                    <View style={sectionStyles.sectionGroup}>
                      <View style={sectionStyles.sectionHeaderRow}>
                        <View style={sectionStyles.sectionHeaderTitleBox}>
                          <View style={sectionStyles.offlineDot} />
                          <AppText
                            variant="black"
                            style={sectionStyles.sectionHeaderTitle}
                          >
                            Offline Donors
                          </AppText>
                        </View>
                        <View style={sectionStyles.countBadgeOffline}>
                          <AppText
                            variant="bold"
                            style={sectionStyles.countTextOffline}
                          >
                            {offlineDonors.length}
                          </AppText>
                        </View>
                      </View>

                      {offlineDonors.map((donor) => (
                        <DonorCard
                          key={donor.id || donor._id}
                          donor={donor}
                          daysLeft={donor.daysLeft || 0}
                          onRequest={() =>
                            handleRequestBlood(donor.id || donor._id)
                          }
                          onCancel={() =>
                            handleCancelRequest(donor.id || donor._id)
                          }
                          isRequesting={
                            requestingId === (donor.id || donor._id)
                          }
                          cancelLoading={
                            cancelLoadingId === (donor.id || donor._id)
                          }
                          onDetails={() =>
                            router.push(
                              `/seeker/donor-details?id=${donor.id || donor._id}`,
                            )
                          }
                        />
                      ))}
                    </View>
                  )}

                  {/* Load More Button */}
                  {donors && visibleCount < donors.length && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={handleLoadMore}
                      style={sectionStyles.loadMoreBtn}
                    >
                      <AppText
                        variant="bold"
                        style={sectionStyles.loadMoreText}
                      >
                        Load More Donors
                      </AppText>
                      <ChevronRight size={18} color="#0f172a" />
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* SELECTION MODALS */}
      <SelectionModal
        visible={modalType === "province"}
        title="Select Province"
        data={availableProvinces}
        selectedValue={province}
        onSelect={(val) => {
          setProvince(val);
          setCity(""); // Reset city when province changes
          setModalType(null);
        }}
        onClose={() => setModalType(null)}
      />

      <SelectionModal
        visible={modalType === "city"}
        title="Select City"
        data={availableCities}
        selectedValue={city}
        onSelect={(val) => {
          setCity(val);
          setModalType(null);
        }}
        onClose={() => setModalType(null)}
      />

      <SelectionModal
        visible={modalType === "bloodType"}
        title="Select Blood Group"
        data={BLOOD_GROUPS}
        selectedValue={bloodType}
        onSelect={(val) => {
          setBloodType(val);
          setModalType(null);
        }}
        onClose={() => setModalType(null)}
      />

      {/* FEEDBACK POPUP MODAL */}
      <SeekerFeedbackModal
        visible={feedbackModal.visible}
        title={feedbackModal.title}
        message={feedbackModal.message}
        type={feedbackModal.type}
        onClose={hidePopup}
      />
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  resultsContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  loadingBox: {
    paddingVertical: 40,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    color: "#64748b",
    fontSize: 14,
  },
  emptyBox: {
    paddingVertical: 40,
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  emptyTitle: {
    fontSize: 18,
    color: "#1e293b",
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    marginTop: 6,
  },
  sectionGroup: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionHeaderTitleBox: {
    flexDirection: "row",
    alignItems: "center",
  },
  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#10b981",
    marginRight: 8,
  },
  offlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#94a3b8",
    marginRight: 8,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    color: "#0f172a",
  },
  countBadgeOnline: {
    backgroundColor: "#d1fae5",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  countTextOnline: {
    color: "#047857",
    fontSize: 12,
  },
  countBadgeOffline: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  countTextOffline: {
    color: "#475569",
    fontSize: 12,
  },
  loadMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 8,
  },
  loadMoreText: {
    color: "#0f172a",
    fontSize: 14,
    marginRight: 6,
  },
});
