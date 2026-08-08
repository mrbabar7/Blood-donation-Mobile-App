// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
//   Modal,
//   KeyboardAvoidingView,
//   Platform,
//   StatusBar,
//   SafeAreaView,
// } from "react-native";
// import { useRouter } from "expo-router";
// import * as SecureStore from "expo-secure-store";
// import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
// import { useAuth } from "../../context/AuthContext";
// import { useDonor } from "../../context/DonorContext";

// const API_URL = process.env.EXPO_PUBLIC_API_URL;

// export default function AccountSettings() {
//   const router = useRouter();
//   const { user, setUser } = useAuth();
//   const { fetchDonorStatus } = useDonor();

//   // Loading States
//   const [initialLoading, setInitialLoading] = useState(true);
//   const [savingProfile, setSavingProfile] = useState(false);
//   const [requestingOtp, setRequestingOtp] = useState(false);
//   const [verifyingOtp, setVerifyingOtp] = useState(false);
//   const [resendingOtp, setResendingOtp] = useState(false);
//   const [changingPassword, setChangingPassword] = useState(false);
//   const [deletingAccount, setDeletingAccount] = useState(false);

//   // Profile Form States
//   const [fullName, setFullName] = useState("");
//   const [currentEmail, setCurrentEmail] = useState("");
//   const [isDonorUser, setIsDonorUser] = useState(false);

//   // Email Change States
//   const [newEmail, setNewEmail] = useState("");
//   const [otpCode, setOtpCode] = useState("");

//   // Password Change States
//   const [currentPassword, setCurrentPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   // Password Visibility Toggles
//   const [showCurrentPass, setShowCurrentPass] = useState(false);
//   const [showNewPass, setShowNewPass] = useState(false);
//   const [showConfirmPass, setShowConfirmPass] = useState(false);
//   const [showDeletePass, setShowDeletePass] = useState(false);

//   // Delete Account State
//   const [deletePassword, setDeletePassword] = useState("");

//   // Validation Error States (Per Field)
//   const [fieldErrors, setFieldErrors] = useState({});

//   // Modal Visibility States
//   const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
//   const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

//   // Custom Alert Modal State
//   const [alertModal, setAlertModal] = useState({
//     visible: false,
//     type: "info", // "success" | "error" | "info"
//     title: "",
//     message: "",
//   });

//   // Fetch initial profile on mount
//   useEffect(() => {
//     loadUserProfile();
//   }, []);

//   const showAlert = (type, title, message) => {
//     setAlertModal({ visible: true, type, title, message });
//   };

//   const hideAlert = () => {
//     setAlertModal({ visible: false, type: "info", title: "", message: "" });
//   };

//   const clearFieldError = (fieldName) => {
//     setFieldErrors((prev) => ({ ...prev, [fieldName]: null }));
//   };

//   // Helper to fetch user headers
//   const getAuthHeaders = async () => {
//     const token = await SecureStore.getItemAsync("userToken");
//     return {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//     };
//   };

//   // 1. Load User Profile
//   const loadUserProfile = async () => {
//     setInitialLoading(true);
//     try {
//       const headers = await getAuthHeaders();
//       const res = await fetch(`${API_URL}/api/user/profile`, { headers });
//       const data = await res.json();

//       if (res.ok && data.success) {
//         setFullName(data.user.fullName || "");
//         setCurrentEmail(data.user.email || "");
//         setIsDonorUser(!!data.user.isDonor);
//       } else {
//         showAlert(
//           "error",
//           "Error",
//           data.message || "Failed to load account settings.",
//         );
//       }
//     } catch (err) {
//       showAlert("error", "Network Error", "Could not connect to the server.");
//     } finally {
//       setInitialLoading(false);
//     }
//   };

//   // 2. Update Personal Info (Name & Phone)
//   const handleUpdatePersonalInfo = async () => {
//     const errors = {};
//     if (!fullName.trim()) errors.fullName = "Full name is required";

//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//       return;
//     }

//     setSavingProfile(true);
//     try {
//       const headers = await getAuthHeaders();
//       const res = await fetch(`${API_URL}/api/user/profile`, {
//         method: "PUT",
//         headers,
//         body: JSON.stringify({
//           fullName: fullName.trim(),
//         }),
//       });
//       const data = await res.json();

//       if (res.ok && data.success) {
//         // Sync context
//         if (user) {
//           const updatedUserObj = {
//             ...user,
//             fullName: fullName.trim(),
//           };
//           await SecureStore.setItemAsync(
//             "user",
//             JSON.stringify(updatedUserObj),
//           );
//           if (setUser) setUser(updatedUserObj);
//         }
//         showAlert(
//           "success",
//           "Success",
//           "Personal details updated successfully.",
//         );
//       } else {
//         showAlert(
//           "error",
//           "Update Failed",
//           data.message || "Failed to update personal info.",
//         );
//       }
//     } catch (err) {
//       showAlert(
//         "error",
//         "Network Error",
//         "Failed to communicate with backend server.",
//       );
//     } finally {
//       setSavingProfile(false);
//     }
//   };

//   // 3. Request Email Change (Step 1)
//   const handleRequestEmailChange = async () => {
//     const errors = {};
//     const emailRegex = /\S+@\S+\.\S+/;

//     if (!newEmail.trim()) {
//       errors.newEmail = "New email address is required";
//     } else if (!emailRegex.test(newEmail.trim())) {
//       errors.newEmail = "Please enter a valid email address";
//     } else if (newEmail.trim().toLowerCase() === currentEmail.toLowerCase()) {
//       errors.newEmail = "New email cannot be the same as your current email";
//     }

//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//       return;
//     }

//     setRequestingOtp(true);
//     try {
//       const headers = await getAuthHeaders();
//       const res = await fetch(`${API_URL}/api/user/request-email-change`, {
//         method: "POST",
//         headers,
//         body: JSON.stringify({ newEmail: newEmail.trim().toLowerCase() }),
//       });
//       const data = await res.json();

//       if (res.ok && data.success) {
//         setIsOtpModalVisible(true);
//         showAlert(
//           "info",
//           "OTP Sent",
//           `Verification code sent to ${newEmail.trim()}`,
//         );
//       } else {
//         showAlert(
//           "error",
//           "Request Failed",
//           data.message || "Failed to request email change.",
//         );
//       }
//     } catch (err) {
//       showAlert("error", "Network Error", "Unable to send verification OTP.");
//     } finally {
//       setRequestingOtp(false);
//     }
//   };

//   // 4. Resend Email Change OTP
//   const handleResendOtp = async () => {
//     setResendingOtp(true);
//     try {
//       const headers = await getAuthHeaders();
//       const res = await fetch(`${API_URL}/api/user/resend-email-change-otp`, {
//         method: "POST",
//         headers,
//       });
//       const data = await res.json();

//       if (res.ok && data.success) {
//         showAlert(
//           "success",
//           "OTP Sent",
//           "A new code has been sent to your new email.",
//         );
//       } else {
//         showAlert(
//           "error",
//           "Resend Failed",
//           data.message || "Could not resend OTP.",
//         );
//       }
//     } catch (err) {
//       showAlert("error", "Network Error", "Failed to resend code.");
//     } finally {
//       setResendingOtp(false);
//     }
//   };

//   // 5. Verify Email Change OTP (Step 2)
//   const handleVerifyEmailOtp = async () => {
//     const errors = {};
//     if (!otpCode.trim() || otpCode.trim().length !== 6) {
//       errors.otpCode = "Please enter a valid 6-digit OTP code";
//     }

//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//       return;
//     }

//     setVerifyingOtp(true);
//     try {
//       const headers = await getAuthHeaders();
//       const res = await fetch(`${API_URL}/api/user/verify-email-change`, {
//         method: "POST",
//         headers,
//         body: JSON.stringify({ otp: otpCode.trim() }),
//       });
//       const data = await res.json();

//       if (res.ok && data.success) {
//         setCurrentEmail(data.newEmail || newEmail.trim().toLowerCase());
//         setNewEmail("");
//         setOtpCode("");
//         setIsOtpModalVisible(false);

//         // Sync local auth user
//         if (user) {
//           const updatedUserObj = {
//             ...user,
//             email: data.newEmail || newEmail.trim(),
//           };
//           await SecureStore.setItemAsync(
//             "user",
//             JSON.stringify(updatedUserObj),
//           );
//           if (setUser) setUser(updatedUserObj);
//         }

//         showAlert(
//           "success",
//           "Email Updated",
//           "Your email address has been updated successfully.",
//         );
//       } else {
//         showAlert(
//           "error",
//           "Verification Failed",
//           data.message || "Invalid or expired OTP code.",
//         );
//       }
//     } catch (err) {
//       showAlert("error", "Network Error", "Failed to verify OTP.");
//     } finally {
//       setVerifyingOtp(false);
//     }
//   };

//   // 6. Update Password
//   const handleChangePassword = async () => {
//     const errors = {};
//     if (!currentPassword)
//       errors.currentPassword = "Current password is required";
//     if (!newPassword) {
//       errors.newPassword = "New password is required";
//     } else if (newPassword.length < 6) {
//       errors.newPassword = "Password must be at least 6 characters long";
//     }

//     if (newPassword !== confirmPassword) {
//       errors.confirmPassword = "Passwords do not match";
//     }

//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//       return;
//     }

//     setChangingPassword(true);
//     try {
//       const headers = await getAuthHeaders();
//       const res = await fetch(`${API_URL}/api/user/change-password`, {
//         method: "PUT",
//         headers,
//         body: JSON.stringify({ currentPassword, newPassword }),
//       });
//       const data = await res.json();

//       if (res.ok && data.success) {
//         setCurrentPassword("");
//         setNewPassword("");
//         setConfirmPassword("");
//         showAlert(
//           "success",
//           "Password Changed",
//           "Your password has been updated successfully.",
//         );
//       } else {
//         if (data.field === "currentPassword") {
//           setFieldErrors({ currentPassword: data.message });
//         } else {
//           showAlert(
//             "error",
//             "Update Failed",
//             data.message || "Could not update password.",
//           );
//         }
//       }
//     } catch (err) {
//       showAlert("error", "Network Error", "Failed to change password.");
//     } finally {
//       setChangingPassword(false);
//     }
//   };

//   // 7. Confirm Account Deletion
//   const handleConfirmDeleteAccount = async () => {
//     const errors = {};
//     if (!deletePassword)
//       errors.deletePassword = "Password is required to confirm deletion";

//     if (Object.keys(errors).length > 0) {
//       setFieldErrors(errors);
//       return;
//     }

//     setDeletingAccount(true);
//     try {
//       const headers = await getAuthHeaders();
//       const res = await fetch(`${API_URL}/api/user/delete-account`, {
//         method: "DELETE",
//         headers,
//         body: JSON.stringify({ password: deletePassword }),
//       });
//       const data = await res.json();

//       if (res.ok && data.success) {
//         setIsDeleteModalVisible(false);
//         setDeletePassword("");

//         // Perform clean logout steps
//         await SecureStore.deleteItemAsync("userToken");
//         await SecureStore.deleteItemAsync("user");

//         if (setUser) setUser(null);
//         if (fetchDonorStatus) await fetchDonorStatus();

//         showAlert(
//           "info",
//           "Account Deleted",
//           "Your account and donor records have been completely removed.",
//         );

//         // Redirect after brief delay
//         setTimeout(() => {
//           router.replace("/(dashboard)");
//         }, 1200);
//       } else {
//         setFieldErrors({
//           deletePassword: data.message || "Incorrect password",
//         });
//       }
//     } catch (err) {
//       showAlert(
//         "error",
//         "Network Error",
//         "Failed to process account deletion.",
//       );
//     } finally {
//       setDeletingAccount(false);
//     }
//   };

//   if (initialLoading) {
//     return (
//       <View style={styles.centerContainer}>
//         <ActivityIndicator size="large" color="#DC2626" />
//         <Text style={styles.loadingText}>Loading Account Details...</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.safeArea}>
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* PROFILE SUMMARY BADGE */}
//           <View style={styles.userBanner}>
//             <View style={styles.avatarCircle}>
//               <Text style={styles.avatarText}>
//                 {fullName ? fullName.charAt(0).toUpperCase() : "U"}
//               </Text>
//             </View>
//             <View style={styles.bannerDetails}>
//               <Text style={styles.userName}>{fullName || "User Name"}</Text>
//               <Text style={styles.userEmail}>{currentEmail}</Text>
//               {isDonorUser && (
//                 <View style={styles.donorBadge}>
//                   <MaterialCommunityIcons
//                     name="heart-pulse"
//                     size={14}
//                     color="#DC2626"
//                   />
//                   <Text style={styles.donorBadgeText}>Registered Donor</Text>
//                 </View>
//               )}
//             </View>
//           </View>

//           {/* SECTION 1: PERSONAL INFORMATION */}
//           <View style={styles.card}>
//             <View style={styles.cardHeader}>
//               <Ionicons name="person-outline" size={20} color="#DC2626" />
//               <Text style={styles.cardTitle}>Personal Information</Text>
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Full Name</Text>
//               <View
//                 style={[
//                   styles.inputWrapper,
//                   fieldErrors.fullName && styles.inputErrorBorder,
//                 ]}
//               >
//                 <Feather
//                   name="user"
//                   size={18}
//                   color="#64748B"
//                   style={styles.inputIcon}
//                 />
//                 <TextInput
//                   style={styles.textInput}
//                   value={fullName}
//                   onChangeText={(val) => {
//                     setFullName(val);
//                     clearFieldError("fullName");
//                   }}
//                   placeholder="Enter full name"
//                   placeholderTextColor="#94A3B8"
//                 />
//               </View>
//               {fieldErrors.fullName && (
//                 <Text style={styles.errorText}>{fieldErrors.fullName}</Text>
//               )}
//             </View>
//             <TouchableOpacity
//               style={[
//                 styles.primaryButton,
//                 savingProfile && styles.buttonDisabled,
//               ]}
//               onPress={handleUpdatePersonalInfo}
//               disabled={savingProfile}
//             >
//               {savingProfile ? (
//                 <ActivityIndicator color="#FFF" />
//               ) : (
//                 <Text style={styles.primaryButtonText}>
//                   Save Personal Details
//                 </Text>
//               )}
//             </TouchableOpacity>
//           </View>

//           {/* SECTION 2: EMAIL ADDRESS MANAGEMENT */}
//           <View style={styles.card}>
//             <View style={styles.cardHeader}>
//               <Ionicons name="mail-outline" size={20} color="#DC2626" />
//               <Text style={styles.cardTitle}>Email Address</Text>
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Current Email</Text>
//               <View style={[styles.inputWrapper, styles.disabledInput]}>
//                 <Feather
//                   name="lock"
//                   size={18}
//                   color="#94A3B8"
//                   style={styles.inputIcon}
//                 />
//                 <TextInput
//                   style={[styles.textInput, { color: "#64748B" }]}
//                   value={currentEmail}
//                   editable={false}
//                 />
//               </View>
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>New Email Address</Text>
//               <View
//                 style={[
//                   styles.inputWrapper,
//                   fieldErrors.newEmail && styles.inputErrorBorder,
//                 ]}
//               >
//                 <Feather
//                   name="mail"
//                   size={18}
//                   color="#64748B"
//                   style={styles.inputIcon}
//                 />
//                 <TextInput
//                   style={styles.textInput}
//                   value={newEmail}
//                   onChangeText={(val) => {
//                     setNewEmail(val);
//                     clearFieldError("newEmail");
//                   }}
//                   placeholder="Enter new email address"
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                   placeholderTextColor="#94A3B8"
//                 />
//               </View>
//               {fieldErrors.newEmail && (
//                 <Text style={styles.errorText}>{fieldErrors.newEmail}</Text>
//               )}
//             </View>

//             <TouchableOpacity
//               style={[
//                 styles.secondaryButton,
//                 requestingOtp && styles.buttonDisabled,
//               ]}
//               onPress={handleRequestEmailChange}
//               disabled={requestingOtp}
//             >
//               {requestingOtp ? (
//                 <ActivityIndicator color="#DC2626" />
//               ) : (
//                 <Text style={styles.secondaryButtonText}>
//                   Send Email Verification Code
//                 </Text>
//               )}
//             </TouchableOpacity>
//           </View>

//           {/* SECTION 3: CHANGE PASSWORD */}
//           <View style={styles.card}>
//             <View style={styles.cardHeader}>
//               <Ionicons name="key-outline" size={20} color="#DC2626" />
//               <Text style={styles.cardTitle}>Change Password</Text>
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Current Password</Text>
//               <View
//                 style={[
//                   styles.inputWrapper,
//                   fieldErrors.currentPassword && styles.inputErrorBorder,
//                 ]}
//               >
//                 <Feather
//                   name="lock"
//                   size={18}
//                   color="#64748B"
//                   style={styles.inputIcon}
//                 />
//                 <TextInput
//                   style={styles.textInput}
//                   value={currentPassword}
//                   onChangeText={(val) => {
//                     setCurrentPassword(val);
//                     clearFieldError("currentPassword");
//                   }}
//                   secureTextEntry={!showCurrentPass}
//                   placeholder="Enter current password"
//                   placeholderTextColor="#94A3B8"
//                 />
//                 <TouchableOpacity
//                   onPress={() => setShowCurrentPass(!showCurrentPass)}
//                 >
//                   <Feather
//                     name={showCurrentPass ? "eye" : "eye-off"}
//                     size={18}
//                     color="#64748B"
//                   />
//                 </TouchableOpacity>
//               </View>
//               {fieldErrors.currentPassword && (
//                 <Text style={styles.errorText}>
//                   {fieldErrors.currentPassword}
//                 </Text>
//               )}
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>New Password</Text>
//               <View
//                 style={[
//                   styles.inputWrapper,
//                   fieldErrors.newPassword && styles.inputErrorBorder,
//                 ]}
//               >
//                 <Feather
//                   name="shield"
//                   size={18}
//                   color="#64748B"
//                   style={styles.inputIcon}
//                 />
//                 <TextInput
//                   style={styles.textInput}
//                   value={newPassword}
//                   onChangeText={(val) => {
//                     setNewPassword(val);
//                     clearFieldError("newPassword");
//                   }}
//                   secureTextEntry={!showNewPass}
//                   placeholder="At least 6 characters"
//                   placeholderTextColor="#94A3B8"
//                 />
//                 <TouchableOpacity onPress={() => setShowNewPass(!showNewPass)}>
//                   <Feather
//                     name={showNewPass ? "eye" : "eye-off"}
//                     size={18}
//                     color="#64748B"
//                   />
//                 </TouchableOpacity>
//               </View>
//               {fieldErrors.newPassword && (
//                 <Text style={styles.errorText}>{fieldErrors.newPassword}</Text>
//               )}
//             </View>

//             <View style={styles.inputGroup}>
//               <Text style={styles.label}>Confirm New Password</Text>
//               <View
//                 style={[
//                   styles.inputWrapper,
//                   fieldErrors.confirmPassword && styles.inputErrorBorder,
//                 ]}
//               >
//                 <Feather
//                   name="shield"
//                   size={18}
//                   color="#64748B"
//                   style={styles.inputIcon}
//                 />
//                 <TextInput
//                   style={styles.textInput}
//                   value={confirmPassword}
//                   onChangeText={(val) => {
//                     setConfirmPassword(val);
//                     clearFieldError("confirmPassword");
//                   }}
//                   secureTextEntry={!showConfirmPass}
//                   placeholder="Re-enter new password"
//                   placeholderTextColor="#94A3B8"
//                 />
//                 <TouchableOpacity
//                   onPress={() => setShowConfirmPass(!showConfirmPass)}
//                 >
//                   <Feather
//                     name={showConfirmPass ? "eye" : "eye-off"}
//                     size={18}
//                     color="#64748B"
//                   />
//                 </TouchableOpacity>
//               </View>
//               {fieldErrors.confirmPassword && (
//                 <Text style={styles.errorText}>
//                   {fieldErrors.confirmPassword}
//                 </Text>
//               )}
//             </View>

//             <TouchableOpacity
//               style={[
//                 styles.primaryButton,
//                 changingPassword && styles.buttonDisabled,
//               ]}
//               onPress={handleChangePassword}
//               disabled={changingPassword}
//             >
//               {changingPassword ? (
//                 <ActivityIndicator color="#FFF" />
//               ) : (
//                 <Text style={styles.primaryButtonText}>Update Password</Text>
//               )}
//             </TouchableOpacity>
//           </View>

//           {/* SECTION 4: DANGER ZONE */}
//           <View style={[styles.card, styles.dangerCard]}>
//             <View style={styles.cardHeader}>
//               <Ionicons name="warning-outline" size={22} color="#DC2626" />
//               <Text style={[styles.cardTitle, { color: "#991B1B" }]}>
//                 Danger Zone
//               </Text>
//             </View>
//             <Text style={styles.dangerText}>
//               Deleting your account is permanent. All your registered user
//               profile information and associated donor status will be removed
//               forever.
//             </Text>

//             <TouchableOpacity
//               style={styles.dangerButton}
//               onPress={() => {
//                 setDeletePassword("");
//                 clearFieldError("deletePassword");
//                 setIsDeleteModalVisible(true);
//               }}
//             >
//               <Ionicons
//                 name="trash-outline"
//                 size={18}
//                 color="#FFF"
//                 style={{ marginRight: 6 }}
//               />
//               <Text style={styles.dangerButtonText}>Delete My Account</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>

//       {/* STEP 2: EMAIL OTP VERIFICATION MODAL */}
//       <Modal visible={isOtpModalVisible} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <TouchableOpacity
//               style={styles.closeModalButton}
//               onPress={() => setIsOtpModalVisible(false)}
//             >
//               <Ionicons name="close" size={22} color="#64748B" />
//             </TouchableOpacity>

//             <View style={styles.modalIconCircle}>
//               <MaterialCommunityIcons
//                 name="email-check-outline"
//                 size={32}
//                 color="#DC2626"
//               />
//             </View>

//             <Text style={styles.modalTitle}>Verify New Email</Text>
//             <Text style={styles.modalSubTitle}>
//               Enter the 6-digit verification code sent to{"\n"}
//               <Text style={{ fontWeight: "700", color: "#1E293B" }}>
//                 {newEmail}
//               </Text>
//             </Text>

//             <View
//               style={[
//                 styles.inputWrapper,
//                 fieldErrors.otpCode && styles.inputErrorBorder,
//                 { marginTop: 15 },
//               ]}
//             >
//               <MaterialCommunityIcons
//                 name="shield-key-outline"
//                 size={20}
//                 color="#64748B"
//                 style={styles.inputIcon}
//               />
//               <TextInput
//                 style={[
//                   styles.textInput,
//                   { letterSpacing: 4, fontWeight: "700", fontSize: 18 },
//                 ]}
//                 value={otpCode}
//                 onChangeText={(val) => {
//                   setOtpCode(val);
//                   clearFieldError("otpCode");
//                 }}
//                 keyboardType="number-pad"
//                 maxLength={6}
//                 placeholder="000000"
//                 placeholderTextColor="#94A3B8"
//               />
//             </View>
//             {fieldErrors.otpCode && (
//               <Text style={styles.errorText}>{fieldErrors.otpCode}</Text>
//             )}

//             <TouchableOpacity
//               style={[
//                 styles.primaryButton,
//                 { marginTop: 20 },
//                 verifyingOtp && styles.buttonDisabled,
//               ]}
//               onPress={handleVerifyEmailOtp}
//               disabled={verifyingOtp}
//             >
//               {verifyingOtp ? (
//                 <ActivityIndicator color="#FFF" />
//               ) : (
//                 <Text style={styles.primaryButtonText}>Verify Email</Text>
//               )}
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={{ marginTop: 15, paddingVertical: 8 }}
//               onPress={handleResendOtp}
//               disabled={resendingOtp}
//             >
//               {resendingOtp ? (
//                 <ActivityIndicator color="#DC2626" size="small" />
//               ) : (
//                 <Text
//                   style={{ color: "#DC2626", fontWeight: "600", fontSize: 14 }}
//                 >
//                   Resend Code
//                 </Text>
//               )}
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>

//       {/* CONFIRM DELETE ACCOUNT MODAL */}
//       <Modal visible={isDeleteModalVisible} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View
//               style={[styles.modalIconCircle, { backgroundColor: "#FEE2E2" }]}
//             >
//               <Ionicons name="warning" size={32} color="#DC2626" />
//             </View>

//             <Text style={[styles.modalTitle, { color: "#991B1B" }]}>
//               Delete Account?
//             </Text>
//             <Text style={styles.modalSubTitle}>
//               This action is{" "}
//               <Text style={{ fontWeight: "700" }}>irreversible</Text>. The
//               following data will be permanently deleted:
//             </Text>

//             <View style={styles.deletionList}>
//               <Text style={styles.bulletItem}>
//                 • Personal Profile & Credentials
//               </Text>
//               <Text style={styles.bulletItem}>
//                 • Registered Donor Profile & History
//               </Text>
//               <Text style={styles.bulletItem}>
//                 • Notification Preferences & Saved Tokens
//               </Text>
//             </View>

//             <Text
//               style={[styles.label, { alignSelf: "flex-start", marginTop: 10 }]}
//             >
//               Confirm Password
//             </Text>
//             <View
//               style={[
//                 styles.inputWrapper,
//                 fieldErrors.deletePassword && styles.inputErrorBorder,
//               ]}
//             >
//               <Feather
//                 name="lock"
//                 size={18}
//                 color="#64748B"
//                 style={styles.inputIcon}
//               />
//               <TextInput
//                 style={styles.textInput}
//                 value={deletePassword}
//                 onChangeText={(val) => {
//                   setDeletePassword(val);
//                   clearFieldError("deletePassword");
//                 }}
//                 secureTextEntry={!showDeletePass}
//                 placeholder="Enter password to confirm"
//                 placeholderTextColor="#94A3B8"
//               />
//               <TouchableOpacity
//                 onPress={() => setShowDeletePass(!showDeletePass)}
//               >
//                 <Feather
//                   name={showDeletePass ? "eye" : "eye-off"}
//                   size={18}
//                   color="#64748B"
//                 />
//               </TouchableOpacity>
//             </View>
//             {fieldErrors.deletePassword && (
//               <Text style={styles.errorText}>{fieldErrors.deletePassword}</Text>
//             )}

//             <View style={styles.modalActionRow}>
//               <TouchableOpacity
//                 style={styles.cancelModalButton}
//                 onPress={() => setIsDeleteModalVisible(false)}
//                 disabled={deletingAccount}
//               >
//                 <Text style={styles.cancelModalText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.dangerConfirmButton,
//                   deletingAccount && styles.buttonDisabled,
//                 ]}
//                 onPress={handleConfirmDeleteAccount}
//                 disabled={deletingAccount}
//               >
//                 {deletingAccount ? (
//                   <ActivityIndicator color="#FFF" />
//                 ) : (
//                   <Text style={styles.dangerConfirmText}>
//                     Delete Permanently
//                   </Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* GLOBAL CUSTOM ALERT MODAL */}
//       <Modal visible={alertModal.visible} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.alertBox}>
//             <Ionicons
//               name={
//                 alertModal.type === "success"
//                   ? "checkmark-circle"
//                   : alertModal.type === "error"
//                     ? "alert-circle"
//                     : "information-circle"
//               }
//               size={48}
//               color={
//                 alertModal.type === "success"
//                   ? "#10B981"
//                   : alertModal.type === "error"
//                     ? "#DC2626"
//                     : "#2563EB"
//               }
//             />
//             <Text style={styles.alertTitle}>{alertModal.title}</Text>
//             <Text style={styles.alertMessage}>{alertModal.message}</Text>

//             <TouchableOpacity style={styles.alertButton} onPress={hideAlert}>
//               <Text style={styles.alertButtonText}>OK</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: "#F8FAFC",
//   },
//   centerContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#F8FAFC",
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 15,
//     color: "#64748B",
//     fontWeight: "500",
//   },

//   scrollContent: {
//     padding: 18,
//     paddingBottom: 40,
//   },
//   userBanner: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FFFFFF",
//     padding: 16,
//     borderRadius: 16,
//     marginBottom: 16,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOpacity: 0.04,
//     shadowRadius: 8,
//   },
//   avatarCircle: {
//     width: 52,
//     height: 52,
//     borderRadius: 26,
//     backgroundColor: "#FEE2E2",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 14,
//   },
//   avatarText: {
//     fontSize: 22,
//     fontWeight: "700",
//     color: "#DC2626",
//   },
//   bannerDetails: {
//     flex: 1,
//   },
//   userName: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: "#0F172A",
//   },
//   userEmail: {
//     fontSize: 13,
//     color: "#64748B",
//     marginTop: 2,
//   },
//   donorBadge: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#FEF2F2",
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 12,
//     alignSelf: "flex-start",
//     marginTop: 6,
//   },
//   donorBadgeText: {
//     fontSize: 11,
//     color: "#DC2626",
//     fontWeight: "600",
//     marginLeft: 4,
//   },
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 16,
//     padding: 18,
//     marginBottom: 18,
//     elevation: 2,
//     shadowColor: "#000",
//     shadowOpacity: 0.05,
//     shadowRadius: 10,
//   },
//   cardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   cardTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#0F172A",
//     marginLeft: 8,
//   },
//   inputGroup: {
//     marginBottom: 14,
//   },
//   label: {
//     fontSize: 13,
//     fontWeight: "600",
//     color: "#334155",
//     marginBottom: 6,
//   },
//   inputWrapper: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F8FAFC",
//     borderWidth: 1,
//     borderColor: "#E2E8F0",
//     borderRadius: 12,
//     paddingHorizontal: 12,
//     height: 48,
//   },
//   disabledInput: {
//     backgroundColor: "#F1F5F9",
//     borderColor: "#E2E8F0",
//   },
//   inputErrorBorder: {
//     borderColor: "#DC2626",
//     backgroundColor: "#FEF2F2",
//   },
//   inputIcon: {
//     marginRight: 10,
//   },
//   textInput: {
//     flex: 1,
//     fontSize: 14,
//     color: "#0F172A",
//   },
//   errorText: {
//     color: "#DC2626",
//     fontSize: 12,
//     marginTop: 4,
//     fontWeight: "500",
//   },
//   primaryButton: {
//     backgroundColor: "#DC2626",
//     borderRadius: 12,
//     height: 48,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 6,
//     paddingHorizontal: 14,
//   },
//   primaryButtonText: {
//     color: "#FFFFFF",
//     fontWeight: "700",
//     fontSize: 15,
//     fontWeight: "600",
//   },
//   secondaryButton: {
//     backgroundColor: "#FEF2F2",
//     borderWidth: 1,
//     borderColor: "#FECACA",
//     borderRadius: 12,
//     height: 48,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 6,
//   },
//   secondaryButtonText: {
//     color: "#DC2626",
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   buttonDisabled: {
//     opacity: 0.7,
//   },
//   dangerCard: {
//     borderColor: "#FECACA",
//     borderWidth: 1,
//     backgroundColor: "#FFF5F5",
//   },
//   dangerText: {
//     fontSize: 13,
//     color: "#7F1D1D",
//     lineHeight: 18,
//     marginBottom: 16,
//   },
//   dangerButton: {
//     backgroundColor: "#DC2626",
//     borderRadius: 12,
//     height: 46,
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   dangerButtonText: {
//     color: "#FFFFFF",
//     fontWeight: "600",
//     fontSize: 14,
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
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 22,
//     alignItems: "center",
//     elevation: 5,
//   },
//   closeModalButton: {
//     alignSelf: "flex-end",
//     padding: 4,
//   },
//   modalIconCircle: {
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#FEF2F2",
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#0F172A",
//     marginBottom: 6,
//   },
//   modalSubTitle: {
//     fontSize: 13,
//     color: "#64748B",
//     textAlign: "center",
//     lineHeight: 18,
//   },
//   deletionList: {
//     alignSelf: "stretch",
//     backgroundColor: "#F8FAFC",
//     borderRadius: 10,
//     padding: 12,
//     marginVertical: 12,
//   },
//   bulletItem: {
//     fontSize: 12,
//     color: "#475569",
//     marginBottom: 4,
//     fontWeight: "500",
//   },
//   modalActionRow: {
//     flexDirection: "row",
//     marginTop: 18,
//     gap: 12,
//   },
//   cancelModalButton: {
//     flex: 1,
//     height: 46,
//     borderRadius: 12,
//     backgroundColor: "#F1F5F9",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   cancelModalText: {
//     color: "#475569",
//     fontWeight: "600",
//   },
//   dangerConfirmButton: {
//     flex: 1,
//     height: 46,
//     borderRadius: 12,
//     backgroundColor: "#DC2626",
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 8,
//   },
//   dangerConfirmText: {
//     color: "#FFFFFF",
//     fontWeight: "600",
//   },
//   alertBox: {
//     width: "85%",
//     backgroundColor: "#FFFFFF",
//     borderRadius: 20,
//     padding: 24,
//     alignItems: "center",
//     elevation: 5,
//   },
//   alertTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#0F172A",
//     marginTop: 12,
//     marginBottom: 6,
//   },
//   alertMessage: {
//     fontSize: 14,
//     color: "#64748B",
//     textAlign: "center",
//     lineHeight: 20,
//     marginBottom: 18,
//   },
//   alertButton: {
//     backgroundColor: "#0F172A",
//     borderRadius: 10,
//     paddingHorizontal: 28,
//     paddingVertical: 10,
//   },
//   alertButtonText: {
//     color: "#FFFFFF",
//     fontWeight: "600",
//     fontSize: 14,
//   },
// });

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Modal,
  StyleSheet,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useDonor } from "../../context/DonorContext";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

// Replace with your actual API endpoint configuration
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function AccountSettings() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const { fetchDonorStatus } = useDonor();

  // Loading States
  const [initialLoading, setInitialLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [requestingOtp, setRequestingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Edit Mode Toggle States
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  // Profile Form States
  const [fullName, setFullName] = useState("");
  const [initialFullName, setInitialFullName] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [isDonorUser, setIsDonorUser] = useState(false);

  // Email Change States
  const [newEmail, setNewEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");

  // Password Change States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password Visibility Toggles
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [showDeletePass, setShowDeletePass] = useState(false);

  // Delete Account State
  const [deletePassword, setDeletePassword] = useState("");

  // Validation Error States
  const [fieldErrors, setFieldErrors] = useState({});

  // Modal Visibility States
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // Custom Alert Modal State
  const [alertModal, setAlertModal] = useState({
    visible: false,
    type: "info",
    title: "",
    message: "",
  });

  useEffect(() => {
    loadUserProfile();
  }, []);

  const showAlert = (type, title, message) => {
    setAlertModal({ visible: true, type, title, message });
  };

  const hideAlert = () => {
    setAlertModal({ visible: false, type: "info", title: "", message: "" });
  };

  const clearFieldError = (fieldName) => {
    setFieldErrors((prev) => ({ ...prev, [fieldName]: null }));
  };

  const getAuthHeaders = async () => {
    const token = await SecureStore.getItemAsync("userToken");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // 1. Load User Profile
  const loadUserProfile = async () => {
    setInitialLoading(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/user/profile`, { headers });
      const data = await res.json();

      if (res.ok && data.success) {
        const fetchedName = data.user.fullName || "";
        setFullName(fetchedName);
        setInitialFullName(fetchedName);
        setCurrentEmail(data.user.email || "");
        setIsDonorUser(!!data.user.isDonor);
      } else {
        showAlert(
          "error",
          "Error",
          data.message || "Failed to load account settings.",
        );
      }
    } catch (err) {
      showAlert("error", "Network Error", "Could not connect to the server.");
    } finally {
      setInitialLoading(false);
    }
  };

  // Cancel Handlers
  const handleCancelProfileEdit = () => {
    setFullName(initialFullName);
    clearFieldError("fullName");
    setIsEditingProfile(false);
  };

  const handleCancelEmailEdit = () => {
    setNewEmail("");
    clearFieldError("newEmail");
    setIsEditingEmail(false);
  };

  const handleCancelPasswordEdit = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    clearFieldError("currentPassword");
    clearFieldError("newPassword");
    clearFieldError("confirmPassword");
    setIsEditingPassword(false);
  };

  // 2. Update Personal Info
  const handleUpdatePersonalInfo = async () => {
    const errors = {};
    if (!fullName.trim()) errors.fullName = "Full name is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSavingProfile(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/user/profile`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ fullName: fullName.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setInitialFullName(fullName.trim());
        setIsEditingProfile(false);

        if (user) {
          const updatedUserObj = { ...user, fullName: fullName.trim() };
          await SecureStore.setItemAsync(
            "user",
            JSON.stringify(updatedUserObj),
          );
          if (setUser) setUser(updatedUserObj);
        }
        showAlert(
          "success",
          "Success",
          "Personal details updated successfully.",
        );
      } else {
        showAlert(
          "error",
          "Update Failed",
          data.message || "Failed to update personal info.",
        );
      }
    } catch (err) {
      showAlert(
        "error",
        "Network Error",
        "Failed to communicate with backend server.",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  // 3. Request Email Change
  const handleRequestEmailChange = async () => {
    const errors = {};
    const emailRegex = /\S+@\S+\.\S+/;

    if (!newEmail.trim()) {
      errors.newEmail = "New email address is required";
    } else if (!emailRegex.test(newEmail.trim())) {
      errors.newEmail = "Please enter a valid email address";
    } else if (newEmail.trim().toLowerCase() === currentEmail.toLowerCase()) {
      errors.newEmail = "New email cannot be the same as your current email";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setRequestingOtp(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/user/request-email-change`, {
        method: "POST",
        headers,
        body: JSON.stringify({ newEmail: newEmail.trim().toLowerCase() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsOtpModalVisible(true);
        showAlert(
          "info",
          "OTP Sent",
          `Verification code sent to ${newEmail.trim()}`,
        );
      } else {
        showAlert(
          "error",
          "Request Failed",
          data.message || "Failed to request email change.",
        );
      }
    } catch (err) {
      showAlert("error", "Network Error", "Unable to send verification OTP.");
    } finally {
      setRequestingOtp(false);
    }
  };

  // 4. Resend Email Change OTP
  const handleResendOtp = async () => {
    setResendingOtp(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/user/resend-email-change-otp`, {
        method: "POST",
        headers,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        showAlert(
          "success",
          "OTP Sent",
          "A new code has been sent to your new email.",
        );
      } else {
        showAlert(
          "error",
          "Resend Failed",
          data.message || "Could not resend OTP.",
        );
      }
    } catch (err) {
      showAlert("error", "Network Error", "Failed to resend code.");
    } finally {
      setResendingOtp(false);
    }
  };

  // 5. Verify Email Change OTP
  const handleVerifyEmailOtp = async () => {
    const errors = {};
    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      errors.otpCode = "Please enter a valid 6-digit OTP code";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setVerifyingOtp(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/user/verify-email-change`, {
        method: "POST",
        headers,
        body: JSON.stringify({ otp: otpCode.trim() }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        const updatedEmail = data.newEmail || newEmail.trim().toLowerCase();
        setCurrentEmail(updatedEmail);
        setNewEmail("");
        setOtpCode("");
        setIsOtpModalVisible(false);
        setIsEditingEmail(false);

        if (user) {
          const updatedUserObj = { ...user, email: updatedEmail };
          await SecureStore.setItemAsync(
            "user",
            JSON.stringify(updatedUserObj),
          );
          if (setUser) setUser(updatedUserObj);
        }

        showAlert(
          "success",
          "Email Updated",
          "Your email address has been updated successfully.",
        );
      } else {
        showAlert(
          "error",
          "Verification Failed",
          data.message || "Invalid or expired OTP code.",
        );
      }
    } catch (err) {
      showAlert("error", "Network Error", "Failed to verify OTP.");
    } finally {
      setVerifyingOtp(false);
    }
  };

  // 6. Update Password
  const handleChangePassword = async () => {
    const errors = {};
    if (!currentPassword)
      errors.currentPassword = "Current password is required";
    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters long";
    }

    if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setChangingPassword(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/user/change-password`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsEditingPassword(false);
        showAlert(
          "success",
          "Password Changed",
          "Your password has been updated successfully.",
        );
      } else {
        if (data.field === "currentPassword") {
          setFieldErrors({ currentPassword: data.message });
        } else {
          showAlert(
            "error",
            "Update Failed",
            data.message || "Could not update password.",
          );
        }
      }
    } catch (err) {
      showAlert("error", "Network Error", "Failed to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  // 7. Confirm Account Deletion
  const handleConfirmDeleteAccount = async () => {
    const errors = {};
    if (!deletePassword)
      errors.deletePassword = "Password is required to confirm deletion";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setDeletingAccount(true);
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_URL}/api/user/delete-account`, {
        method: "DELETE",
        headers,
        body: JSON.stringify({ password: deletePassword }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsDeleteModalVisible(false);
        setDeletePassword("");

        await SecureStore.deleteItemAsync("userToken");
        await SecureStore.deleteItemAsync("user");

        if (setUser) setUser(null);
        if (fetchDonorStatus) await fetchDonorStatus();

        showAlert(
          "info",
          "Account Deleted",
          "Your account and donor records have been completely removed.",
        );

        setTimeout(() => {
          router.replace("/(dashboard)");
        }, 1200);
      } else {
        setFieldErrors({
          deletePassword: data.message || "Incorrect password",
        });
      }
    } catch (err) {
      showAlert(
        "error",
        "Network Error",
        "Failed to process account deletion.",
      );
    } finally {
      setDeletingAccount(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#DC2626" />
        <Text style={styles.loadingText}>Loading Account Details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* PROFILE SUMMARY BADGE */}
          <View style={styles.userBanner}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {fullName ? fullName.charAt(0).toUpperCase() : "U"}
              </Text>
            </View>
            <View style={styles.bannerDetails}>
              <Text style={styles.userName}>{fullName || "User Name"}</Text>
              <Text style={styles.userEmail}>{currentEmail}</Text>
              {isDonorUser && (
                <View style={styles.donorBadge}>
                  <MaterialCommunityIcons
                    name="heart-pulse"
                    size={14}
                    color="#DC2626"
                  />
                  <Text style={styles.donorBadgeText}>Registered Donor</Text>
                </View>
              )}
            </View>
          </View>

          {/* SECTION 1: PERSONAL INFORMATION */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeader}>
                <Ionicons name="person-outline" size={20} color="#DC2626" />
                <Text style={styles.cardTitle}>Personal Information</Text>
              </View>
              {!isEditingProfile && (
                <TouchableOpacity
                  style={styles.editHeaderButton}
                  onPress={() => setIsEditingProfile(true)}
                >
                  <Feather name="edit-2" size={14} color="#DC2626" />
                  <Text style={styles.editHeaderButtonText}>Edit</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View
                style={[
                  styles.inputWrapper,
                  !isEditingProfile && styles.disabledInput,
                  fieldErrors.fullName && styles.inputErrorBorder,
                ]}
              >
                <Feather
                  name="user"
                  size={18}
                  color="#64748B"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[
                    styles.textInput,
                    !isEditingProfile && { color: "#64748B" },
                  ]}
                  value={fullName}
                  editable={isEditingProfile}
                  onChangeText={(val) => {
                    setFullName(val);
                    clearFieldError("fullName");
                  }}
                  placeholder="Enter full name"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              {fieldErrors.fullName && (
                <Text style={styles.errorText}>{fieldErrors.fullName}</Text>
              )}
            </View>

            {isEditingProfile && (
              <View style={styles.actionButtonGroup}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelProfileEdit}
                  disabled={savingProfile}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.primaryButtonHalf,
                    savingProfile && styles.buttonDisabled,
                  ]}
                  onPress={handleUpdatePersonalInfo}
                  disabled={savingProfile}
                >
                  {savingProfile ? (
                    <ActivityIndicator color="#FFF" size="small" />
                  ) : (
                    <Text style={styles.primaryButtonText}>Save Details</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* SECTION 2: EMAIL ADDRESS MANAGEMENT */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeader}>
                <Ionicons name="mail-outline" size={20} color="#DC2626" />
                <Text style={styles.cardTitle}>Email Address</Text>
              </View>
              {!isEditingEmail && (
                <TouchableOpacity
                  style={styles.editHeaderButton}
                  onPress={() => setIsEditingEmail(true)}
                >
                  <Feather name="edit-2" size={14} color="#DC2626" />
                  <Text style={styles.editHeaderButtonText}>Change Email</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Email</Text>
              <View style={[styles.inputWrapper, styles.disabledInput]}>
                <Feather
                  name="lock"
                  size={18}
                  color="#94A3B8"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.textInput, { color: "#64748B" }]}
                  value={currentEmail}
                  editable={false}
                />
              </View>
            </View>

            {isEditingEmail && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>New Email Address</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      fieldErrors.newEmail && styles.inputErrorBorder,
                    ]}
                  >
                    <Feather
                      name="mail"
                      size={18}
                      color="#64748B"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      value={newEmail}
                      onChangeText={(val) => {
                        setNewEmail(val);
                        clearFieldError("newEmail");
                      }}
                      placeholder="Enter new email address"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                  {fieldErrors.newEmail && (
                    <Text style={styles.errorText}>{fieldErrors.newEmail}</Text>
                  )}
                </View>

                <View style={styles.actionButtonGroup}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelEmailEdit}
                    disabled={requestingOtp}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.secondaryButtonHalf,
                      requestingOtp && styles.buttonDisabled,
                    ]}
                    onPress={handleRequestEmailChange}
                    disabled={requestingOtp}
                  >
                    {requestingOtp ? (
                      <ActivityIndicator color="#DC2626" size="small" />
                    ) : (
                      <Text style={styles.secondaryButtonText}>Send Code</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {/* SECTION 3: CHANGE PASSWORD */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeader}>
                <Ionicons name="key-outline" size={20} color="#DC2626" />
                <Text style={styles.cardTitle}>Password</Text>
              </View>
              {!isEditingPassword && (
                <TouchableOpacity
                  style={styles.editHeaderButton}
                  onPress={() => setIsEditingPassword(true)}
                >
                  <Feather name="lock" size={14} color="#DC2626" />
                  <Text style={styles.editHeaderButtonText}>
                    Change Password
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {!isEditingPassword ? (
              <Text style={styles.readOnlySubtext}>
                Keep your account secure by using a strong password.
              </Text>
            ) : (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Current Password</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      fieldErrors.currentPassword && styles.inputErrorBorder,
                    ]}
                  >
                    <Feather
                      name="lock"
                      size={18}
                      color="#64748B"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      value={currentPassword}
                      onChangeText={(val) => {
                        setCurrentPassword(val);
                        clearFieldError("currentPassword");
                      }}
                      secureTextEntry={!showCurrentPass}
                      placeholder="Enter current password"
                      placeholderTextColor="#94A3B8"
                    />
                    <TouchableOpacity
                      onPress={() => setShowCurrentPass(!showCurrentPass)}
                    >
                      <Feather
                        name={showCurrentPass ? "eye" : "eye-off"}
                        size={18}
                        color="#64748B"
                      />
                    </TouchableOpacity>
                  </View>
                  {fieldErrors.currentPassword && (
                    <Text style={styles.errorText}>
                      {fieldErrors.currentPassword}
                    </Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>New Password</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      fieldErrors.newPassword && styles.inputErrorBorder,
                    ]}
                  >
                    <Feather
                      name="shield"
                      size={18}
                      color="#64748B"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      value={newPassword}
                      onChangeText={(val) => {
                        setNewPassword(val);
                        clearFieldError("newPassword");
                      }}
                      secureTextEntry={!showNewPass}
                      placeholder="At least 6 characters"
                      placeholderTextColor="#94A3B8"
                    />
                    <TouchableOpacity
                      onPress={() => setShowNewPass(!showNewPass)}
                    >
                      <Feather
                        name={showNewPass ? "eye" : "eye-off"}
                        size={18}
                        color="#64748B"
                      />
                    </TouchableOpacity>
                  </View>
                  {fieldErrors.newPassword && (
                    <Text style={styles.errorText}>
                      {fieldErrors.newPassword}
                    </Text>
                  )}
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Confirm New Password</Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      fieldErrors.confirmPassword && styles.inputErrorBorder,
                    ]}
                  >
                    <Feather
                      name="shield"
                      size={18}
                      color="#64748B"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.textInput}
                      value={confirmPassword}
                      onChangeText={(val) => {
                        setConfirmPassword(val);
                        clearFieldError("confirmPassword");
                      }}
                      secureTextEntry={!showConfirmPass}
                      placeholder="Re-enter new password"
                      placeholderTextColor="#94A3B8"
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirmPass(!showConfirmPass)}
                    >
                      <Feather
                        name={showConfirmPass ? "eye" : "eye-off"}
                        size={18}
                        color="#64748B"
                      />
                    </TouchableOpacity>
                  </View>
                  {fieldErrors.confirmPassword && (
                    <Text style={styles.errorText}>
                      {fieldErrors.confirmPassword}
                    </Text>
                  )}
                </View>

                <View style={styles.actionButtonGroup}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={handleCancelPasswordEdit}
                    disabled={changingPassword}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.primaryButtonHalf,
                      changingPassword && styles.buttonDisabled,
                    ]}
                    onPress={handleChangePassword}
                    disabled={changingPassword}
                  >
                    {changingPassword ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <Text style={styles.primaryButtonText}>
                        Update Password
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {/* SECTION 4: DANGER ZONE */}
          <View style={[styles.card, styles.dangerCard]}>
            <View style={styles.cardHeader}>
              <Ionicons name="warning-outline" size={22} color="#DC2626" />
              <Text style={[styles.cardTitle, { color: "#991B1B" }]}>
                Danger Zone
              </Text>
            </View>
            <Text style={styles.dangerText}>
              Deleting your account is permanent. All your registered user
              profile information and associated donor status will be removed
              forever.
            </Text>

            <TouchableOpacity
              style={styles.dangerButton}
              onPress={() => {
                setDeletePassword("");
                clearFieldError("deletePassword");
                setIsDeleteModalVisible(true);
              }}
            >
              <Ionicons
                name="trash-outline"
                size={18}
                color="#FFF"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.dangerButtonText}>Delete My Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* STEP 2: EMAIL OTP VERIFICATION MODAL */}
      <Modal visible={isOtpModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setIsOtpModalVisible(false)}
            >
              <Ionicons name="close" size={22} color="#64748B" />
            </TouchableOpacity>

            <View style={styles.modalIconCircle}>
              <MaterialCommunityIcons
                name="email-check-outline"
                size={32}
                color="#DC2626"
              />
            </View>

            <Text style={styles.modalTitle}>Verify New Email</Text>
            <Text style={styles.modalSubTitle}>
              Enter the 6-digit verification code sent to{"\n"}
              <Text style={{ fontWeight: "700", color: "#1E293B" }}>
                {newEmail}
              </Text>
            </Text>

            <View
              style={[
                styles.inputWrapper,
                fieldErrors.otpCode && styles.inputErrorBorder,
                { marginTop: 15 },
              ]}
            >
              <MaterialCommunityIcons
                name="shield-key-outline"
                size={20}
                color="#64748B"
                style={styles.inputIcon}
              />
              <TextInput
                style={[
                  styles.textInput,
                  { letterSpacing: 4, fontWeight: "700", fontSize: 18 },
                ]}
                value={otpCode}
                onChangeText={(val) => {
                  setOtpCode(val);
                  clearFieldError("otpCode");
                }}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="000000"
                placeholderTextColor="#94A3B8"
              />
            </View>
            {fieldErrors.otpCode && (
              <Text style={styles.errorText}>{fieldErrors.otpCode}</Text>
            )}

            <TouchableOpacity
              style={[
                styles.primaryButton,
                { marginTop: 20 },
                verifyingOtp && styles.buttonDisabled,
              ]}
              onPress={handleVerifyEmailOtp}
              disabled={verifyingOtp}
            >
              {verifyingOtp ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Verify Email</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: 15, paddingVertical: 8 }}
              onPress={handleResendOtp}
              disabled={resendingOtp}
            >
              {resendingOtp ? (
                <ActivityIndicator color="#DC2626" size="small" />
              ) : (
                <Text
                  style={{ color: "#DC2626", fontWeight: "600", fontSize: 14 }}
                >
                  Resend Code
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CONFIRM DELETE ACCOUNT MODAL */}
      <Modal visible={isDeleteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View
              style={[styles.modalIconCircle, { backgroundColor: "#FEE2E2" }]}
            >
              <Ionicons name="warning" size={32} color="#DC2626" />
            </View>

            <Text style={[styles.modalTitle, { color: "#991B1B" }]}>
              Delete Account?
            </Text>
            <Text style={styles.modalSubTitle}>
              This action is{" "}
              <Text style={{ fontWeight: "700" }}>irreversible</Text>. The
              following data will be permanently deleted:
            </Text>

            <View style={styles.deletionList}>
              <Text style={styles.bulletItem}>
                • Personal Profile & Credentials
              </Text>
              <Text style={styles.bulletItem}>
                • Registered Donor Profile & History
              </Text>
              <Text style={styles.bulletItem}>
                • Notification Preferences & Saved Tokens
              </Text>
            </View>

            <Text
              style={[styles.label, { alignSelf: "flex-start", marginTop: 10 }]}
            >
              Confirm Password
            </Text>
            <View
              style={[
                styles.inputWrapper,
                fieldErrors.deletePassword && styles.inputErrorBorder,
              ]}
            >
              <Feather
                name="lock"
                size={18}
                color="#64748B"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                value={deletePassword}
                onChangeText={(val) => {
                  setDeletePassword(val);
                  clearFieldError("deletePassword");
                }}
                secureTextEntry={!showDeletePass}
                placeholder="Enter password to confirm"
                placeholderTextColor="#94A3B8"
              />
              <TouchableOpacity
                onPress={() => setShowDeletePass(!showDeletePass)}
              >
                <Feather
                  name={showDeletePass ? "eye" : "eye-off"}
                  size={18}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>
            {fieldErrors.deletePassword && (
              <Text style={styles.errorText}>{fieldErrors.deletePassword}</Text>
            )}

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.cancelModalButton}
                onPress={() => setIsDeleteModalVisible(false)}
                disabled={deletingAccount}
              >
                <Text style={styles.cancelModalText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.dangerConfirmButton,
                  deletingAccount && styles.buttonDisabled,
                ]}
                onPress={handleConfirmDeleteAccount}
                disabled={deletingAccount}
              >
                {deletingAccount ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.dangerConfirmText}>Delete Permanent</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  userBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#DC2626",
  },
  bannerDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  userEmail: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  donorBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  donorBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#DC2626",
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginLeft: 8,
  },
  editHeaderButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editHeaderButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#DC2626",
    marginLeft: 4,
  },
  readOnlySubtext: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
  },
  disabledInput: {
    backgroundColor: "#F1F5F9",
    borderColor: "#E2E8F0",
  },
  inputErrorBorder: {
    borderColor: "#EF4444",
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: "#0F172A",
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
  actionButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginTop: 6,
  },
  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  primaryButtonHalf: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonHalf: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButton: {
    height: 46,
    borderRadius: 10,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#DC2626",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  dangerCard: {
    borderColor: "#FECACA",
    borderWidth: 1,
    backgroundColor: "#FFF5F5",
  },
  dangerText: {
    fontSize: 13,
    color: "#7F1D1D",
    lineHeight: 18,
    marginBottom: 16,
  },
  dangerButton: {
    flexDirection: "row",
    height: 44,
    borderRadius: 10,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
  },
  dangerButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
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
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  closeModalButton: {
    position: "absolute",
    top: 14,
    right: 14,
    padding: 4,
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 6,
  },
  modalSubTitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 18,
  },
  deletionList: {
    alignSelf: "stretch",
    backgroundColor: "#FEF2F2",
    padding: 12,
    borderRadius: 10,
    marginVertical: 12,
  },
  bulletItem: {
    fontSize: 12,
    color: "#991B1B",
    lineHeight: 18,
    fontWeight: "500",
  },
  modalActionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    width: "100%",
  },
  cancelModalButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelModalText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  dangerConfirmButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
  },
  dangerConfirmText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
