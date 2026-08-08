import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";

// Replace with your API base URL
const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Validation Schema
const schema = z.object({
  ambName: z.string().min(3, "Ambulance Name is required"),
  orgType: z.string().min(1, "Please select organization type"),
  startTime: z.date({ required_error: "Start time required" }),
  endTime: z.date({ required_error: "End time required" }),
  phone: z.string().min(10, "Valid phone number required"),
  whatsapp: z
    .string()
    .regex(/^92[0-9]{10}$/, "Enter valid WhatsApp (e.g., 923001234567)"),
  category: z.array(z.string()).min(1, "Please select at least one service"),
  operatingDays: z
    .array(z.string())
    .min(1, "Select at least one operating day"),
  website: z.string().url("Enter valid URL").optional().or(z.literal("")),
  address: z.string().min(5, "Complete address required"),
});

const AMBULANCE_SERVICES = [
  "AC Ambulance",
  "Non-AC Ambulance",
  "Oxygen Support",
  "Ventilator / ICU",
  "Neonatal Care",
  "Dead Body Carrier",
  "First Aid Kit",
  "Emergency Rescue",
  "Patient Transfer",
];

const ORG_TYPES = [
  "Private Service",
  "NGO / Trust",
  "Government",
  "Independent Driver",
];

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Helper to format Date into AM/PM Time String
const formatTime = (date) => {
  if (!date) return "";
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return `${hours.toString().padStart(2, "0")}:${minutes} ${ampm}`;
};

export default function AmbulanceRegistrationForm() {
  // Modals state
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // State declarations
  const [ambulanceList, setAmbulanceList] = useState([]);
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState(null);

  // Time picker state
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Status Popup Modal (replaces Alert.alert)
  const [statusPopup, setStatusPopup] = useState({
    visible: false,
    title: "",
    message: "",
    type: "success", // 'success' | 'error'
  });

  const [registeredId, setRegisteredId] = useState(null);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      ambName: "",
      orgType: "",
      startTime: new Date(new Date().setHours(9, 0, 0, 0)),
      endTime: new Date(new Date().setHours(17, 0, 0, 0)),
      phone: "",
      whatsapp: "",
      category: [],
      operatingDays: [],
      website: "",
      address: "",
    },
  });

  const selectedCategories = watch("category") || [];
  const selectedOrgType = watch("orgType");
  const selectedDays = watch("operatingDays") || [];
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  useEffect(() => {
    fetchAmbulanceData();
  }, []);

  const showToast = (title, message, type = "success") => {
    setStatusPopup({ visible: true, title, message, type });
  };

  const parseToValidDate = (dateString, fallbackHour = 9) => {
    if (!dateString) {
      const defaultDate = new Date();
      defaultDate.setHours(fallbackHour, 0, 0, 0);
      return defaultDate;
    }
    const parsed = new Date(dateString);
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };
  const loadAmbulanceIntoForm = (item) => {
    if (!item) return;
    setRegisteredId(item._id);
    setSelectedAmbulanceId(item._id);
    setIsLocked(true);

    reset({
      ambName: item.name || item.ambName || "",
      orgType: item.orgType || "",
      startTime: parseToValidDate(item.startTime, 9),
      endTime: parseToValidDate(item.endTime, 17),
      phone: item.phone || "",
      whatsapp: item.whatsapp || "",
      category: item.category || [],
      operatingDays: item.operatingDays || [],
      website: item.website || "",
      address: item.address || "",
    });
  };

  // Fetch function
  const fetchAmbulanceData = async () => {
    setIsFormLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/forms/get-ambulance-data`, {
        withCredentials: true,
      });

      if (
        res.data?.success &&
        Array.isArray(res.data?.data) &&
        res.data.data.length > 0
      ) {
        const list = res.data.data;
        setAmbulanceList(list);

        // Default load the first/latest ambulance in the list
        loadAmbulanceIntoForm(list[0]);
      } else {
        setAmbulanceList([]);
        handleAddNew();
      }
    } catch (err) {
      console.log("No existing registrations found");
      setAmbulanceList([]);
      handleAddNew();
    } finally {
      setIsFormLoading(false);
    }
  };

  const onSubmit = async (data) => {
    setIsFormLoading(true);
    const timeFormatted = `${formatTime(data.startTime)} - ${formatTime(data.endTime)}`;

    const payload = {
      ...data,
      name: data.ambName,
      timing: timeFormatted, // Saved for backend UI display strings
      startTime: data.startTime.toISOString(), // Sent as ISO string for Mongo Date type
      endTime: data.endTime.toISOString(), // Sent as ISO string for Mongo Date type
      phone: data.phone || data.whatsapp,
    };

    try {
      if (registeredId) {
        const res = await axios.put(
          `${API_URL}/api/forms/update-ambulance/${registeredId}`,
          payload,
          { withCredentials: true },
        );
        if (res.data?.success) {
          showToast(
            "Success",
            "Ambulance Profile Updated Successfully!",
            "success",
          );
          setIsLocked(true);
          fetchAmbulanceData();
        }
      } else {
        const res = await axios.post(
          `${API_URL}/api/forms/ambulance-register`,
          payload,
          { withCredentials: true },
        );
        if (res.data?.success) {
          setRegisteredId(res.data.data._id);
          showToast("Success", "Ambulance Registered Successfully!", "success");
          setIsLocked(true);
          fetchAmbulanceData();
        }
      }
    } catch (err) {
      showToast(
        "Error",
        err.response?.data?.message || "Operation failed. Please try again.",
        "error",
      );
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsFormLoading(true);
    setShowDeleteModal(false);
    try {
      const res = await axios.delete(
        `${API_URL}/api/forms/delete-ambulance/${registeredId}`,
        { withCredentials: true },
      );
      showToast(
        "Deleted",
        res.data?.message || "Record successfully removed.",
        "success",
      );
      handleAddNew();
      fetchAmbulanceData();
    } catch (err) {
      showToast(
        "Error",
        err.response?.data?.message || "Delete failed. Please try again.",
        "error",
      );
    } finally {
      setIsFormLoading(false);
    }
  };

  const handleAddNew = () => {
    setRegisteredId(null);
    setSelectedAmbulanceId(null);
    setIsLocked(false);
    reset({
      ngoName: "",
      orgType: "",
      startTime: new Date(new Date().setHours(9, 0, 0, 0)),
      endTime: new Date(new Date().setHours(17, 0, 0, 0)),
      phone: "",
      whatsapp: "",
      category: [],
      operatingDays: [],
      website: "",
      address: "",
    });
  };

  const toggleCategory = (item) => {
    if (isLocked) return;
    const exists = selectedCategories.includes(item);
    const updated = exists
      ? selectedCategories.filter((c) => c !== item)
      : [...selectedCategories, item];
    setValue("category", updated, { shouldValidate: true });
  };

  const toggleDay = (day) => {
    if (isLocked) return;
    const exists = selectedDays.includes(day);
    const updated = exists
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setValue("operatingDays", updated, { shouldValidate: true });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <FontAwesome5 name="ambulance" size={36} color="#FFFFFF" />
            <Text style={styles.headerTitle}>
              {registeredId
                ? isLocked
                  ? "Ambulance Profile"
                  : "Edit Ambulance Details"
                : "New Registration"}
            </Text>
          </View>

          {/* Registered Services Selector Bar */}
          {ambulanceList.length > 0 && (
            <View style={styles.registeredBar}>
              <Text style={styles.registeredBarTitle}>
                MY REGISTERED AMBULANCES ({ambulanceList.length})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {ambulanceList.map((item, index) => {
                    const isSelected = item._id === selectedAmbulanceId;
                    return (
                      <TouchableOpacity
                        key={item._id || index}
                        onPress={() => loadAmbulanceIntoForm(item)}
                        style={[
                          styles.registeredChip,
                          isSelected && styles.registeredChipSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.registeredChipText,
                            isSelected && styles.registeredChipTextSelected,
                          ]}
                        >
                          {item.name ||
                            item.ambName ||
                            `Ambulance #${index + 1}`}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}

                  <TouchableOpacity
                    onPress={handleAddNew}
                    style={[
                      styles.registeredChip,
                      !selectedAmbulanceId && styles.registeredChipNew,
                    ]}
                  >
                    <Feather
                      name="plus"
                      size={14}
                      color={!selectedAmbulanceId ? "#FFF" : "#475569"}
                    />
                    <Text
                      style={[
                        styles.registeredChipText,
                        !selectedAmbulanceId &&
                          styles.registeredChipTextSelected,
                      ]}
                    >
                      Add New
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          )}

          <View style={styles.formPadding}>
            {/* Hospital Name */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                <FontAwesome5 name="ambulance" size={12} color="#DC2626" />{" "}
                AMBULANCE NAME
              </Text>
              <Controller
                control={control}
                name="ambName"
                // rules={{ required: "Ambulance name is required" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      isLocked && styles.disabledInput,
                      errors.ambName && styles.inputError,
                    ]}
                    placeholder="e.g. Love Ambulance"
                    placeholderTextColor="#A0AEC0"
                    value={value}
                    onChangeText={onChange}
                    editable={!isLocked}
                  />
                )}
              />
              {errors.ambName && (
                <Text style={styles.errorText}>{errors.ambName.message}</Text>
              )}
            </View>

            {/* Org Type */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                <Ionicons name="list" size={13} color="#DC2626" /> ORG TYPE
              </Text>
              <TouchableOpacity
                disabled={isLocked}
                style={[
                  styles.pickerButton,
                  isLocked && styles.disabledInput,
                  errors.orgType && styles.inputError,
                ]}
                onPress={() => setIsOrgModalOpen(true)}
              >
                <Text
                  style={[
                    styles.pickerText,
                    selectedOrgType
                      ? styles.selectedText
                      : styles.placeholderText,
                  ]}
                >
                  {selectedOrgType || "Select Organization Type..."}
                </Text>
                <Feather name="chevron-down" size={18} color="#0F172A" />
              </TouchableOpacity>
              {errors.orgType && (
                <Text style={styles.errorText}>{errors.orgType.message}</Text>
              )}
            </View>

            {/* Operating Days */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                <Ionicons name="calendar-outline" size={13} color="#DC2626" />{" "}
                OPERATING DAYS
              </Text>
              <View style={styles.daysContainer}>
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = selectedDays.includes(day);
                  return (
                    <TouchableOpacity
                      key={day}
                      disabled={isLocked}
                      onPress={() => toggleDay(day)}
                      style={[
                        styles.dayChip,
                        isSelected && styles.dayChipActive,
                        isLocked && styles.disabledDayChip,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayChipText,
                          isSelected && styles.dayChipTextActive,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.operatingDays && (
                <Text style={styles.errorText}>
                  {errors.operatingDays.message}
                </Text>
              )}
            </View>

            {/* Hospital Services Dropdown */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                <FontAwesome5 name="tree" size={12} color="#DC2626" /> AMBULANCE
                FACILITIES
              </Text>
              <TouchableOpacity
                disabled={isLocked}
                style={[
                  styles.pickerButton,
                  isLocked && styles.disabledInput,
                  errors.category && styles.inputError,
                ]}
                onPress={() => setIsServiceModalOpen(true)}
              >
                <Text
                  style={[
                    styles.pickerText,
                    selectedCategories.length > 0
                      ? styles.selectedText
                      : styles.placeholderText,
                  ]}
                  numberOfLines={1}
                >
                  {selectedCategories.length > 0
                    ? `${selectedCategories.length} Service(s) Selected`
                    : "Select Services..."}
                </Text>
                <Feather name="chevron-down" size={18} color="#0F172A" />
              </TouchableOpacity>
              {errors.category && (
                <Text style={styles.errorText}>{errors.category.message}</Text>
              )}
            </View>

            {/* Timings */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                <Feather name="clock" size={13} color="#DC2626" /> OPERATING
                TIMINGS
              </Text>
              <View style={styles.timeRow}>
                <TouchableOpacity
                  disabled={isLocked}
                  style={[
                    styles.timePickerButton,
                    isLocked && styles.disabledInput,
                  ]}
                  onPress={() => setShowStartTimePicker(true)}
                >
                  <Text style={styles.timePickerLabel}>From:</Text>
                  <Text style={styles.timePickerValue}>
                    {formatTime(startTime)}
                  </Text>
                  <Feather name="clock" size={14} color="#DC2626" />
                </TouchableOpacity>

                <TouchableOpacity
                  disabled={isLocked}
                  style={[
                    styles.timePickerButton,
                    isLocked && styles.disabledInput,
                  ]}
                  onPress={() => setShowEndTimePicker(true)}
                >
                  <Text style={styles.timePickerLabel}>To:</Text>
                  <Text style={styles.timePickerValue}>
                    {formatTime(endTime)}
                  </Text>
                  <Feather name="clock" size={14} color="#DC2626" />
                </TouchableOpacity>
              </View>

              {showStartTimePicker && (
                <DateTimePicker
                  value={startTime || new Date()}
                  mode="time"
                  is24Hour={false}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedDate) => {
                    setShowStartTimePicker(Platform.OS === "ios");
                    if (selectedDate) {
                      setValue("startTime", selectedDate, {
                        shouldValidate: true,
                      });
                    }
                  }}
                />
              )}

              {showEndTimePicker && (
                <DateTimePicker
                  value={endTime || new Date()}
                  mode="time"
                  is24Hour={false}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedDate) => {
                    setShowEndTimePicker(Platform.OS === "ios");
                    if (selectedDate) {
                      setValue("endTime", selectedDate, {
                        shouldValidate: true,
                      });
                    }
                  }}
                />
              )}
            </View>

            {/* Phone Number */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                <Feather name="phone" size={13} color="#DC2626" /> PHONE NUMBER
              </Text>
              <Controller
                control={control}
                name="phone"
                // rules={{ required: "Phone number is required" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      isLocked && styles.disabledInput,
                      errors.phone && styles.inputError,
                    ]}
                    placeholder="e.g. 03*********"
                    placeholderTextColor="#A0AEC0"
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChange}
                    editable={!isLocked}
                  />
                )}
              />
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone.message}</Text>
              )}
            </View>

            {/* WhatsApp */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                <MaterialCommunityIcons
                  name="whatsapp"
                  size={14}
                  color="#DC2626"
                />{" "}
                WHATSAPP
              </Text>
              <Controller
                control={control}
                name="whatsapp"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      isLocked && styles.disabledInput,
                      errors.whatsapp && styles.inputError,
                    ]}
                    placeholder="923*********"
                    placeholderTextColor="#A0AEC0"
                    keyboardType="phone-pad"
                    value={value}
                    onChangeText={onChange}
                    editable={!isLocked}
                  />
                )}
              />
              {errors.whatsapp && (
                <Text style={styles.errorText}>{errors.whatsapp.message}</Text>
              )}
            </View>

            {/* Website */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                <Feather name="globe" size={13} color="#DC2626" /> WEBSITE
                (OPTIONAL)
              </Text>
              <Controller
                control={control}
                name="website"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      isLocked && styles.disabledInput,
                      errors.website && styles.inputError,
                    ]}
                    placeholder="https://www.ambulance.com"
                    placeholderTextColor="#A0AEC0"
                    autoCapitalize="none"
                    keyboardType="url"
                    value={value}
                    onChangeText={onChange}
                    editable={!isLocked}
                  />
                )}
              />
              {errors.website && (
                <Text style={styles.errorText}>{errors.website.message}</Text>
              )}
            </View>

            {/* Address */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>
                <Ionicons name="location-outline" size={14} color="#DC2626" />{" "}
                AMBULANCE SERVICE ADDRESS
              </Text>
              <Controller
                control={control}
                name="address"
                // rules={{ required: "Address is required" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      styles.textArea,
                      isLocked && styles.disabledInput,
                      errors.address && styles.inputError,
                    ]}
                    placeholder="Street, Area, City"
                    placeholderTextColor="#A0AEC0"
                    multiline
                    numberOfLines={3}
                    value={value}
                    onChangeText={onChange}
                    editable={!isLocked}
                  />
                )}
              />
              {errors.address && (
                <Text style={styles.errorText}>{errors.address.message}</Text>
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              {!registeredId ? (
                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={handleSubmit(onSubmit)}
                >
                  <Text style={styles.primaryButtonText}>
                    Register AMBULANCE
                  </Text>
                </TouchableOpacity>
              ) : (
                <View style={{ gap: 10 }}>
                  <View style={styles.buttonRow}>
                    {isLocked ? (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => setIsLocked(false)}
                      >
                        <Feather name="edit-2" size={16} color="#FFF" />
                        <Text style={styles.actionButtonText}>
                          Edit Details
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.saveButton]}
                        onPress={handleSubmit(onSubmit)}
                      >
                        <Feather name="check-circle" size={16} color="#FFF" />
                        <Text style={styles.actionButtonText}>
                          Save Changes
                        </Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => setShowDeleteModal(true)}
                    >
                      <Feather name="trash-2" size={16} color="#FFF" />
                      <Text style={styles.actionButtonText}>Delete</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.secondaryAddButton}
                    onPress={handleAddNew}
                  >
                    <Feather name="plus" size={18} color="#DC2626" />
                    <Text style={styles.secondaryAddButtonText}>
                      Add Another Ambulance
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Loading Overlay */}
      {isFormLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#DC2626" />
        </View>
      )}

      {/* Modals */}
      <Modal visible={isOrgModalOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOrgModalOpen(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Organization Type</Text>
            {ORG_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                style={styles.modalOption}
                onPress={() => {
                  setValue("orgType", type, { shouldValidate: true });
                  setIsOrgModalOpen(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    selectedOrgType === type && styles.activeModalOptionText,
                  ]}
                >
                  {type}
                </Text>
                {selectedOrgType === type && (
                  <Feather name="check" size={16} color="#DC2626" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={isServiceModalOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsServiceModalOpen(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Blood Bank Services</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {AMBULANCE_SERVICES.map((service) => {
                const isSelected = selectedCategories.includes(service);
                return (
                  <TouchableOpacity
                    key={service}
                    style={styles.modalOption}
                    onPress={() => toggleCategory(service)}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        isSelected && styles.activeModalOptionText,
                      ]}
                    >
                      {service}
                    </Text>
                    {isSelected && (
                      <Feather name="check" size={16} color="#DC2626" />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => setIsServiceModalOpen(false)}
            >
              <Text style={styles.doneButtonText}>DONE</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Response Alert */}
      <Modal visible={statusPopup.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.popupContent}>
            <View
              style={[
                styles.popupBadge,
                statusPopup.type === "error"
                  ? styles.popupBadgeError
                  : styles.popupBadgeSuccess,
              ]}
            >
              <Feather
                name={statusPopup.type === "error" ? "alert-circle" : "check"}
                size={32}
                color={statusPopup.type === "error" ? "#DC2626" : "#16A34A"}
              />
            </View>
            <Text style={styles.popupTitle}>{statusPopup.title}</Text>
            <Text style={styles.popupMessage}>{statusPopup.message}</Text>
            <TouchableOpacity
              style={[
                styles.popupButton,
                statusPopup.type === "error"
                  ? styles.popupButtonError
                  : styles.popupButtonSuccess,
              ]}
              onPress={() =>
                setStatusPopup((prev) => ({ ...prev, visible: false }))
              }
            >
              <Text style={styles.popupButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={showDeleteModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModalContent}>
            <View style={styles.deleteIconBadge}>
              <Feather name="trash-2" size={28} color="#DC2626" />
            </View>
            <Text style={styles.deleteTitle}>Are you sure?</Text>
            <Text style={styles.deleteSubtitle}>
              Do you really want to delete this ambulance record? This action
              cannot be undone.
            </Text>
            <View style={styles.deleteActionRow}>
              <TouchableOpacity
                style={[styles.deleteModalBtn, styles.cancelBtn]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.cancelBtnText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteModalBtn, styles.confirmBtn]}
                onPress={handleDeleteConfirm}
              >
                <Text style={styles.confirmBtnText}>DELETE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { padding: 16, paddingBottom: 100 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    backgroundColor: "#DC2626",
    padding: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  addNewBadge: {
    position: "absolute",
    right: 12,
    top: 12,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    gap: 4,
  },
  addNewBadgeText: { color: "#DC2626", fontSize: 12, fontWeight: "bold" },
  registeredBar: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  registeredBarTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#64748B",
    marginBottom: 8,
  },
  registeredChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  registeredChipSelected: {
    backgroundColor: "#DC2626",
    borderColor: "#DC2626",
  },
  registeredChipNew: {
    backgroundColor: "#16A34A",
    borderColor: "#16A34A",
  },
  registeredChipText: {
    color: "#334155",
    fontWeight: "600",
    fontSize: 13,
  },
  registeredChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  formPadding: { padding: 16 },
  fieldContainer: { marginBottom: 16 },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#475569",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#0F172A",
    backgroundColor: "#FFFFFF",
  },
  textArea: { height: 75, textAlignVertical: "top" },
  disabledInput: { backgroundColor: "#F1F5F9", color: "#64748B" },
  inputError: { borderColor: "#DC2626" },
  errorText: { color: "#DC2626", fontSize: 11, marginTop: 4 },
  pickerButton: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  pickerText: { fontSize: 14 },
  selectedText: { color: "#0F172A", fontWeight: "500" },
  placeholderText: { color: "#A0AEC0" },
  daysContainer: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  dayChip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#F8FAFC",
  },
  dayChipActive: { backgroundColor: "#DC2626", borderColor: "#DC2626" },
  disabledDayChip: { opacity: 0.6 },
  dayChipText: { fontSize: 12, color: "#475569" },
  dayChipTextActive: { color: "#FFFFFF", fontWeight: "bold" },
  timeRow: { flexDirection: "row", gap: 10 },
  timePickerButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#FFFFFF",
  },
  timePickerLabel: { fontSize: 12, color: "#64748B" },
  timePickerValue: { fontSize: 13, fontWeight: "bold", color: "#0F172A" },
  actionsContainer: { marginTop: 10 },
  primaryButton: {
    backgroundColor: "#DC2626",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
  buttonRow: { flexDirection: "row", gap: 10 },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  editButton: { backgroundColor: "#2563EB" },
  saveButton: { backgroundColor: "#16A34A" },
  deleteButton: { backgroundColor: "#DC2626" },
  actionButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 14 },
  secondaryAddButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DC2626",
    gap: 6,
  },
  secondaryAddButtonText: {
    color: "#DC2626",
    fontWeight: "bold",
    fontSize: 13,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 12,
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalOptionText: { fontSize: 14, color: "#334155" },
  activeModalOptionText: { color: "#DC2626", fontWeight: "bold" },
  doneButton: {
    marginTop: 12,
    backgroundColor: "#DC2626",
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  doneButtonText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 13 },
  popupContent: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  popupBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  popupBadgeSuccess: { backgroundColor: "#DCFCE7" },
  popupBadgeError: { backgroundColor: "#FEE2E2" },
  popupTitle: { fontSize: 18, fontWeight: "bold", color: "#0F172A" },
  popupMessage: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
  },
  popupButton: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  popupButtonSuccess: { backgroundColor: "#16A34A" },
  popupButtonError: { backgroundColor: "#DC2626" },
  popupButtonText: { color: "#FFFFFF", fontWeight: "bold" },
  deleteModalContent: {
    width: "85%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  deleteIconBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  deleteTitle: { fontSize: 16, fontWeight: "bold", color: "#0F172A" },
  deleteSubtitle: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
  },
  deleteActionRow: { flexDirection: "row", gap: 10, width: "100%" },
  deleteModalBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtn: { backgroundColor: "#E2E8F0" },
  confirmBtn: { backgroundColor: "#DC2626" },
  cancelBtnText: { color: "#475569", fontWeight: "bold", fontSize: 12 },
  confirmBtnText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 12 },
});
