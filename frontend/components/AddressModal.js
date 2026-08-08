import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAddress } from "../context/AddressContext";
import { PAKISTAN_LOCATIONS } from "../constants/pakistanLocations";

export default function AddressModal() {
  const {
    addresses,
    modalVisible,
    closeAddressModal,
    addAddress,
    selectPrimaryAddress,
    deleteAddress,
    loading,
  } = useAddress();

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Field Validation Errors State
  const [errors, setErrors] = useState({});

  // Dropdown Picker Modal States
  const [pickerType, setPickerType] = useState(null); // 'province' | 'city' | null

  // Custom Feedback Modal State (Replaces standard Alert.alert)
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info", // 'success' | 'error' | 'confirm'
    onConfirm: null,
  });

  const resetForm = () => {
    setFullName("");
    setPhone("");
    setProvince("");
    setCity("");
    setAddressLine("");
    setErrors({});
    setIsFormOpen(false);
  };

  // Field Validation Logic
  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    // 1. Name validation (Must contain only letters & spaces)
    if (!fullName.trim()) {
      newErrors.fullName = "Full contact name is required";
      valid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(fullName.trim())) {
      newErrors.fullName = "Name must contain only alphabetic characters";
      valid = false;
    }

    // 2. Phone validation (Must be exactly 11 digits)
    const cleanPhone = phone.trim();
    if (!cleanPhone) {
      newErrors.phone = "Phone number is required";
      valid = false;
    } else if (!/^\d+$/.test(cleanPhone)) {
      newErrors.phone = "Phone number must contain only digits";
      valid = false;
    } else if (cleanPhone.length !== 11) {
      newErrors.phone = "Phone number must be exactly 11 digits";
      valid = false;
    }

    // 3. Province validation
    if (!province) {
      newErrors.province = "Please select a province";
      valid = false;
    }

    // 4. City validation
    if (!city) {
      newErrors.city = "Please select a city";
      valid = false;
    }

    // 5. Address line validation
    if (!addressLine.trim()) {
      newErrors.addressLine = "Street / Area address is required";
      valid = false;
    } else if (addressLine.trim().length < 5) {
      newErrors.addressLine = "Please enter a complete detailed address";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    const result = await addAddress({
      fullName: fullName.trim(),
      phone: phone.trim(),
      province,
      city,
      addressLine: addressLine.trim(),
    });
    setSubmitting(false);

    if (result.success) {
      resetForm();
      showFeedbackModal(
        "Success",
        "Address added successfully and set as primary!",
        "success",
      );
    } else {
      showFeedbackModal(
        "Failed",
        result.message || "Could not save address. Please try again.",
        "error",
      );
    }
  };

  const handleDeletePrompt = (id) => {
    showFeedbackModal(
      "Remove Address",
      "Are you sure you want to delete this address?",
      "confirm",
      () => deleteAddress(id),
    );
  };

  const showFeedbackModal = (
    title,
    message,
    type = "info",
    onConfirm = null,
  ) => {
    setFeedbackModal({
      visible: true,
      title,
      message,
      type,
      onConfirm,
    });
  };

  const hideFeedbackModal = () => {
    setFeedbackModal({
      visible: false,
      title: "",
      message: "",
      type: "info",
      onConfirm: null,
    });
  };

  // Provinces list from constant keys
  const provinceList = Object.keys(PAKISTAN_LOCATIONS || {});
  // Dynamic Cities list based on selected province
  const cityList = province ? PAKISTAN_LOCATIONS[province] || [] : [];

  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeAddressModal}
    >
      <View style={styles.backdrop}>
        <TouchableOpacity
          style={styles.backdropDismiss}
          activeOpacity={1}
          onPress={closeAddressModal}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.sheetContainer}
        >
          {/* Header Drag Handle */}
          <View style={styles.dragHandle} />

          {/* Modal Header */}
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>
              {isFormOpen ? "Add Delivery / Seeker Address" : "Saved Addresses"}
            </Text>
            <TouchableOpacity
              onPress={closeAddressModal}
              style={styles.closeBtn}
            >
              <Ionicons name="close-circle" size={26} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Mode 1: Address List */}
          {!isFormOpen ? (
            <View style={styles.body}>
              {loading && addresses.length === 0 ? (
                <ActivityIndicator
                  size="large"
                  color="#DC2626"
                  style={{ marginTop: 40 }}
                />
              ) : (
                <FlatList
                  data={addresses}
                  keyExtractor={(item) => item._id}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  ListEmptyComponent={
                    <View style={styles.emptyBox}>
                      <Ionicons
                        name="location-outline"
                        size={48}
                        color="#94A3B8"
                      />
                      <Text style={styles.emptyTitle}>No Addresses Saved</Text>
                      <Text style={styles.emptySubtitle}>
                        Add a primary address to request blood and locate
                        emergency services quickly.
                      </Text>
                    </View>
                  }
                  renderItem={({ item }) => {
                    const isSelected = item.isPrimary;
                    return (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => selectPrimaryAddress(item._id)}
                        style={[
                          styles.addressCard,
                          isSelected && styles.addressCardSelected,
                        ]}
                      >
                        <View style={styles.cardHeader}>
                          <View style={styles.cardTitleRow}>
                            <Ionicons
                              name={
                                isSelected
                                  ? "radio-button-on"
                                  : "radio-button-off"
                              }
                              size={20}
                              color={isSelected ? "#DC2626" : "#94A3B8"}
                            />
                            <Text
                              style={styles.personName}
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {item.fullName}
                            </Text>
                          </View>
                          {isSelected && (
                            <View style={styles.primaryBadge}>
                              <Text style={styles.primaryBadgeText}>
                                PRIMARY
                              </Text>
                            </View>
                          )}
                        </View>

                        <Text style={styles.phoneText}>📞 {item.phone}</Text>
                        <Text style={styles.addressText}>
                          📍 {item.addressLine}, {item.city}, {item.province}
                        </Text>

                        <View style={styles.cardActions}>
                          <TouchableOpacity
                            onPress={() => handleDeletePrompt(item._id)}
                            style={styles.deleteBtn}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={16}
                              color="#DC2626"
                            />
                            <Text style={styles.deleteBtnText}>Remove</Text>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                />
              )}

              {/* Add New Address Action Button */}
              <TouchableOpacity
                style={styles.addAddressBtn}
                onPress={() => setIsFormOpen(true)}
                activeOpacity={0.85}
              >
                <Ionicons name="add" size={20} color="#FFFFFF" />
                <Text style={styles.addAddressBtnText}>Add New Address</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* Mode 2: Add New Address Form */
            <ScrollView
              contentContainerStyle={styles.formContainer}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Full Contact Name */}
              <Text style={styles.inputLabel}>Full Contact Name *</Text>
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                placeholder="e.g. John Doe"
                placeholderTextColor="#94A3B8"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (errors.fullName)
                    setErrors((prev) => ({ ...prev, fullName: null }));
                }}
              />
              {errors.fullName && (
                <Text style={styles.errorText}>{errors.fullName}</Text>
              )}

              {/* Phone Number */}
              <Text style={styles.inputLabel}>Phone Number (11 Digits) *</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="03XXXXXXXXX"
                keyboardType="numeric"
                maxLength={11}
                placeholderTextColor="#94A3B8"
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (errors.phone)
                    setErrors((prev) => ({ ...prev, phone: null }));
                }}
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone}</Text>
              )}

              {/* Location Selectors Row */}
              <View style={styles.rowInputs}>
                {/* Province Dropdown Trigger */}
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.inputLabel}>Province *</Text>
                  <TouchableOpacity
                    style={[
                      styles.pickerTrigger,
                      errors.province && styles.inputError,
                    ]}
                    onPress={() => setPickerType("province")}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        !province && styles.placeholderText,
                      ]}
                      numberOfLines={1}
                    >
                      {province || "Select Province"}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#64748B" />
                  </TouchableOpacity>
                  {errors.province && (
                    <Text style={styles.errorText}>{errors.province}</Text>
                  )}
                </View>

                {/* City Dropdown Trigger */}
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.inputLabel}>City *</Text>
                  <TouchableOpacity
                    style={[
                      styles.pickerTrigger,
                      errors.city && styles.inputError,
                      !province && styles.pickerDisabled,
                    ]}
                    disabled={!province}
                    onPress={() => setPickerType("city")}
                  >
                    <Text
                      style={[
                        styles.pickerText,
                        !city && styles.placeholderText,
                      ]}
                      numberOfLines={1}
                    >
                      {city ||
                        (province ? "Select City" : "Select Province First")}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#64748B" />
                  </TouchableOpacity>
                  {errors.city && (
                    <Text style={styles.errorText}>{errors.city}</Text>
                  )}
                </View>
              </View>

              {/* Street Address Line */}
              <Text style={styles.inputLabel}>
                Street / Area / House Address *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  errors.addressLine && styles.inputError,
                ]}
                placeholder="House #, Street name, Sector / Block details"
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={3}
                value={addressLine}
                onChangeText={(text) => {
                  setAddressLine(text);
                  if (errors.addressLine)
                    setErrors((prev) => ({ ...prev, addressLine: null }));
                }}
              />
              {errors.addressLine && (
                <Text style={styles.errorText}>{errors.addressLine}</Text>
              )}

              {/* Form Action Buttons */}
              <View style={styles.formBtnRow}>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={resetForm}
                  disabled={submitting}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSaveAddress}
                  disabled={submitting}
                  activeOpacity={0.85}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.saveBtnText}>Save & Set Primary</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </KeyboardAvoidingView>
      </View>

      {/* Dropdown Selection Picker Modal */}
      <Modal
        visible={pickerType !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPickerType(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerType(null)}
        >
          <View style={styles.pickerModalContent}>
            <View style={styles.pickerHeader}>
              <Text style={styles.pickerTitle}>
                {pickerType === "province" ? "Select Province" : "Select City"}
              </Text>
              <TouchableOpacity onPress={() => setPickerType(null)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={pickerType === "province" ? provinceList : cityList}
              keyExtractor={(item) => item}
              style={{ maxHeight: 320 }}
              renderItem={({ item }) => {
                const isCurrent =
                  pickerType === "province" ? province === item : city === item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.pickerOption,
                      isCurrent && styles.pickerOptionSelected,
                    ]}
                    onPress={() => {
                      if (pickerType === "province") {
                        setProvince(item);
                        setCity(""); // Reset dependent city when province changes
                        if (errors.province)
                          setErrors((prev) => ({ ...prev, province: null }));
                      } else {
                        setCity(item);
                        if (errors.city)
                          setErrors((prev) => ({ ...prev, city: null }));
                      }
                      setPickerType(null);
                    }}
                  >
                    <Text
                      style={[
                        styles.pickerOptionText,
                        isCurrent && styles.pickerOptionTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {isCurrent && (
                      <Ionicons name="checkmark" size={18} color="#DC2626" />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Custom Popup Feedback / Confirmation Modal (Replaces Alerts) */}
      <Modal
        visible={feedbackModal.visible}
        transparent={true}
        animationType="fade"
        onRequestClose={hideFeedbackModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.alertCard}>
            <View
              style={[
                styles.alertIconCircle,
                feedbackModal.type === "success" && styles.bgSuccess,
                feedbackModal.type === "error" && styles.bgError,
                feedbackModal.type === "confirm" && styles.bgConfirm,
              ]}
            >
              <Ionicons
                name={
                  feedbackModal.type === "success"
                    ? "checkmark-circle"
                    : feedbackModal.type === "error"
                      ? "alert-circle"
                      : "help-circle"
                }
                size={34}
                color={
                  feedbackModal.type === "success"
                    ? "#16A34A"
                    : feedbackModal.type === "error"
                      ? "#DC2626"
                      : "#D97706"
                }
              />
            </View>

            <Text style={styles.alertTitle}>{feedbackModal.title}</Text>
            <Text style={styles.alertMessage}>{feedbackModal.message}</Text>

            <View style={styles.alertActionRow}>
              {feedbackModal.type === "confirm" ? (
                <>
                  <TouchableOpacity
                    style={styles.alertSecondaryBtn}
                    onPress={hideFeedbackModal}
                  >
                    <Text style={styles.alertSecondaryBtnText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.alertPrimaryBtn, styles.bgErrorBtn]}
                    onPress={() => {
                      const action = feedbackModal.onConfirm;
                      hideFeedbackModal();
                      if (action) action();
                    }}
                  >
                    <Text style={styles.alertPrimaryBtnText}>Delete</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.alertPrimaryBtn}
                  onPress={hideFeedbackModal}
                >
                  <Text style={styles.alertPrimaryBtnText}>OK</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justify: "flex-end",
  },
  backdropDismiss: {
    flex: 1,
  },
  sheetContainer: {
    height: "82%",
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  closeBtn: {
    padding: 2,
  },
  body: {
    flex: 1,
    paddingTop: 16,
  },
  emptyBox: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#334155",
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 4,
    lineHeight: 18,
  },
  addressCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  addressCardSelected: {
    backgroundColor: "#FEF2F2",
    borderColor: "#DC2626",
  },
  // cardHeader: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   justifyContent: "space-between",
  //   marginBottom: 6,
  // },
  // cardTitleRow: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   gap: 8,
  // },
  // personName: {
  //   fontSize: 15,
  //   fontWeight: "800",
  //   color: "#0F172A",
  // },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1, // Added to prevent pushing the badge out
    marginRight: 8, // Added to keep a small gap before the badge
  },
  personName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
    flex: 1, // Added to allow the text to shrink and truncate
  },

  primaryBadge: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  primaryBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  phoneText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginTop: 4,
  },
  addressText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
    marginTop: 4,
    lineHeight: 18,
  },
  cardActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deleteBtnText: {
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "700",
  },
  addAddressBtn: {
    flexDirection: "row",
    backgroundColor: "#DC2626",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  addAddressBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
  formContainer: {
    paddingVertical: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "500",
  },
  inputError: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
  },
  pickerTrigger: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerDisabled: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },
  pickerText: {
    fontSize: 14,
    color: "#0F172A",
    fontWeight: "500",
    flex: 1,
  },
  placeholderText: {
    color: "#94A3B8",
  },
  textArea: {
    height: 70,
    textAlignVertical: "top",
  },
  rowInputs: {
    flexDirection: "row",
  },
  formBtnRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 24,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "700",
  },
  saveBtn: {
    flex: 2,
    backgroundColor: "#DC2626",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  /* Dropdown Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  pickerModalContent: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    maxHeight: 400,
  },
  pickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    marginBottom: 8,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  pickerOption: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerOptionSelected: {
    backgroundColor: "#FEF2F2",
  },
  pickerOptionText: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "500",
  },
  pickerOptionTextSelected: {
    color: "#DC2626",
    fontWeight: "700",
  },

  /* Feedback Alert Modal Styles */
  alertCard: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  alertIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  bgSuccess: { backgroundColor: "#DCFCE7" },
  bgError: { backgroundColor: "#FEE2E2" },
  bgConfirm: { backgroundColor: "#FEF3C7" },
  alertTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 8,
    textAlign: "center",
  },
  alertMessage: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  alertActionRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  alertPrimaryBtn: {
    flex: 1,
    backgroundColor: "#0F172A",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  bgErrorBtn: {
    backgroundColor: "#DC2626",
  },
  alertPrimaryBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  alertSecondaryBtn: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  alertSecondaryBtnText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "700",
  },
});
