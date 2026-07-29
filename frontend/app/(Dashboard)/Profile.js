import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Image,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  MapPin,
  Phone,
  User,
  Calendar,
  Edit2,
  Save,
  Star,
  Heart,
  Droplet,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Award,
  XCircle,
  ChevronDown,
  Users,
} from "lucide-react-native";

import AppText from "../../components/AppText";
import SelectionModal from "../../components/SelectionModal";
import { useDonor } from "../../context/DonorContext";
import {
  PAKISTAN_LOCATIONS,
  BLOOD_GROUPS,
} from "../../constants/pakistanLocations";

const MALE_AVATAR = "https://cdn-icons-png.flaticon.com/128/17002/17002124.png";
const FEMALE_AVATAR =
  "https://cdn-icons-png.flaticon.com/128/17002/17002124.png";

const GENDER_OPTIONS = ["Male", "Female", "Other"];

export default function ProfileScreen() {
  const router = useRouter();
  const {
    donorProfile,
    loading,
    updateDonorProfileAPI,
    deleteDonorProfileAPI,
  } = useDonor();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [formData, setFormData] = useState(null);

  // Status Notification Modal State
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    type: "success", // 'success' | 'error'
    title: "",
    message: "",
  });

  // Modal Selection State
  const [activeModal, setActiveModal] = useState(null); // 'bloodType' | 'province' | 'city' | 'gender'

  useEffect(() => {
    if (donorProfile) {
      setFormData(donorProfile);
    }
  }, [donorProfile]);

  // Available Provinces array from PAKISTAN_LOCATIONS object keys
  const availableProvinces = Object.keys(PAKISTAN_LOCATIONS || {});

  // Available Cities based on currently selected province
  const availableCities =
    formData?.province && PAKISTAN_LOCATIONS[formData.province]
      ? PAKISTAN_LOCATIONS[formData.province]
      : [];

  // Check if current selected city is valid for the selected province
  const isCityValidForProvince = () => {
    if (!formData?.province || !formData?.district) return false;
    const citiesInProvince = PAKISTAN_LOCATIONS[formData.province] || [];
    return citiesInProvince.includes(formData.district);
  };

  // Check if form data has actually been modified
  const isFormChanged = () => {
    if (!formData || !donorProfile) return false;
    return JSON.stringify(formData) !== JSON.stringify(donorProfile);
  };

  const showNotification = (type, title, message) => {
    setFeedbackModal({ visible: true, type, title, message });
  };

  const calculateDaysLeft = (targetDate) => {
    if (!targetDate) return 0;
    const diff = new Date(targetDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    setFormData(donorProfile);
    setIsEditing(false);
  };

  const handleSave = async () => {
    // Province & City Validation
    if (!isCityValidForProvince()) {
      showNotification(
        "error",
        "Invalid City Selected",
        `Please select a valid city from ${formData.province || "the selected province"} before saving.`,
      );
      return;
    }

    setSaving(true);
    const result = await updateDonorProfileAPI(formData);
    setSaving(false);

    if (result.success) {
      setIsEditing(false);
      showNotification(
        "success",
        "Profile Updated",
        "Your donor profile details have been saved successfully!",
      );
    } else {
      showNotification(
        "error",
        "Update Failed",
        result.message || "Failed to update profile.",
      );
    }
  };

  const handleDeleteProfile = async () => {
    setDeleteLoading(true);
    const result = await deleteDonorProfileAPI();
    setDeleteLoading(false);
    setDeleteModalShow(false);

    if (result.success) {
      showNotification(
        "success",
        "Profile Deleted",
        "Your donor profile has been permanently removed.",
      );
    } else {
      showNotification(
        "error",
        "Deletion Failed",
        result.message || "Failed to delete profile.",
      );
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator size="large" color="#dc2626" />
        <AppText
          variant="bold"
          className="text-xs text-slate-400 uppercase tracking-widest mt-4"
        >
          Loading Profile Data...
        </AppText>
      </View>
    );
  }

  // UNREGISTERED CASE
  if (!donorProfile) {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 bg-slate-50"
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        <View className="px-5 pt-6 space-y-6">
          <View className="bg-white rounded-3xl p-6 border border-slate-100 shadow-md items-center overflow-hidden relative">
            <View className="w-full h-44 rounded-2xl overflow-hidden mb-5 bg-red-50 relative">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <LinearGradient
                colors={["transparent", "rgba(0,0,0,0.6)"]}
                className="absolute inset-0 justify-end p-4"
              >
                <View className="flex-row items-center">
                  <Sparkles size={16} color="#fca5a5" />
                  <AppText
                    variant="bold"
                    className="text-white text-xs uppercase tracking-widest ml-1.5"
                  >
                    Be A Lifesaver
                  </AppText>
                </View>
              </LinearGradient>
            </View>

            <AppText
              variant="black"
              className="text-2xl text-slate-900 text-center leading-tight mb-2"
            >
              You're Not Registered as a Blood Donor Yet
            </AppText>

            <AppText
              variant="medium"
              className="text-slate-500 text-sm text-center leading-6 mb-6"
            >
              Every single donation can save up to 3 lives. Join our verified
              network of emergency blood donors across Pakistan and become a
              hero in your local community today.
            </AppText>

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/(registration)/donor-registration",
                  params: { from: "profile" },
                })
              }
              activeOpacity={0.85}
              className="w-full h-14 rounded-[30px] overflow-hidden shadow-lg shadow-red-300"
            >
              <LinearGradient
                colors={["#dc2626", "#991b1b"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-full h-full flex-row items-center justify-center px-6"
              >
                <AppText
                  variant="black"
                  className="text-white text-base uppercase tracking-widest mr-2"
                >
                  Register as Donor Now
                </AppText>
                <ArrowRight size={18} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }

  // REGISTERED DONOR CASE
  const daysLeft = calculateDaysLeft(formData?.nextAvailableDate);
  const isLocked = daysLeft > 0;
  const hasChanges = isFormChanged();

  return (
    <View className="flex-1 bg-slate-50">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1 px-5 pt-5"
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Profile Card Header */}
        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-4">
          <View className="items-center mb-4">
            <View
              className={`w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden items-center justify-center mb-3 ${
                formData?.gender === "Female" ? "bg-rose-100" : "bg-sky-100"
              }`}
            >
              {formData?.profilePicture ? (
                <Image
                  source={{ uri: formData.profilePicture }}
                  className="w-full h-full"
                />
              ) : (
                <Image
                  source={{
                    uri:
                      formData?.gender === "Female"
                        ? FEMALE_AVATAR
                        : MALE_AVATAR,
                  }}
                  className="w-20 h-20"
                />
              )}
            </View>

            <View className="flex-row items-center mb-1">
              <AppText
                variant="black"
                className="text-xl text-slate-900 uppercase tracking-tight mr-1.5"
              >
                {formData?.fullName || "Donor"}
              </AppText>
              <ShieldCheck size={20} color="#3b82f6" />
            </View>

            <View className="flex-row items-center gap-3 mt-1">
              <View className="flex-row items-center">
                <MapPin size={14} color="#dc2626" />
                <AppText variant="bold" className="text-xs text-slate-400 ml-1">
                  {formData?.district || "N/A"}, {formData?.province || "N/A"}
                </AppText>
              </View>
              <View className="flex-row items-center">
                <Phone size={14} color="#10b981" />
                <AppText variant="bold" className="text-xs text-slate-400 ml-1">
                  {formData?.mobileNumber}
                </AppText>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between mb-4">
          <StatCard
            icon={<Heart size={18} color="white" />}
            label="LIVES SAVED"
            value={formData?.livesSaved ?? 0}
            colors={["#dc2626", "#991b1b"]}
          />
          <StatCard
            icon={<Star size={18} color="white" />}
            label="RATING"
            value={formData?.rating ?? "5.0"}
            colors={["#1e293b", "#0f172a"]}
          />
          <StatCard
            icon={<Calendar size={18} color="white" />}
            label="RECOVERY"
            value={isLocked ? `${daysLeft} Days` : "Ready"}
            colors={["#ef4444", "#dc2626"]}
          />
          <StatCard
            icon={<Droplet size={18} color="white" />}
            label="BLOOD TYPE"
            value={formData?.bloodType || "N/A"}
            colors={["#18181b", "#09090b"]}
          />
        </View>

        {/* Edit Data Section */}
        <View className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm mb-4 space-y-3">
          {/* Header Row with Wrap Support to Prevent Overflow */}
          <View className="flex-row justify-between items-center mb-2 flex-wrap gap-y-2">
            <View className="flex-row items-center">
              <View className="w-1.5 h-6 bg-red-600 rounded-full mr-2" />
              <AppText
                variant="black"
                className="text-slate-900 text-base uppercase"
              >
                Profile Information
              </AppText>
            </View>

            {/* Action Buttons: Edit / Cancel / Save */}
            {!isEditing ? (
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="flex-row items-center px-4 py-2 rounded-2xl bg-slate-900"
              >
                <Edit2 size={14} color="white" />
                <AppText
                  variant="bold"
                  className="text-white text-xs uppercase ml-1.5"
                >
                  Edit
                </AppText>
              </TouchableOpacity>
            ) : (
              <View className="flex-row items-center gap-2">
                <TouchableOpacity
                  onPress={handleCancel}
                  className="px-3.5 py-2 rounded-2xl bg-slate-100 border border-slate-200"
                >
                  <AppText
                    variant="bold"
                    className="text-slate-600 text-xs uppercase"
                  >
                    Cancel
                  </AppText>
                </TouchableOpacity>

                {hasChanges && (
                  <TouchableOpacity
                    onPress={handleSave}
                    disabled={saving}
                    className="flex-row items-center px-4 py-2 rounded-2xl bg-emerald-600"
                  >
                    {saving ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Save size={14} color="white" />
                    )}
                    <AppText
                      variant="bold"
                      className="text-white text-xs uppercase ml-1.5"
                    >
                      {saving ? "Saving..." : "Save"}
                    </AppText>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>

          <InputGroup
            label="Full Name"
            icon={User}
            value={formData?.fullName}
            isEditing={isEditing}
            onChangeText={(v) => handleFieldChange("fullName", v)}
          />

          {/* Gender Select Field */}
          <SelectGroup
            label="Gender"
            icon={Users}
            value={formData?.gender || "Select Gender"}
            isEditing={isEditing}
            onPress={() => isEditing && setActiveModal("gender")}
          />

          {/* Blood Group Select Component */}
          <SelectGroup
            label="Blood Group"
            icon={Droplet}
            value={formData?.bloodType || "Select Blood Group"}
            isEditing={isEditing}
            onPress={() => isEditing && setActiveModal("bloodType")}
          />

          <InputGroup
            label="Age"
            icon={Calendar}
            value={formData?.age?.toString()}
            keyboardType="numeric"
            isEditing={isEditing}
            onChangeText={(v) => handleFieldChange("age", v)}
          />

          <InputGroup
            label="Phone Number"
            icon={Phone}
            value={formData?.mobileNumber}
            keyboardType="phone-pad"
            isEditing={isEditing}
            onChangeText={(v) => handleFieldChange("mobileNumber", v)}
          />

          {/* Province Select Component */}
          <SelectGroup
            label="Province"
            icon={MapPin}
            value={formData?.province || "Select Province"}
            isEditing={isEditing}
            onPress={() => isEditing && setActiveModal("province")}
          />

          {/* City / District Select Component */}
          <SelectGroup
            label="City / District"
            icon={MapPin}
            value={formData?.district || "Select City"}
            isEditing={isEditing}
            onPress={() => {
              if (!isEditing) return;
              if (!formData?.province) {
                showNotification(
                  "error",
                  "Select Province First",
                  "Please select a province before picking a city.",
                );
                return;
              }
              setActiveModal("city");
            }}
          />

          {/* Search Visibility Toggle */}
          <View className="pt-2">
            <AppText
              variant="bold"
              className="text-[10px] uppercase tracking-widest text-slate-400 mb-1.5 ml-1"
            >
              Search Visibility Status
            </AppText>
            <View
              className={`flex-row items-center justify-between p-4 rounded-2xl border ${
                formData?.isAvailable
                  ? "bg-emerald-50/50 border-emerald-100"
                  : "bg-slate-50 border-slate-200"
              }`}
            >
              <View>
                <AppText
                  variant="bold"
                  className={`text-sm ${
                    formData?.isAvailable
                      ? "text-emerald-700"
                      : "text-slate-500"
                  }`}
                >
                  {isLocked
                    ? "Recovering"
                    : formData?.isAvailable
                      ? "Publicly Searchable"
                      : "Hidden from Search"}
                </AppText>
                <AppText
                  variant="medium"
                  className="text-slate-400 text-xs mt-0.5"
                >
                  {formData?.isAvailable
                    ? "You will appear in urgent blood searches"
                    : "You are currently hidden from search results"}
                </AppText>
              </View>

              <Switch
                value={formData?.isAvailable}
                disabled={!isEditing || isLocked}
                onValueChange={(val) => handleFieldChange("isAvailable", val)}
                trackColor={{ false: "#cbd5e1", true: "#10b981" }}
                thumbColor="#ffffff"
              />
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View className="bg-red-50/70 rounded-3xl p-5 border border-red-100 mt-2 mb-6">
          <View className="flex-row items-center mb-3">
            <View className="p-2.5 bg-red-100 rounded-2xl mr-3">
              <AlertTriangle size={22} color="#dc2626" />
            </View>
            <View className="flex-1">
              <AppText
                variant="black"
                className="text-slate-900 text-base uppercase"
              >
                Danger Zone
              </AppText>
              <AppText variant="medium" className="text-slate-500 text-xs">
                Deleting your donor profile is permanent.
              </AppText>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => setDeleteModalShow(true)}
            className="w-full bg-white border border-red-200 h-12 rounded-2xl flex-row items-center justify-center"
          >
            <Trash2 size={16} color="#dc2626" />
            <AppText
              variant="bold"
              className="text-red-600 text-xs uppercase tracking-widest ml-2"
            >
              Delete Donor Profile
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* SELECTION MODALS */}
      <SelectionModal
        visible={activeModal === "gender"}
        title="Select Gender"
        data={GENDER_OPTIONS}
        selectedValue={formData?.gender}
        onSelect={(val) => {
          handleFieldChange("gender", val);
          setActiveModal(null);
        }}
        onClose={() => setActiveModal(null)}
      />

      <SelectionModal
        visible={activeModal === "bloodType"}
        title="Select Blood Group"
        data={BLOOD_GROUPS}
        selectedValue={formData?.bloodType}
        onSelect={(val) => {
          handleFieldChange("bloodType", val);
          setActiveModal(null);
        }}
        onClose={() => setActiveModal(null)}
      />

      <SelectionModal
        visible={activeModal === "province"}
        title="Select Province"
        data={availableProvinces}
        selectedValue={formData?.province}
        onSelect={(val) => {
          handleFieldChange("province", val);
          handleFieldChange("district", ""); // Reset city selection when province changes
          setActiveModal(null);
        }}
        onClose={() => setActiveModal(null)}
      />

      <SelectionModal
        visible={activeModal === "city"}
        title={`Select City (${formData?.province || ""})`}
        data={availableCities}
        selectedValue={formData?.district}
        onSelect={(val) => {
          handleFieldChange("district", val);
          setActiveModal(null);
        }}
        onClose={() => setActiveModal(null)}
      />

      {/* Feedback Modal Popup */}
      <Modal visible={feedbackModal.visible} transparent animationType="fade">
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm items-center shadow-2xl">
            <View
              className={`w-14 h-14 rounded-full items-center justify-center mb-3 ${
                feedbackModal.type === "success"
                  ? "bg-emerald-100"
                  : "bg-red-100"
              }`}
            >
              {feedbackModal.type === "success" ? (
                <CheckCircle2 size={28} color="#059669" />
              ) : (
                <XCircle size={28} color="#dc2626" />
              )}
            </View>

            <AppText
              variant="black"
              className="text-lg text-slate-900 uppercase mb-1 text-center"
            >
              {feedbackModal.title}
            </AppText>
            <AppText
              variant="medium"
              className="text-slate-500 text-xs text-center leading-5 mb-6"
            >
              {feedbackModal.message}
            </AppText>

            <TouchableOpacity
              onPress={() =>
                setFeedbackModal({ ...feedbackModal, visible: false })
              }
              className={`w-full h-12 rounded-2xl items-center justify-center ${
                feedbackModal.type === "success"
                  ? "bg-emerald-600"
                  : "bg-red-600"
              }`}
            >
              <AppText
                variant="bold"
                className="text-white text-sm uppercase tracking-wider"
              >
                Okay
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal visible={deleteModalShow} transparent animationType="fade">
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm items-center shadow-2xl">
            <View className="w-14 h-14 bg-red-100 rounded-full items-center justify-center mb-3">
              <AlertTriangle size={28} color="#dc2626" />
            </View>

            <AppText
              variant="black"
              className="text-lg text-slate-900 uppercase mb-1"
            >
              Delete Profile?
            </AppText>
            <AppText
              variant="medium"
              className="text-slate-500 text-xs text-center leading-5 mb-6"
            >
              Are you sure? This action will permanently remove your visibility
              as an emergency donor.
            </AppText>

            <View className="w-full space-y-2">
              <TouchableOpacity
                onPress={handleDeleteProfile}
                disabled={deleteLoading}
                className="w-full h-12 bg-red-600 rounded-2xl items-center justify-center"
              >
                {deleteLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <AppText
                    variant="bold"
                    className="text-white text-sm uppercase"
                  >
                    Yes, Delete Profile
                  </AppText>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setDeleteModalShow(false)}
                className="w-full h-12 bg-slate-100 rounded-2xl items-center justify-center mt-2"
              >
                <AppText
                  variant="bold"
                  className="text-slate-700 text-sm uppercase"
                >
                  Cancel
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Sub-components
const StatCard = ({ icon, label, value, colors }) => (
  <View className="w-[48%] mb-3">
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="p-4 rounded-3xl items-center justify-center shadow-sm"
    >
      <View className="bg-white/10 p-2 rounded-xl mb-1">{icon}</View>
      <AppText
        variant="bold"
        className="text-[9px] uppercase tracking-widest text-white/70 mb-0.5"
      >
        {label}
      </AppText>
      <AppText variant="black" className="text-white text-lg">
        {value}
      </AppText>
    </LinearGradient>
  </View>
);

const InputGroup = ({
  label,
  icon: Icon,
  value,
  onChangeText,
  isEditing,
  keyboardType = "default",
}) => (
  <View className="mb-3">
    <AppText
      variant="bold"
      className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 ml-1"
    >
      {label}
    </AppText>
    <View
      className={`flex-row items-center px-4 h-12 rounded-2xl border ${
        isEditing
          ? "bg-white border-red-500"
          : "bg-slate-50/80 border-slate-100"
      }`}
    >
      <Icon size={16} color={isEditing ? "#dc2626" : "#94a3b8"} />
      <TextInput
        value={value ? String(value) : ""}
        onChangeText={onChangeText}
        editable={isEditing}
        keyboardType={keyboardType}
        className="flex-1 ml-3 font-semibold text-slate-800 text-sm py-0"
      />
    </View>
  </View>
);

const SelectGroup = ({ label, icon: Icon, value, isEditing, onPress }) => (
  <View className="mb-3">
    <AppText
      variant="bold"
      className="text-[10px] uppercase tracking-widest text-slate-400 mb-1 ml-1"
    >
      {label}
    </AppText>
    <TouchableOpacity
      activeOpacity={isEditing ? 0.7 : 1}
      onPress={onPress}
      className={`flex-row items-center justify-between px-4 h-12 rounded-2xl border ${
        isEditing
          ? "bg-white border-red-500"
          : "bg-slate-50/80 border-slate-100"
      }`}
    >
      <View className="flex-row items-center flex-1 mr-2">
        <Icon size={16} color={isEditing ? "#dc2626" : "#94a3b8"} />
        <AppText
          variant="bold"
          className="ml-3 text-slate-800 text-sm"
          numberOfLines={1}
        >
          {value}
        </AppText>
      </View>
      {isEditing && <ChevronDown size={16} color="#dc2626" />}
    </TouchableOpacity>
  </View>
);
