import React from "react";
import { View, Modal, TouchableOpacity } from "react-native";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react-native";
import AppText from "../../../components/AppText";
import { styles } from "../styles/seekerHomeStyles";

export default function SeekerFeedbackModal({
  visible,
  title,
  message,
  type,
  onClose,
}) {
  if (!visible) return null;

  const renderIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={32} color="#16a34a" />;
      case "error":
        return <XCircle size={32} color="#dc2626" />;
      default:
        return <AlertCircle size={32} color="#2563eb" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "#f0fdf4";
      case "error":
        return "#fef2f2";
      default:
        return "#eff6ff";
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View
            style={[
              styles.modalIconContainer,
              { backgroundColor: getBgColor() },
            ]}
          >
            {renderIcon()}
          </View>
          <AppText variant="bold" style={styles.modalTitle}>
            {title}
          </AppText>
          <AppText variant="medium" style={styles.modalMessage}>
            {message}
          </AppText>
          <TouchableOpacity
            style={styles.modalCloseBtn}
            activeOpacity={0.8}
            onPress={onClose}
          >
            <AppText variant="bold" style={styles.modalCloseBtnText}>
              Dismiss
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
