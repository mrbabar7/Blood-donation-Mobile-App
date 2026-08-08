import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import * as z from "zod";
import {
  FontAwesome5,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

// Define API Base URL (Replace with your actual backend URL)
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const schema = z.object({
  hospitalName: z.string().min(3, "Hospital Name is required"),
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

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ORG_TYPES = ["Private", "Government", "Semi-Government", "Trust / NGO"];
const HOSPITAL_SERVICES = [
  "Emergency 24/7",
  "ICU / CCU",
  "OPD Services",
  "Operation Theater",
  "Laboratory & Diagnostics",
  "Pharmacy",
  "Pediatric Care",
  "Maternity Care",
];

export default function HospitalRegistrationForm() {
  // --- Form & State Management ---
  const [hospitalList, setHospitalList] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);
  const [registeredId, setRegisteredId] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  // Modals
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Custom Alert Popup
  const [statusPopup, setStatusPopup] = useState({
    visible: false,
    type: "success",
    title: "",
    message: "",
  });

  const showToast = (message, type = "success") => {
    setStatusPopup({
      visible: true,
      type,
      title: type === "error" ? "Error" : "Success",
      message,
    });
  };

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
      hospitalName: "",
      orgType: "",
      operatingDays: [],
      category: [],
      startTime: new Date(new Date().setHours(9, 0, 0, 0)),
      endTime: new Date(new Date().setHours(17, 0, 0, 0)),
      phone: "",
      whatsapp: "",
      website: "",
      address: "",
    },
  });

  const selectedOrgType = watch("orgType");
  const selectedDays = watch("operatingDays") || [];
  const selectedCategories = watch("category") || [];
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  // --- Helpers ---
  const formatTime = (time) => {
    if (!time) return "Select Time";
    const dateObj = new Date(time);
    return isNaN(dateObj.getTime())
      ? "Select Time"
      : dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const parseToValidDate = (dateString, fallbackHour = 9) => {
    if (!dateString) {
      const defaultDate = new Date();
      defaultDate.setHours(fallbackHour, 0, 0, 0);
      return defaultDate;
    }
    const parsed = new Date(dateString);
    if (isNaN(parsed.getTime())) {
      const fallbackDate = new Date();
      fallbackDate.setHours(fallbackHour, 0, 0, 0);
      return fallbackDate;
    }
    return parsed;
  };

  const toggleDay = (day) => {
    if (isLocked) return;
    const updated = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setValue("operatingDays", updated, { shouldValidate: true });
  };

  const toggleCategory = (service) => {
    if (isLocked) return;
    const updated = selectedCategories.includes(service)
      ? selectedCategories.filter((s) => s !== service)
      : [...selectedCategories, service];
    setValue("category", updated, { shouldValidate: true });
  };

  // --- Load Data into Form ---
  const loadHospitalIntoForm = (item) => {
    if (!item) return;
    setSelectedHospitalId(item._id);
    setRegisteredId(item._id);
    setIsLocked(true);

    reset({
      hospitalName: item.name || item.hospitalName || "",
      orgType: item.orgType || "",
      operatingDays: item.operatingDays || [],
      category: item.category || [],
      startTime: parseToValidDate(item.startTime, 9),
      endTime: parseToValidDate(item.endTime, 17),
      phone: item.phone || "",
      whatsapp: item.whatsapp || "",
      website: item.website || "",
      address: item.address || "",
    });
  };

  // --- Fetch Hospital Data ---
  const fetchHospital = async () => {
    setIsFormLoading(true);
    try {
      const res = await axios.get(`${apiUrl}/api/forms/get-hospital-data`, {
        withCredentials: true,
      });

      if (res.data?.success && res.data?.data) {
        const data = res.data.data;
        const list = Array.isArray(data) ? data : [data];

        if (list.length > 0) {
          setHospitalList(list);
          loadHospitalIntoForm(list[0]);
        } else {
          setHospitalList([]);
          handleAddNew();
        }
      } else {
        setHospitalList([]);
        handleAddNew();
      }
    } catch (err) {
      console.log("Session not found or error fetching data", err);
      setHospitalList([]);
      handleAddNew();
    } finally {
      setIsFormLoading(false);
    }
  };

  useEffect(() => {
    fetchHospital();
  }, []);

  const handleAddNew = () => {
    setSelectedHospitalId(null);
    setRegisteredId(null);
    setIsLocked(false);
    reset({
      hospitalName: "",
      orgType: "",
      operatingDays: [],
      category: [],
      startTime: new Date(new Date().setHours(9, 0, 0, 0)),
      endTime: new Date(new Date().setHours(17, 0, 0, 0)),
      phone: "",
      whatsapp: "",
      website: "",
      address: "",
    });
  };

  // --- Submit API Logic (Register / Update) ---
  const onSubmit = async (data) => {
    setIsFormLoading(true);
    const timeFormatted = `${formatTime(data.startTime)} - ${formatTime(data.endTime)}`;

    const payload = {
      ...data,
      name: data.hospitalName,
      timing: timeFormatted,
      startTime: data.startTime.toISOString(),
      endTime: data.endTime.toISOString(),
    };

    try {
      if (registeredId) {
        // UPDATE EXISTING
        const res = await axios.put(
          `${apiUrl}/api/forms/update-hospital/${registeredId}`,
          payload,
          { withCredentials: true },
        );

        if (res.data?.success) {
          showToast("Profile Updated Successfully!", "success");
          setIsLocked(true);
          fetchHospital();
        }
      } else {
        // REGISTER NEW
        const res = await axios.post(
          `${apiUrl}/api/forms/emergency-register`,
          payload,
          { withCredentials: true },
        );

        if (res.data?.success) {
          setRegisteredId(res.data.data?._id);
          showToast("Registered Successfully!", "success");
          setIsLocked(true);
          fetchHospital();
        }
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Operation Failed", "error");
    } finally {
      setIsFormLoading(false);
      // Syncs fresh database state back to UI
    }
  };

  // --- Delete API Logic ---
  const handleDeleteConfirm = async () => {
    setIsFormLoading(true);
    setShowDeleteModal(false);
    try {
      const res = await axios.delete(
        `${apiUrl}/api/forms/delete-hospital/${registeredId}`,
        { withCredentials: true },
      );

      showToast(res.data?.message || "Hospital deleted", "success");
      handleAddNew();
      fetchHospital();
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed", "error");
    } finally {
      setIsFormLoading(false);
    }
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
            <FontAwesome5 name="hospital-alt" size={36} color="#FFFFFF" />
            <Text style={styles.headerTitle}>
              {registeredId
                ? isLocked
                  ? "Hospital Profile"
                  : "Edit Hospital Details"
                : "New Hospital Registration"}
            </Text>
          </View>

          {/* Registered Services Selector Bar */}
          {hospitalList.length > 0 && (
            <View style={styles.registeredBar}>
              <Text style={styles.registeredBarTitle}>
                MY REGISTERED HOSPITALS ({hospitalList.length})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {hospitalList.map((item, index) => {
                    const isSelected = item._id === selectedHospitalId;
                    return (
                      <TouchableOpacity
                        key={item._id || index}
                        onPress={() => loadHospitalIntoForm(item)}
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
                            item.hospitalName ||
                            `Hospital #${index + 1}`}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}

                  <TouchableOpacity
                    onPress={handleAddNew}
                    style={[
                      styles.registeredChip,
                      !selectedHospitalId && styles.registeredChipNew,
                    ]}
                  >
                    <Feather
                      name="plus"
                      size={14}
                      color={!selectedHospitalId ? "#FFF" : "#475569"}
                    />
                    <Text
                      style={[
                        styles.registeredChipText,
                        !selectedHospitalId &&
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
                <FontAwesome5
                  name="hospital-symbol"
                  size={12}
                  color="#DC2626"
                />{" "}
                HOSPITAL NAME
              </Text>
              <Controller
                control={control}
                name="hospitalName"
                // rules={{ required: "Hospital name is required" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      isLocked && styles.disabledInput,
                      errors.hospitalName && styles.inputError,
                    ]}
                    placeholder="e.g. City General Hospital"
                    placeholderTextColor="#A0AEC0"
                    value={value}
                    onChangeText={onChange}
                    editable={!isLocked}
                  />
                )}
              />
              {errors.hospitalName && (
                <Text style={styles.errorText}>
                  {errors.hospitalName.message}
                </Text>
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
                <FontAwesome5 name="stethoscope" size={12} color="#DC2626" />{" "}
                HOSPITAL SERVICES & FACILITIES
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
                    placeholder="e.g. 03001234567"
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
                    placeholder="923001234567"
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
                    placeholder="https://www.hospital.com"
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
                HOSPITAL ADDRESS
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
                    Register Hospital
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
                      Add Another Hospital
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
            <Text style={styles.modalTitle}>Select Hospital Services</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {HOSPITAL_SERVICES.map((service) => {
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
              Do you really want to delete this hospital record? This action
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
