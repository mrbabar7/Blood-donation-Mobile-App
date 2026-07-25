// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   Switch,
//   ActivityIndicator,
//   RefreshControl,
// } from "react-native";
// import {
//   User,
//   Droplet,
//   MapPin,
//   Edit3,
//   Save,
//   Power,
//   Hash,
//   Globe,
//   Eye,
//   EyeOff,
//   Trash2,
//   AlertTriangle,
//   Loader2,
// } from "lucide-react-native";
// import { useRouter } from "expo-router";

// // IMPORTANT: Replace with your actual local IP or production URL
// const API_URL = process.env.EXPO_PUBLIC_API_URL;

// export default function ProfileScreen() {
//   const router = useRouter();

//   // --- STATES ---
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [isProfileExist, setIsProfileExist] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [userData, setUserData] = useState(null);

//   // --- FETCH DATA (Logic from your Web Code) ---
//   const fetchProfile = async () => {
//     try {
//       const response = await fetch(`${API_URL}/api/donors/status`, {
//         method: "GET",
//         // Credentials handle cookies/sessions like your web code
//         headers: { "Content-Type": "application/json" },
//       });

//       const data = await response.json();

//       if (data.registered) {
//         setIsProfileExist(true);
//         setUserData(data.donor);
//       } else {
//         setIsProfileExist(false);
//       }
//     } catch (err) {
//       console.error("Failed to fetch profile:", err);
//       Alert.alert("Error", "Could not connect to the server.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   // --- SAVE/UPDATE LOGIC ---
//   const handleSave = async () => {
//     if (!isEditMode) {
//       setIsEditMode(true);
//       return;
//     }

//     setSaving(true);
//     try {
//       const response = await fetch(`${API_URL}/api/donors/update-profile`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(userData),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setUserData(data.donor);
//         setIsEditMode(false);
//         Alert.alert("Success", "Profile updated successfully!");
//       } else {
//         Alert.alert("Update Failed", "Please check your inputs.");
//       }
//     } catch (err) {
//       Alert.alert("Error", "Failed to update profile.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // --- DELETE LOGIC ---
//   const handleDeleteProfile = () => {
//     Alert.alert(
//       "PERMANENT DELETE",
//       "This will remove you from the donor list. Continue?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Yes, Delete",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               const response = await fetch(
//                 `${API_URL}/api/donors/delete-profile`,
//                 {
//                   method: "DELETE",
//                 },
//               );
//               if (response.ok) {
//                 setIsProfileExist(false);
//                 setUserData(null);
//                 Alert.alert("Deleted", "Donor profile removed.");
//               }
//             } catch (err) {
//               Alert.alert("Error", "Failed to delete profile.");
//             }
//           },
//         },
//       ],
//     );
//   };

//   // --- RENDERING ---

//   if (loading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-white">
//         <ActivityIndicator size="large" color="#991b1b" />
//         <Text className="mt-4 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
//           Loading Donor Data...
//         </Text>
//       </View>
//     );
//   }

//   // If user is not registered as a donor, show the Donor Registration logic
//   if (!isProfileExist) {
//     return (
//       <View className="flex-1 justify-center items-center p-10 bg-white">
//         <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-4">
//           <Droplet size={40} color="#991b1b" />
//         </View>
//         <Text className="text-xl font-black text-gray-800 uppercase text-center">
//           Not a Donor
//         </Text>
//         <Text className="text-gray-500 text-center mt-2 mb-8 font-medium">
//           Register now to show up in search results and help people in need.
//         </Text>
//         <TouchableOpacity
//           onPress={() => setIsProfileExist(true)} // Or navigate to a real DonorForm
//           className="bg-red-800 px-10 py-4 rounded-2xl shadow-lg shadow-red-200"
//         >
//           <Text className="text-white font-black uppercase tracking-widest text-xs">
//             Register Now
//           </Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-gray-50">
//       <ScrollView
//         className="flex-1 px-5 pt-6"
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={loading} onRefresh={fetchProfile} />
//         }
//       >
//         {/* Header */}
//         <View className="flex-row justify-between items-center mb-8">
//           <View>
//             <Text className="text-2xl font-black text-gray-800 uppercase">
//               Profile
//             </Text>
//             <Text className="text-red-800 font-bold text-[10px] uppercase tracking-widest">
//               Verified Donor
//             </Text>
//           </View>
//           <TouchableOpacity
//             onPress={() => router.replace("/login")}
//             className="w-10 h-10 bg-white rounded-full items-center justify-center border border-gray-100 shadow-sm"
//           >
//             <Power size={18} color="#374151" />
//           </TouchableOpacity>
//         </View>

//         {/* Visibility Card */}
//         <View className="bg-white px-5 py-4 rounded-3xl mb-6 flex-row items-center justify-between border border-gray-100 shadow-sm">
//           <View className="flex-row items-center">
//             <View
//               className={`p-2 rounded-xl ${userData?.isAvailable ? "bg-emerald-50" : "bg-gray-100"}`}
//             >
//               {userData?.isAvailable ? (
//                 <Eye size={18} color="#059669" />
//               ) : (
//                 <EyeOff size={18} color="#9ca3af" />
//               )}
//             </View>
//             <View className="ml-3">
//               <Text className="text-gray-800 font-bold text-sm">
//                 Active Status
//               </Text>
//               <Text className="text-gray-400 text-[9px] uppercase font-bold">
//                 {userData?.isAvailable ? "Searchable" : "Hidden"}
//               </Text>
//             </View>
//           </View>
//           <Switch
//             value={userData?.isAvailable}
//             onValueChange={(val) =>
//               setUserData({ ...userData, isAvailable: val })
//             }
//             disabled={!isEditMode}
//             trackColor={{ false: "#d1d5db", true: "#059669" }}
//           />
//         </View>

//         {/* Details Section */}
//         <View className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-100 mb-6">
//           <InputGroup
//             label="Full Name"
//             value={userData?.fullName}
//             icon={<User size={16} color="#9ca3af" />}
//             isEdit={isEditMode}
//             onChange={(t) => setUserData({ ...userData, fullName: t })}
//           />
//           <InputGroup
//             label="Blood Type"
//             value={userData?.bloodType}
//             icon={<Droplet size={16} color="#991b1b" />}
//             isEdit={isEditMode}
//             isRed
//             onChange={(t) => setUserData({ ...userData, bloodType: t })}
//           />
//           <InputGroup
//             label="District"
//             value={userData?.district}
//             icon={<MapPin size={16} color="#9ca3af" />}
//             isEdit={isEditMode}
//             onChange={(t) => setUserData({ ...userData, district: t })}
//           />
//           <InputGroup
//             label="Mobile"
//             value={userData?.mobileNumber}
//             icon={<Globe size={16} color="#9ca3af" />}
//             isEdit={isEditMode}
//             type="phone-pad"
//             onChange={(t) => setUserData({ ...userData, mobileNumber: t })}
//           />

//           <TouchableOpacity
//             onPress={handleSave}
//             disabled={saving}
//             className={`${isEditMode ? "bg-emerald-600" : "bg-red-800"} flex-row items-center justify-center py-4 rounded-2xl mt-4 shadow-lg`}
//           >
//             {saving ? (
//               <ActivityIndicator color="white" size="small" />
//             ) : (
//               <>
//                 {isEditMode ? (
//                   <Save size={18} color="white" />
//                 ) : (
//                   <Edit3 size={18} color="white" />
//                 )}
//                 <Text className="text-white font-bold ml-2 uppercase tracking-tighter">
//                   {isEditMode ? "Save Changes" : "Edit Profile"}
//                 </Text>
//               </>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Danger Zone */}
//         <View className="mb-10 px-2">
//           <View className="flex-row items-center mb-3">
//             <AlertTriangle size={14} color="#dc2626" />
//             <Text className="text-red-600 font-bold text-[10px] uppercase ml-1">
//               Danger Zone
//             </Text>
//           </View>
//           <TouchableOpacity
//             onPress={handleDeleteProfile}
//             className="bg-red-50 border border-red-100 py-4 rounded-2xl flex-row items-center justify-center"
//           >
//             <Trash2 size={16} color="#dc2626" />
//             <Text className="text-red-600 font-bold ml-2 uppercase text-[11px]">
//               Delete Permanently
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// // Helper Component for inputs
// const InputGroup = ({
//   label,
//   value,
//   icon,
//   isEdit,
//   onChange,
//   isRed,
//   type = "default",
// }) => (
//   <View className="mb-5">
//     <Text className="text-gray-400 text-[10px] font-black uppercase mb-2 ml-1 tracking-widest">
//       {label}
//     </Text>
//     <View
//       className={`flex-row items-center px-4 py-3 rounded-2xl border ${isEdit ? "bg-white border-red-200 shadow-sm" : "bg-gray-50 border-transparent"}`}
//     >
//       {icon}
//       <TextInput
//         className={`flex-1 ml-3 font-bold text-sm ${isRed ? "text-red-800" : "text-gray-800"}`}
//         value={value}
//         editable={isEdit}
//         keyboardType={type}
//         onChangeText={onChange}
//       />
//     </View>
//   </View>
// );
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  User,
  Droplet,
  MapPin,
  Edit3,
  Save,
  Power,
  Hash,
  Globe,
  Eye,
  EyeOff,
  Trash2,
  AlertTriangle,
} from "lucide-react-native";
import { useRouter } from "expo-router";

// --- IMPORTANT: Import your DonorForm component here ---
// import DonorForm from "./DonorForm";
import RegisterDonor from "../components/donorForm";
const API_URL = process.env.EXPO_PUBLIC_API_URL;

export default function ProfileScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isProfileExist, setIsProfileExist] = useState(false);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false); // <--- New State
  const [isEditMode, setIsEditMode] = useState(false);
  const [userData, setUserData] = useState(null);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/api/donors/status`);
      const data = await response.json();

      if (data.registered) {
        setIsProfileExist(true);
        setUserData(data.donor);
        setShowRegistrationForm(false);
      } else {
        setIsProfileExist(false);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!isEditMode) {
      setIsEditMode(true);
      return;
    }
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/donors/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (response.ok) {
        setIsEditMode(false);
        Alert.alert("Success", "Profile Updated");
      }
    } catch (err) {
      Alert.alert("Error", "Update Failed");
    } finally {
      setSaving(false);
    }
  };

  // --- RENDERING LOGIC ---

  // 1. Loading State
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#991b1b" />
      </View>
    );
  }

  // 2. Registration Form State (If user is not a donor and clicked "Register Now")
  if (!isProfileExist && showRegistrationForm) {
    return (
      <View className="flex-1 bg-white">
        <RegisterDonor></RegisterDonor>
      </View>
    );
  }

  // 3. Not Registered Placeholder
  if (!isProfileExist) {
    return (
      <View className="flex-1 justify-center items-center p-10 bg-white">
        <View className="w-20 h-20 bg-red-50 rounded-full items-center justify-center mb-4">
          <Droplet size={40} color="#991b1b" />
        </View>
        <Text className="text-xl font-black text-gray-800 uppercase text-center">
          Not a Donor
        </Text>
        <Text className="text-gray-500 text-center mt-2 mb-8 font-medium">
          You haven't registered as a donor yet. Join us to help save lives!
        </Text>
        <TouchableOpacity
          onPress={() => setShowRegistrationForm(true)} // <--- Changes state to show form
          className="bg-red-800 px-10 py-4 rounded-2xl shadow-lg"
        >
          <Text className="text-white font-black uppercase tracking-widest text-xs">
            Register Now
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 4. Registered Donor Profile View
  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1 px-5 pt-6"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchProfile} />
        }
      >
        <View className="flex-row justify-between items-center mb-8">
          <View>
            <Text className="text-2xl font-black text-gray-800 uppercase">
              My Profile
            </Text>
            <Text className="text-red-800 font-bold text-[10px] uppercase tracking-widest">
              Active Donor
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.replace("/login")}
            className="p-3 bg-white rounded-full border border-gray-100 shadow-sm"
          >
            <Power size={18} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Visibility Switch */}
        <View className="bg-white px-5 py-4 rounded-3xl mb-6 flex-row items-center justify-between border border-gray-100 shadow-sm">
          <View className="flex-row items-center">
            {userData?.isAvailable ? (
              <Eye size={18} color="#059669" />
            ) : (
              <EyeOff size={18} color="#9ca3af" />
            )}
            <Text className="text-gray-800 font-bold text-sm ml-3">
              Search Visibility
            </Text>
          </View>
          <Switch
            value={userData?.isAvailable}
            onValueChange={(val) =>
              setUserData({ ...userData, isAvailable: val })
            }
            disabled={!isEditMode}
            trackColor={{ false: "#d1d5db", true: "#059669" }}
          />
        </View>

        {/* Profile Details Card */}
        <View className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-100 mb-6">
          <InputGroup
            label="Full Name"
            value={userData?.fullName}
            icon={<User size={16} color="#9ca3af" />}
            isEdit={isEditMode}
            onChange={(t) => setUserData({ ...userData, fullName: t })}
          />
          <InputGroup
            label="Blood Group"
            value={userData?.bloodType}
            icon={<Droplet size={16} color="#991b1b" />}
            isEdit={isEditMode}
            isRed
            onChange={(t) => setUserData({ ...userData, bloodType: t })}
          />
          <InputGroup
            label="District"
            value={userData?.district}
            icon={<MapPin size={16} color="#9ca3af" />}
            isEdit={isEditMode}
            onChange={(t) => setUserData({ ...userData, district: t })}
          />

          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            className={`${isEditMode ? "bg-emerald-600" : "bg-red-800"} flex-row items-center justify-center py-4 rounded-2xl mt-4 shadow-lg`}
          >
            {saving ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <>
                {isEditMode ? (
                  <Save size={18} color="white" />
                ) : (
                  <Edit3 size={18} color="white" />
                )}
                <Text className="text-white font-bold ml-2 uppercase tracking-tighter">
                  {isEditMode ? "Save Changes" : "Edit Profile"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View className="mb-10 px-2">
          <TouchableOpacity
            onPress={() => {
              /* Add Delete Logic */
            }}
            className="bg-red-50 border border-red-100 py-4 rounded-2xl flex-row items-center justify-center"
          >
            <Trash2 size={16} color="#dc2626" />
            <Text className="text-red-600 font-bold ml-2 uppercase text-[11px]">
              Delete Donor Profile
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const InputGroup = ({ label, value, icon, isEdit, onChange, isRed }) => (
  <View className="mb-5">
    <Text className="text-gray-400 text-[10px] font-black uppercase mb-2 ml-1 tracking-widest">
      {label}
    </Text>
    <View
      className={`flex-row items-center px-4 py-3 rounded-2xl border ${isEdit ? "bg-white border-red-200" : "bg-gray-50 border-transparent"}`}
    >
      {icon}
      <TextInput
        className={`flex-1 ml-3 font-bold text-sm ${isRed ? "text-red-800" : "text-gray-800"}`}
        value={value}
        editable={isEdit}
        onChangeText={onChange}
      />
    </View>
  </View>
);
