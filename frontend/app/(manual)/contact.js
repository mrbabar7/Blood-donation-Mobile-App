import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
  Linking,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Siren,
  ChevronDown,
  Check,
} from "lucide-react-native";

// Replace with your API base URL or process.env configuration
const API_URL = process.env.EXPO_PUBLIC_API_URL;

const SUBJECT_OPTIONS = [
  "General Inquiry",
  "Blood Request Support",
  "Partnership Proposal",
  "Report an Issue",
];

export default function ContactUsScreen() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.message.trim()
    ) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert(
          "Success",
          "Message sent successfully! Admin will contact you soon.",
        );
        setFormData({
          name: "",
          email: "",
          subject: "General Inquiry",
          message: "",
        });
      } else {
        Alert.alert("Error", data.message || "Failed to send message.");
      }
    } catch (err) {
      Alert.alert("Error", "Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhonePress = () => {
    Linking.openURL("tel:+923403745700");
  };

  const handleEmailPress = () => {
    Linking.openURL("mailto:info@blooddonation.pk");
  };

  const handleMapPress = () => {
    const query = encodeURIComponent("Renala Khurd, Okara, Pakistan");
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* --- HERO HEADER --- */}
      <LinearGradient
        colors={["#dc2626", "#ef4444", "#f97316"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroContainer}
      >
        <Text style={styles.heroSubtitle}>
          Whether you have urgent questions regarding blood donation or need
          immediate assistance with emergency healthcare resources across
          Pakistan, our dedicated team is available 24/7.
        </Text>
      </LinearGradient>

      <View style={styles.bodyPadding}>
        {/* --- CONTACT FORM --- */}
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Send Us a Message</Text>

          {/* Name Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Doe"
              placeholderTextColor="#9ca3af"
              value={formData.name}
              onChangeText={(text) => handleInputChange("name", text)}
            />
          </View>

          {/* Email Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="john@example.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleInputChange("email", text)}
            />
          </View>

          {/* Subject Dropdown Picker */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Subject</Text>
            <TouchableOpacity
              style={styles.selectButton}
              activeOpacity={0.8}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.selectButtonText}>{formData.subject}</Text>
              <ChevronDown size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Message Field */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Message</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="How can we help you?"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              value={formData.message}
              onChangeText={(text) => handleInputChange("message", text)}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitButton}
            activeOpacity={0.85}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <View style={styles.buttonInner}>
                <Text style={styles.submitButtonText}>Send Message</Text>
                <Send size={18} color="#ffffff" style={styles.sendIcon} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* --- CONTACT INFORMATION --- */}
        <View style={styles.infoSection}>
          <Text style={styles.headingText}>Contact Information</Text>
          <Text style={styles.subHeadingText}>
            Reach out through any of our channels or visit our central office.
          </Text>

          <View style={styles.infoList}>
            {/* Phone */}
            <TouchableOpacity
              style={styles.infoCard}
              activeOpacity={0.7}
              onPress={handlePhonePress}
            >
              <View style={styles.iconBox}>
                <Phone size={22} color="#E25555" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Call Us</Text>
                <Text style={styles.infoValue}>+92 340 3745700</Text>
              </View>
            </TouchableOpacity>

            {/* Email */}
            <TouchableOpacity
              style={styles.infoCard}
              activeOpacity={0.7}
              onPress={handleEmailPress}
            >
              <View style={styles.iconBox}>
                <Mail size={22} color="#E25555" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Email Us</Text>
                <Text style={styles.infoValue}>info@blooddonation.pk</Text>
              </View>
            </TouchableOpacity>

            {/* Address */}
            <TouchableOpacity
              style={styles.infoCard}
              activeOpacity={0.7}
              onPress={handleMapPress}
            >
              <View style={styles.iconBox}>
                <MapPin size={22} color="#E25555" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Visit Us</Text>
                <Text style={styles.infoValue}>
                  Renala Khurd, Okara, Pakistan
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Map External Action Button */}
          <TouchableOpacity
            style={styles.mapCard}
            activeOpacity={0.85}
            onPress={handleMapPress}
          >
            <MapPin size={32} color="#9ca3af" />
            <Text style={styles.mapCardTitle}>Open Location in Maps</Text>
            <Text style={styles.mapCardSub}>Renala Khurd, Okara, Pakistan</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* --- SUBJECT SELECTION MODAL --- */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Subject</Text>
            {SUBJECT_OPTIONS.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.modalOption}
                onPress={() => {
                  handleInputChange("subject", item);
                  setModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    formData.subject === item && styles.selectedOptionText,
                  ]}
                >
                  {item}
                </Text>
                {formData.subject === item && (
                  <Check size={18} color="#dc2626" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  heroContainer: {
    marginTop: 20,
    backgroundColor: "#ffffff",
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  heroContent: {
    zIndex: 2,
    alignItems: "center",
  },

  heroSubtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fef2f2",
    lineHeight: 19,
    maxWidth: 320,
    opacity: 0.95,
  },

  bodyPadding: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
    marginLeft: 2,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1f2937",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  textArea: {
    height: 110,
  },
  selectButton: {
    backgroundColor: "#f9fafb",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectButtonText: {
    fontSize: 14,
    color: "#1f2937",
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#dc2626",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    elevation: 2,
    shadowColor: "#dc2626",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  buttonInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  sendIcon: {
    marginLeft: 8,
  },
  infoSection: {
    marginBottom: 20,
  },
  headingText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 6,
  },
  subHeadingText: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 20,
    lineHeight: 18,
  },
  infoList: {
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
  },
  iconBox: {
    backgroundColor: "#fef2f2",
    padding: 12,
    borderRadius: 14,
    marginRight: 14,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1f2937",
    marginTop: 2,
  },
  mapCard: {
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderStyle: "dashed",
  },
  mapCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
    marginTop: 8,
  },
  mapCardSub: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 36,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f2937",
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  modalOptionText: {
    fontSize: 15,
    color: "#4b5563",
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "#dc2626",
    fontWeight: "800",
  },
});
